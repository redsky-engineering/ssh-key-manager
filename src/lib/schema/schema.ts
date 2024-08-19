import { z } from 'zod';

export const loginSchema = z.object({
	password: z.string().min(8, 'Invalid Password')
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const userNameSchema = z.object({
	id: z.number(),
	name: z.string().min(4, 'Minimum 4 characters')
});

export type UserNameSchema = z.infer<typeof userNameSchema>;

export const isActiveSchema = z.object({
	id: z.number(),
	isActive: z.boolean()
});

export type IsActiveSchema = z.infer<typeof isActiveSchema>;
