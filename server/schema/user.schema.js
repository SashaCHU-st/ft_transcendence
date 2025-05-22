import { z } from "zod"; /// validation

export const SignUpSchema = z.object({
  name: z.string().max(20).refine((value) => /^\p{L}+(?:[- ]\p{L}+)*$/u.test(value ?? ""), 'only alphabets'),
  username: z.string().max(20).refine((value) => /^[a-zA-Z0-9_]+$/.test(value),'Only letters, numbers, underscore'),
  email: z.string().max(40).email(),
  password: z.string().min(4).max(40),
});

export const LoginSchema = z.object({
    email: z.string().max(40).email(),
    password: z.string().min(4).max(40),
  });
  
export const LogoutSchema = z.object({
    user_id: z.number(),
  });
  

