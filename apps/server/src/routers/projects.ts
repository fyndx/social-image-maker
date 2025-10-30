import { z } from "zod";
import prisma from "@/infra/db";
import { protectedProcedure } from "@/lib/orpc";

export const projectsRouter = {
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional(),
        offset: z.number().min(0).optional(),
      })
    )
    .handler(async ({ context, input }) => {
      const limit = input?.limit ?? 20; // Default limit to 20
      const offset = input?.offset ?? 0; // Default offset to 0
      const projects = await prisma.project.findMany({
        where: {
          userId: context.session.user.id,
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
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
      const project = await prisma.project.findUnique({
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
      const project = await prisma.project.delete({
        where: {
          id: input.id,
          userId: context.session.user.id,
        },
      });
      return project;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        domain: z.string().url().optional(),
      })
    )
    .handler(async ({ context, input }) => {
      const updateData: { name?: string; domain?: string } = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.domain !== undefined) updateData.domain = input.domain;

      const project = await prisma.project.update({
        where: {
          id: input.id,
          userId: context.session.user.id,
        },
        data: updateData,
      });
      return project;
    }),
};
