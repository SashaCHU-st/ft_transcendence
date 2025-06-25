import { z } from "zod";

export const statisticsSchema = z.object({
  username: z.string(),
});

export const winSchema = z.object({
  user_id: z.number(),
  challenge_id:z.number()
});
export const opponentStatsParamsSchema = z.object({
  user_id: z.coerce.number(),
});
