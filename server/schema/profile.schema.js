import { z } from "zod";

export const ProfileSchema = z.object({
  username: z
    .string()
    .max(20)
    .refine((value) => value.trim().length > 0, "Name cannot be only spaces")
    .refine(
      (value) => /^[a-zA-Z0-9_]+$/.test(value),
      "Nickname only letters, numbers, underscore(no spaces)"
    ).optional(),
  password: z.string().min(4).max(40).optional(),
  name: z
    .string()
    .max(20)
    .optional()
    .refine((value) => value.trim().length > 0, "Name cannot be only spaces")
    .refine(
      (value) => /^\p{L}+(?:[- ]\p{L}+)*$/u.test(value),
      "Name can be only letters"
    ).optional(),
  avatar: z.string().optional(),
});
