import { z } from "zod"; /// validation

export const SignUpSchema = z.object({
  name: z.string().max(20)
  .refine((value) => value.trim().length > 0, 'Name cannot be only spaces')
  .refine((value) => /^\p{L}+(?:[- ]\p{L}+)*$/u.test(value),'Name can be only letters'),
  username: z.string().max(20)
  .refine((value) => value.trim().length > 0, 'Name cannot be only spaces')
  .refine((value) => /^[a-zA-Z0-9_]+$/.test(value),'Nickname only letters, numbers, underscore(no spaces)'),
  email: z.string().max(40).email(),
  password: z.string().min(4).max(40),
});

export const LoginSchema = z.object({
    email: z.string().max(40).email(),
    password: z.string().min(4).max(40),
  });
  
export const LogoutSchema = z.object({
    user_id: z.string(),
  });
  

