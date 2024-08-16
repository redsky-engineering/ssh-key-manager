import { z } from 'zod';

export const loginSchema = z.object({
	password: z.string().min(8, 'Invalid Password')
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const userNameSchema = z.object({
	name: z.string().min(4, 'Minimum 4 characters')
});

export type UserNameSchema = z.infer<typeof userNameSchema>;
