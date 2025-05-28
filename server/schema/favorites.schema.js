import { z } from "zod"; /// validation


// export const favoritesSchema = z.object({
//     user_id:z.number(),
//     username: z.string().max(20)
// });

export const favoritesSchema = z.object({
  user_id: z.string().min(1),
  username: z.string().max(20),
});