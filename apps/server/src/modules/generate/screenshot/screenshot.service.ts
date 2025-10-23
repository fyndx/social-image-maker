import { Env } from "@/env/schema";
import prisma from "@/infra/db";
import { logger } from "@/infra/logger";
import { polarClient } from "@/lib/payments";
import { putObject } from "@/lib/s3-client";
import { getSha256Hash } from "@/utils/hash";
import { hasActiveSubscription, hasMeterBalance } from "@/utils/polar-helpers";
import {
  extractContentType,
  sanitizeAndValidateUrl,
} from "@/utils/url-helpers";

export async function generateScreenshotService(url: string) {
  // 1. Sanitize and validate the URL
  logger.info(`Generating screenshot for URL: ${url}`);
  const sanitizedUrl = sanitizeAndValidateUrl(url);
  logger.info(`Sanitized URL: ${sanitizedUrl.toString()}`);
  // 2. Check if the domain exists in the projects table
  const project = await prisma.project.findUnique({
    where: {
      domain: sanitizedUrl.origin,
    },
    include: { user: true },
  });

  logger.info(
    `${project ? "Found" : "No"} project for domain: ${sanitizedUrl.origin}`
  );
  // 3. If no project found, return error
  if (!project) {
    return {
      success: false,
      status: 404,
      error: "You need to signup to use the service",
    };
  }

  // Check Subscription
  // TODO: move external state to internal state on user table
  const customerState = await polarClient.customers.getStateExternal({
    externalId: project.user.id,
  });
  logger.info(`Fetched customer state for user ID: ${project.user.id}`);

  const hasSubscription = hasActiveSubscription(customerState);
  logger.info(
    `User ${project.user.id} subscription: ${hasSubscription ? "active" : "inactive"}`
  );

  if (!hasSubscription) {
    return {
      success: false,
      status: 403,
      error: "No active subscription",
    };
  }

  // Check if screenshot already exists
  const screenshotUrl = `${sanitizedUrl.origin}${sanitizedUrl.pathname}`;
  logger.info(`Checking existing screenshot for URL path: ${screenshotUrl}`);
  const existingImage = await prisma.generatedImage.findFirst({
    where: {
      projectId: project.id,
      urlPath: screenshotUrl,
    },
  });
  logger.info(
    `${existingImage ? existingImage.imageUrl : "No"} existing screenshot found for URL path: ${screenshotUrl}`
  );

  if (existingImage) {
    return {
      success: true,
      status: 302,
      data: existingImage.imageUrl,
    };
  }

  // Check Credits
  const hasBalance = hasMeterBalance(customerState);
  logger.info(
    `User ${project.user.id} meter balance: ${hasBalance ? "sufficient" : "insufficient"}`
  );
  if (!hasBalance) {
    return {
      success: false,
      status: 403,
      error: "Insufficient credits",
    };
  }

  // Verify page exists
  const checkPageExists = await fetch(screenshotUrl, {
    method: "HEAD",
  });
  logger.info(
    `Page existence check for URL ${screenshotUrl}: ${checkPageExists.status}`
  );

  if (!checkPageExists.ok) {
    return {
      success: false,
      status: checkPageExists.status,
      error: `The requested page is not available (HTTP ${checkPageExists.status})`,
    };
  }

  // Generate Screenshot
  const screenshot = await captureScreenshot(screenshotUrl);
  logger.info(
    `Screenshot generation response status for URL ${screenshotUrl}: ${screenshot.status}`
  );

  if (!screenshot.ok) {
    return {
      success: false,
      status: 500,
      error: "Error generating screenshot",
    };
  }

  // Upload to S3
  const contentType = extractContentType(screenshot.headers);
  const arrayBuffer = await screenshot.arrayBuffer();

  const urlSha256 = getSha256Hash(screenshotUrl);
  const imageUrlUploadKey = `${sanitizedUrl.hostname}/${urlSha256}.png`;
  logger.info({ imageUrlUploadKey }, "Uploading screenshot to S3 with key");
  const { success, error } = await putObject({
    bucket: "og-images-staging",
    path: imageUrlUploadKey,
    data: arrayBuffer,
    contentType,
  });

  logger.info(
    `S3 upload ${success ? "succeeded" : "failed"} for URL path: ${screenshotUrl}`
  );

  if (error) {
    return {
      success: false,
      status: 500,
      error: "Error uploading to S3",
    };
  }

  // Save record in DB
  const _newImage = await prisma.generatedImage.create({
    data: {
      projectId: project.id,
      urlPath: screenshotUrl,
      imageUrl: `${Env.S3_PUBLIC_ACCESS_URL}/${imageUrlUploadKey}`,
    },
  });

  logger.info(
    `Saved new generated image record in DB for URL path: ${screenshotUrl}`
  );

  // Ingest event
  await polarClient.events.ingest({
    events: [
      {
        name: "og-file-generated",
        externalCustomerId: project?.user.id,
        metadata: {
          route: "/api/metered-route",
          method: "GET",
        },
      },
    ],
  });

  logger.info(
    `Ingested og-file-generated event for user ID: ${project.user.id}`
  );

  // Return image blob
  return new Response(arrayBuffer, {
    headers: {
      "Content-Type": contentType,
    },
  });
}

async function captureScreenshot(url: string): Promise<Response> {
  const browserlessUrl = Env.BROWSERLESS_URL;
  const browserlessToken = Env.BROWSERLESS_TOKEN;

  if (!(browserlessUrl && browserlessToken)) {
    return new Response("Browserless configuration error", { status: 500 });
  }

  const apiUrl = `${browserlessUrl}/chromium/screenshot?token=${browserlessToken}&stealth=true`;
  logger.info({ apiUrl }, "Calling browserless screenshot API");
  const screenshotResponse = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      userAgent: {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      options: {
        type: "jpeg",
        quality: 100,
      },
      gotoOptions: {
        waitUntil: "networkidle0",
      },
      viewport: {
        width: 1200,
        height: 630,
        deviceScaleFactor: 2,
      },
    }),
  });

  return screenshotResponse;
}
