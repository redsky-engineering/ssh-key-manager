// Note: To make deployments easier we are not going to use a traditional
// database. Instead we are going to use a simple in-memory database that is
// loaded into memory when the server starts from json files. Any updates
// to the database will be written to the json files.

import { promises as fs } from 'fs';
import { z } from 'zod';

const sshKeyDataSchema = z.object({
	comment: z.string(),
	fingerPrint: z.string()
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
				'/home/joshh/redsky/redsky/ssh-key-manager/static/users.json',
				'utf8'
			);

			// Parse the file content as JSON
			const parsedUserData = JSON.parse(usersFileData);
			this.users = userDataArraySchema.parse(parsedUserData);
			console.log('this.users: ', this.users);

			const serversFileData = await fs.readFile(
				'/home/joshh/redsky/redsky/ssh-key-manager/static/servers.json',
				'utf8'
			);

			const parsedServerData = JSON.parse(serversFileData);
			this.servers = serverDataArraySchema.parse(parsedServerData);
			console.log('this.servers: ', this.servers);
		} catch (error) {
			console.error('Error loading initial data: ', error);
		}
	}

	async writeData() {}
}

const simpleDb = new SimpleDb();
export default simpleDb;
