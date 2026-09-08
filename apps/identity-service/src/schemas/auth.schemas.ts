import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    fullName: z.string().min(1, 'Full name is required').optional(),
    phone: z
        .string()
        .trim()
        .regex(/^0\d{9}$/, 'Phone must contain exactly 10 digits and start with 0'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;