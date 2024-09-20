// Note: To make deployments easier we are not going to use a traditional
// database. Instead we are going to use a simple in-memory database that is
// loaded into memory when the server starts from json files. Any updates
// to the database will be written to the json files.

import { promises as fs } from 'fs';
import { z } from 'zod';
import { STORAGE_PATH } from '$env/static/private';

if (!STORAGE_PATH) {
	throw new Error('STORAGE_PATH is not set');
}

const sshKeyDataSchema = z.object({
	comment: z.string(),
	fingerPrint: z.string(),
	publicKey: z.string()
});

const userDataSchema = z.object({
	id: z.number(),
	isSystemAdmin: z.boolean(),
	isActive: z.boolean(),
	name: z.string(),
	sshKeyData: z.array(sshKeyDataSchema)
});
const userDataArraySchema = z.array(userDataSchema);

export type UserData = z.infer<typeof userDataSchema>;

const serverDataSchema = z.object({
	id: z.number(),
	name: z.string(),
	ipAddress: z.string(),
	lastHeartbeatOn: z.string(),
	cpuUsagePercent: z.number(),
	memoryUsagePercent: z.number(),
	diskUsagePercent: z.number(),
	userIds: z.array(z.number())
});

export type ServerData = z.infer<typeof serverDataSchema>;

const serverDataArraySchema = z.array(serverDataSchema);

class SimpleDb {
	users: UserData[];
	servers: ServerData[];

	constructor() {
		this.users = [];
		this.servers = [];
	}

	async loadInitialData() {
		try {
			// Read the file asynchronously
			const usersFileData = await fs.readFile(
				STORAGE_PATH + '/users.json',
				'utf8'
			);

			// Parse the file content as JSON
			const parsedUserData = JSON.parse(usersFileData);
			this.users = userDataArraySchema.parse(parsedUserData);
			console.log(`Loaded ${this.users.length} users`);

			const serversFileData = await fs.readFile(
				STORAGE_PATH + '/servers.json',
				'utf8'
			);

			const parsedServerData = JSON.parse(serversFileData);
			this.servers = serverDataArraySchema.parse(parsedServerData);
			console.log(`Loaded ${this.servers.length} servers`);
		} catch (error) {
			console.error('Error loading initial data: ', error);
		}
	}

	async updateUser(userId: number, updatedUserData: Partial<UserData>): Promise<boolean> {
		const userIndex = this.users.findIndex((user) => user.id === userId);
		if (userIndex === -1) {
			return false;
		}
		this.users[userIndex] = { ...this.users[userIndex], ...updatedUserData };
		await this.writeData();
		return true;
	}

	getUser(userId: number): UserData | undefined {
		return this.users.find((user) => user.id === userId);
	}

	async writeData() {
		try {
			await fs.writeFile(
				STORAGE_PATH + '/users.json',
				JSON.stringify(this.users, null, 2)
			);
		} catch (error) {
			console.error('Error writing users data: ', error);
		}
	}
}

const simpleDb = new SimpleDb();
export default simpleDb;
