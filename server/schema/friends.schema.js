import { z } from "zod"; /// validation


export const usersSchema = z.object({
  username: z.string().max(20)
});

export const FriendsSchema = z.object({
  //user_id: z.number(),
  user_id: z.coerce.number(),
  username:z.string()
  // username: z.string().max(20)
});

export const FriendsAccept = z.object({
  //user_id: z.number(),
  user_id: z.coerce.number(),
  username:z.string(),
  confirmReq: z.coerce.number()
  //confirmReq: z.string()///????? maybe int need to check
});

export const FriendsRequest = z.object({
  //user_id: z.number(),
  user_id: z.coerce.number(),
  // username:z.string(),
  // confirmReq: z.string()///????? maybe int need to check
});

export const FriendsMy = z.object({
  //user_id: z.number()
  user_id: z.coerce.number(),
});
