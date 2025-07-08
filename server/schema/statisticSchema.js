import { z } from "zod";

export const statisticsSchema = z.object({
  username: z.string(),
});

export const winSchema = z.object({
  user_id: z.number(),
  challenge_id: z.number().optional(),
  score: z.number().optional(),
});

export const aiResultSchema = z.object({
  user_id: z.number(),
  player_score: z.number(),
  ai_score: z.number(),
  player_won: z.boolean(),
});
export const opponentStatsParamsSchema = z.object({
  user_id: z.coerce.number(),
});
