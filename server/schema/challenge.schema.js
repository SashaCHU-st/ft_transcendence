import { z } from "zod"; /// validation


export const challengeSchema = z.object({
    user_id:z.string(),
    username: z.string()
});

export const notificationSchema = z.object({
   // user_id:z.number()
    //user_id:z.string()
     user_id: z.coerce.number(),
});

export const acceptSchema = z.object({
    // user_id:z.number(),
    
    user_id:z.string(),
    friends_id:z.number()
    //friends_id:z.string()
});