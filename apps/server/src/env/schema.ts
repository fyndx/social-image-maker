/** biome-ignore-all lint/style/useNamingConvention: environment variables */
import { Type } from "typebox";
import Value from "typebox/value";
import { logger } from "@/infra/logger";

export const EnvSchema = Type.Object({
  DATABASE_URL: Type.String({ format: "uri" }),
  CORS_ORIGIN: Type.String(),
  BETTER_AUTH_SECRET: Type.String(),
  BETTER_AUTH_URL: Type.String({ format: "uri" }),
  POLAR_ACCESS_TOKEN: Type.String(),
  POLAR_SUCCESS_URL: Type.String({ format: "uri" }),
  BROWSERLESS_TOKEN: Type.String(),
  BROWSERLESS_URL: Type.String({ format: "uri" }),
  S3_ENDPOINT: Type.String({ format: "uri" }),
  ACCESS_KEY_ID: Type.String(),
  SECRET_ACCESS_KEY: Type.String(),
});

try {
  const isValidEnv = Value.Check(EnvSchema, process.env);
  if (!isValidEnv) {
    throw new Error("Invalid environment variables");
  }
  logger.info("Environment variables validated successfully");
} catch (error) {
  logger.error({ error }, "Environment variable validation error:");
  process.exit(1);
}

export const Env = Value.Parse(EnvSchema, process.env);
