import type { RouterClient } from "@orpc/server";
import { protectedProcedure, publicProcedure } from "../lib/orpc";
import { projectsRouter } from "./projects";
import { todoRouter } from "./todo";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => "OK"),
  privateData: protectedProcedure.handler(({ context }) => ({
    message: "This is private",
    user: context.session?.user,
  })),
  projects: projectsRouter,
  todo: todoRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
