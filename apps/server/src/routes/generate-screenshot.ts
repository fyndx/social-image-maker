import type { CustomerState } from "@polar-sh/sdk/models/components/customerstate.js";
import Elysia, { t } from "elysia";
import prisma from "@/db";
import { polarClient } from "@/lib/payments";
import { putObject } from "@/lib/s3-client";

function hasActiveSubscription(customerState: CustomerState) {
  return customerState.activeSubscriptions?.some(
    (sub) => sub.status === "active"
  );
}

function hasMeterBalance(customerState: CustomerState) {
  return customerState.activeMeters?.some((meter) => meter.balance > 0);
}

export const generateScreenshot = new Elysia().get(
  "/generate-screenshot",
  async (context) => {
    // http://fyndx.io/generate/screenshot?url=https://social-image-maker.vercel.app/blog/article-1?utm_source=twitter
    // Clean the URL by removing any query parameters
    const url = context.query.url;
    // 1. Get the URL from the query params
    const screenshotUrlRaw = new URL(
      url.startsWith("http") ? url : `https://${url}`
    );
    // 2. Validate the URL

    // 3. Extract the domain from the URL
    const origin = screenshotUrlRaw.origin;
    // 4. Check if the domain exists in the projects table
    // 5. If exists, get the user associated with the project
    const project = await prisma.project.findUnique({
      where: {
        domain: origin,
      },
      include: { user: true },
    });

    if (!project) {
      return context.status(404, "Project not found for the given domain");
    }
    // 6. Check if the user is subscribed to a plan
    // TODO: move external state to internal state on user table
    const customerState = await polarClient.customers.getStateExternal({
      externalId: project?.user.id,
    });

    const hasSubscription = hasActiveSubscription(customerState);

    if (!hasSubscription) {
      return context.status(403, "User does not have an active subscription");
    }
    // 6.1 check if the page url screenshot is in db
    const existingImage = await prisma.generatedImage.findFirst({
      where: {
        projectId: project.id,
        urlPath: screenshotUrlRaw.href,
      },
    });

    // if exists, return the image blob instead of url
    if (existingImage) {
      // TODO: Test this
      return context.status(302, existingImage.imageUrl);
    }

    // if image does not exist, check if user has enough credits
    const hasBalance = hasMeterBalance(customerState);

    if (!hasBalance) {
      return context.status(403, "User does not have enough credits");
    }

    // 6.1 Check if the page exists and gives 200
    const checkPageExists = await fetch(screenshotUrlRaw.href, {
      method: "HEAD",
    });
    if (checkPageExists.status === 404) {
      return context.status(404, "The requested page does not exist");
    }

    const screenshotUrl = `${screenshotUrlRaw.origin}${screenshotUrlRaw.pathname}`;
    const encodedUrl = encodeURIComponent(screenshotUrl);
    const browserlessUrl = process.env.BROWSERLESS_URL;
    const browserlessToken = process.env.BROWSERLESS_TOKEN;
    if (!(browserlessUrl && browserlessToken)) {
      return context
        .status(500)
        .body({ error: "Browserless configuration is missing" });
    }
    const apiUrl = `${browserlessUrl}/screenshot?token=${browserlessToken}&stealth=true`;
    const screenshotResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: screenshotUrl,
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

    if (screenshotResponse.ok) {
      const contentType = screenshotResponse.headers.get("Content-Type");
      const arrayBuffer = await screenshotResponse.arrayBuffer();

      const { success, error, response } = await putObject({
        bucket: "og-images-staging",
        key: `${encodedUrl}.png`,
        body: arrayBuffer,
        contentType,
      });

      if (error || !success) {
        return context.status(500).body({ error: "Error uploading to S3" });
      }

      await prisma.generatedImage.create({
        data: {
          projectId: project.id,
          urlPath: screenshotUrl,
          // imageUrl
        },
      });

      polarClient.events.ingest({
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

      return new Response({ success: true });
    }

    return context.status(500, "Internal Server Error");
  },
  {
    query: t.Object({
      url: t.String(),
    }),
  }
);
