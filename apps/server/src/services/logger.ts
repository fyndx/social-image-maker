import { formatters, serializers } from "@bogeychan/elysia-logger";
import { pino } from "pino";

export const logger = pino({
  serializers,
  formatters,
  transport: { target: "pino-pretty", options: { colorize: true } },
});
