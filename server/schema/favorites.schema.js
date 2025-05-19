import { z } from "zod"; /// validation


export const favoritesSchema = z.object({
    user_id:z.string(),
  username: z.string().max(20)
});