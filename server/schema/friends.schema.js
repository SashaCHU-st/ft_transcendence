import { z } from "zod"; /// validation

export const FriendsSchema = z.object({
  username: z.string().max(20)
});

export const FriendsAddSchema = z.object({
  id: z.string().max(),
  username: z.string().max(20)
});