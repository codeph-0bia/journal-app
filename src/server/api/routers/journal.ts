import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const journalRouter = createTRPCRouter({
  createEntry: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { content } = input;

      const newEntry = await db.entry.create({
        data: {
          content,
          userId: session.user.id,
        },
        select: {
          id: true,
        },
      });

      return newEntry;
    }),
  getEntryById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const { db, session } = ctx;

      const entry = await db.entry.findFirst({
        where: {
          userId: session.user.id,
          id,
        },
      });
      return entry;
    }),
});