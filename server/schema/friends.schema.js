import { z } from "zod";

export const usersSchema = z.object({
  username: z.string().max(20)
});
export const FriendsSchema = z.object({
  user_id: z.coerce.number(),
  username:z.string()
});
export const FriendsAccept = z.object({
  user_id: z.coerce.number(),
  username:z.string(),
  confirmReq: z.coerce.number()
});
export const FriendsRequest = z.object({
  user_id: z.coerce.number(),
});
export const FriendsMy = z.object({
  user_id: z.coerce.number(),
});
