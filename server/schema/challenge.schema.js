import { z } from "zod"; /// validation


export const challengeSchema = z.object({
    user_id:z.number(),
    username: z.string()
});

export const notificationSchema = z.object({
    user_id:z.number()
});

export const acceptSchema = z.object({
    user_id:z.number(),
    friends_id:z.number()
});