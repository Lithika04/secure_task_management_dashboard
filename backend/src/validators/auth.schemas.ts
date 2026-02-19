import { z } from "zod";

// Request schema for user registration.
export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
});

// Request schema for user login.
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
