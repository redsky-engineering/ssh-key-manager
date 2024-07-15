import { z } from 'zod';

export const loginSchema = z.object({
	password: z.string().min(8, 'Invalid Password')
});

export type LoginSchema = z.infer<typeof loginSchema>;
