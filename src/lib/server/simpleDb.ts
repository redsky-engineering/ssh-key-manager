// Note: To make deployments easier we are not going to use a traditional
// database. Instead we are going to use a simple in-memory database that is
// loaded into memory when the server starts from json files. Any updates
// to the database will be written to the json files.

import { promises as fs } from 'fs';
import { z } from 'zod';
import { STORAGE_PATH } from '$env/static/private';
import path from 'path';

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
			const usersFilePath = path.join(STORAGE_PATH, 'users.json');
			const serversFilePath = path.join(STORAGE_PATH, 'servers.json');

			const usersFileData = await fs.readFile(usersFilePath, 'utf8');
			// Parse the file content as JSON
			const parsedUserData = JSON.parse(usersFileData);
			this.users = userDataArraySchema.parse(parsedUserData);
			console.log(`Loaded ${this.users.length} users`);

			const serversFileData = await fs.readFile(serversFilePath, 'utf8');
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
		await this.writeData('users', this.users);
		return true;
	}

	getUser(userId: number): UserData | undefined {
		return this.users.find((user) => user.id === userId);
	}

	getServer(serverId: number): ServerData | undefined {
		return this.servers.find((server) => server.id === serverId);
	}

	async updateServer(serverId: number, updatedServerData: Partial<ServerData>): Promise<boolean> {
		const serverIndex = this.servers.findIndex((server) => server.id === serverId);
		
		if (serverIndex === -1) {
			return false;
		}
		
		this.servers[serverIndex] = { ...this.servers[serverIndex], ...updatedServerData };
		await this.writeData('servers', this.servers);
		return true;
	}

	async writeData(fileName: string, data: object) {
		try {
			console.log(typeof data);
			await fs.writeFile(
				path.join(STORAGE_PATH, `${fileName}.json`),
				JSON.stringify(data, null, 2)
			);
		} catch (error) {
			console.error(`Error writing ${fileName} data: `, error);
		}
	}
}

const simpleDb = new SimpleDb();
export default simpleDb;
