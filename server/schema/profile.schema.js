import { z } from "zod"

export const ProfileSchema = z.object
(
    {
        name: z.string().max(20),
        nickname: z.string().max(20),
        password: z.string().min(4).max(40),
        email: z.string().max(40).email(),
    }
)