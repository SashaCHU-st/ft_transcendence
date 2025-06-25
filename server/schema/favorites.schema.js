import { z } from "zod"; 

export const favoritesSchema = z.object({
  user_id: z.string().min(1),
  username: z.string().max(20),
});