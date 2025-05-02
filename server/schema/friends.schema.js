import { z } from "zod"; /// validation

export const usersSchema = z.object({
  nickname: z.string().max(20)
});

export const FriendsSchema = z.object({
  user_id: z.string(),
  friend_id:z.string()
  // nickname: z.string().max(20)
});

export const FriendsAccept = z.object({
  user_id: z.string(),
  friend_id:z.string(),
  confirmReq: z.string()///????? maybe int need to check
});

export const FriendsMy = z.object({
  user_id: z.string()
});
