import "dotenv/config";
import { google } from "@ai-sdk/google";
import { wrap } from "@bogeychan/elysia-logger";
import { cors } from "@elysiajs/cors";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { convertToModelMessages, streamText } from "ai";
import { Elysia } from "elysia";
import { Env } from "./env/schema";
import { auth } from "./lib/auth";
import { createContext } from "./lib/context";
import { appRouter } from "./routers";
import { generateScreenshot } from "./routes/generate-screenshot";
import { logger } from "./services/logger";

export const PORT = 3000;

const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      logger.error(error);
    }),
  ],
});

const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
  interceptors: [
    onError((error) => {
      logger.error(error);
    }),
  ],
});

const app = new Elysia()
  .use(wrap(logger, { autoLogging: true }))
  .use(
    cors({
      origin: Env.CORS_ORIGIN || "",
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  )
  .all("/api/auth/*", async (context) => {
    const { request, status } = context;
    if (["POST", "GET"].includes(request.method)) {
      return auth.handler(request);
    }
    return status(405);
  })
  .all("/rpc*", async (context) => {
    const { response } = await rpcHandler.handle(context.request, {
      prefix: "/rpc",
      context: await createContext({ context }),
    });
    return response ?? new Response("Not Found", { status: 404 });
  })
  .all("/api*", async (context) => {
    const { response } = await apiHandler.handle(context.request, {
      prefix: "/api",
      context: await createContext({ context }),
    });
    return response ?? new Response("Not Found", { status: 404 });
  })
  .post("/ai", async (context) => {
    const body = await context.request.json();
    const uiMessages = body.messages || [];
    const result = streamText({
      model: google("gemini-2.0-flash"),
      messages: convertToModelMessages(uiMessages),
    });

    return result.toUIMessageStreamResponse();
  })
  .use(generateScreenshot)
  .get("/", () => "OK")
  .listen(PORT, () => {
    logger.info(`Server is running on ${app.server?.url}`);
  });
