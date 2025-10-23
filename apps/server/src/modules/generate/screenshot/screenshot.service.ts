import { Env } from "@/env/schema";
import prisma from "@/infra/db";
import { polarClient } from "@/lib/payments";
import { putObject } from "@/lib/s3-client";
import { hasActiveSubscription, hasMeterBalance } from "@/utils/polar-helpers";
import {
  extractContentType,
  sanitizeAndValidateUrl,
} from "@/utils/url-helpers";

export async function generateScreenshotService(url: string) {
  // 1. Sanitize and validate the URL
  const sanitizedUrl = sanitizeAndValidateUrl(url);
  // 2. Check if the domain exists in the projects table
  const project = await prisma.project.findUnique({
    where: {
      domain: sanitizedUrl.origin,
    },
    include: { user: true },
  });

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

  const hasSubscription = hasActiveSubscription(customerState);

  if (!hasSubscription) {
    return {
      success: false,
      status: 403,
      error: "No active subscription",
    };
  }

  // Check if screenshot already exists
  const screenshotUrl = `${sanitizedUrl.origin}${sanitizedUrl.pathname}`;
  const existingImage = await prisma.generatedImage.findFirst({
    where: {
      projectId: project.id,
      urlPath: screenshotUrl,
    },
  });

  if (existingImage) {
    return {
      success: true,
      status: 302,
      data: existingImage.imageUrl,
    };
  }

  // Check Credits
  const hasBalance = hasMeterBalance(customerState);
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

  if (!checkPageExists.ok) {
    return {
      success: false,
      status: checkPageExists.status,
      error: `The requested page is not available (HTTP ${checkPageExists.status})`,
    };
  }

  // Generate Screenshot
  const screenshot = await captureScreenshot(screenshotUrl);

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
  const buffer = Buffer.from(arrayBuffer);

  const { success: _success, error } = await putObject({
    bucket: "og-images-staging",
    key: `${encodeURIComponent(screenshotUrl)}.png`,
    body: buffer,
    contentType,
  });

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
      imageUrl: `${Env.S3_ENDPOINT}/${encodeURIComponent(screenshotUrl)}.png`,
    },
  });

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

  // Return image blob
  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
    },
  });
}

async function captureScreenshot(url: string): Promise<Response> {
  const encodedUrl = encodeURIComponent(url);
  const browserlessUrl = Env.BROWSERLESS_URL;
  const browserlessToken = Env.BROWSERLESS_TOKEN;

  if (!(browserlessUrl && browserlessToken)) {
    return new Response("Browserless configuration error", { status: 500 });
  }

  const apiUrl = `${browserlessUrl}/screenshot?token=${browserlessToken}&stealth=true`;
  const screenshotResponse = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: encodedUrl,
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
