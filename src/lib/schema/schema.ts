import { z } from 'zod';

export const loginSchema = z.object({
	password: z.string().min(8, 'Invalid Password')
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const userNameSchema = z.object({
	userId: z.number(),
	name: z.string().min(4, 'Minimum 4 characters')
});

export type UserNameSchema = z.infer<typeof userNameSchema>;

export const isActiveSchema = z.object({
	userId: z.number(),
	isActive: z.boolean()
});

export type IsActiveSchema = z.infer<typeof isActiveSchema>;

export const addSshKeySchema = z.object({
	userId: z.number(),
	sshKey: z.string().min(1, 'Invalid SSH Key')
});

export type AddSshKeySchema = z.infer<typeof addSshKeySchema>;

export const deleteSshKeySchema = z.object({
	userId: z.number(),
	fingerprint: z.string().min(1, 'Invalid Fingerprint')
});

export type DeleteSshKeySchema = z.infer<typeof deleteSshKeySchema>;

export const addUsersToServerSchema = z.object({
	userIds: z.array(z.number()).min(1, 'Please select at least one user'),
	serverId: z.number()
});

export type AddUsersToServerSchema = z.infer<typeof addUsersToServerSchema>;

export const deleteUserFromServerSchema = z.object({
	userId: z.number().min(1, 'Select at least one user'),
	serverId: z.number()
});

export type DeleteUserFromServerSchema = z.infer<typeof deleteUserFromServerSchema>;
