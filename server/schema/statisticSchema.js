import { z } from "zod";

export const statisticsSchema = z.object({
  user_id: z.number(),
});

export const winSchema = z.object({
  user_id: z.number(),
});
