import { z } from "zod"; /// validation

export const FriendsSchema = z.object({
  nickname: z.string().max(20)
});

export const FriendsAddSchema = z.object({
  id: z.string(),
  id2:z.string()
  // nickname: z.string().max(20)
});

export const FriendsAccept = z.object({
  id: z.string(),
  id2:z.string(),
  confirmReq: z.string()///????? maybe int need to check
  // nickname: z.string().max(20)
});