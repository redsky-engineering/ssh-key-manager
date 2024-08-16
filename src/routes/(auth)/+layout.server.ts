import simpleDb from '$lib/server/simpleDb.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	return {
		servers: simpleDb.servers,
		users: simpleDb.users
	};
};
