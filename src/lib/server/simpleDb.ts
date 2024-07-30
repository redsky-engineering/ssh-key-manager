// Note: To make deployments easier we are not going to use a traditional
// database. Instead we are going to use a simple in-memory database that is
// loaded into memory when the server starts from json files. Any updates
// to the database will be written to the json files.

import { promises as fs } from 'fs';

class SimpleDb {
	users!: any[];

	constructor() {
		this.loadInitialData().catch(console.error);
	}

	async loadInitialData() {
		// Read the file asynchronously
		const usersFileData = await fs.readFile('/tmp/users.json', 'utf8');

		// Parse the file content as JSON
		this.users = JSON.parse(usersFileData);
		console.log('this.users: ', this.users);
	}

	async writeData() {}
}

const simpleDb = new SimpleDb();
export default simpleDb;
