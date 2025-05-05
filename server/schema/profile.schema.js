import { z } from "zod"

export const ProfileSchema = z.object
(
    {
        name: z.string().max(20),
        username: z.string().max(20),
        password: z.string().min(4).max(40),
        id: z.string(),
        // image: z.string(),
    }
)