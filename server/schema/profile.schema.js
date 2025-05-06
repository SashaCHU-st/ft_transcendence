import { z } from "zod";


export const ProfileSchema = z
  .object({
    username: z.string().max(20).optional(),
    password: z.string().min(4).max(40).optional(),
    name: z.string().max(20).optional(),
    avatar: z.string().optional(),
  });
