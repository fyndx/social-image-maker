import z from "zod";
import prisma from "@/db";
import { protectedProcedure } from "@/lib/orpc";

export const projectsRouter = {
  getAll: protectedProcedure.handler(async ({ context }) => {
    const projects = await prisma.project.findMany({
      where: {
        userId: context.session.user.id,
      },
    });
    return projects;
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string(), domain: z.url() }))
    .handler(async ({ context, input }) => {
      const project = await prisma.project.create({
        data: {
          userId: context.session.user.id,
          name: input.name,
          domain: input.domain,
        },
      });
      return project;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ context, input }) => {
      const project = await prisma.project.findFirst({
        where: {
          id: input.id,
          userId: context.session.user.id,
        },
      });
      return project;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ context, input }) => {
      const project = await prisma.project.deleteMany({
        where: {
          id: input.id,
          userId: context.session.user.id,
        },
      });
      return project;
    }),
};
