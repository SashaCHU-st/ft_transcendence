import { z } from "zod"; /// validation

export const FriendsSchema = z.object({
  nickname: z.string().max(20)
});

export const FriendsAddSchema = z.object({
  id: z.string().max(),
  nickname: z.string().max(20)
});