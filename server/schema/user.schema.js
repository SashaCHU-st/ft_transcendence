import { z } from "zod"; /// validation

export const SignUpSchema = z.object({
  name: z.string().max(20),
  username: z.string().max(20),
  email: z.string().max(40).email(),
  password: z.string().min(4).max(40),
});

export const LoginSchema = z.object({
    email: z.string().max(40).email(),
    password: z.string().min(4).max(40),
  });
  
