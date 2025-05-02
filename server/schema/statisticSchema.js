import { z } from "zod";

export const statisticsSchema = z.object({
  user_id: z.string(),
});
