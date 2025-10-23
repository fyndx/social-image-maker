import Elysia from "elysia";
import { generateScreenshotService } from "./screenshot.service";
import { ScreenshotQuerySchema } from "./screenshot-schema";

export const screenshotModule = new Elysia().get(
  "/generate-screenshot",
  async (context) => {
    const { url: queryUrl } = context.query;
    const res = await generateScreenshotService(queryUrl);
    return res;
  },
  {
    query: ScreenshotQuerySchema,
  }
);
