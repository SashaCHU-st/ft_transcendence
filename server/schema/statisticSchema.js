import { z } from "zod";
// import { challenge } from "../controllers/challenge";

export const statisticsSchema = z.object({
  user_id: z.number(),
});

export const winSchema = z.object({
  user_id: z.number(),
  challenge_id: z.number().optional(),
  score: z.number(),
});

export const aiResultSchema = z.object({
  user_id: z.number(),
  player_score: z.number(),
  ai_score: z.number(),
  player_won: z.boolean(),
});
