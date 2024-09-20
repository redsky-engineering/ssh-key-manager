import type { Actions } from '@sveltejs/kit';
import simpleDb from '$lib/server/simpleDb.js';
import type { PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { addUsersToServerSchema } from '$lib/schema/schema';

export const actions: Actions = {
	// Other actions...

	'add-users-to-server': async ({ request }) => {
		const form = await superValidate(request, zod(addUsersToServerSchema));
		
		if (!form.valid) return fail(400, { form });
		console.log('form.data', form.data);

	
		const userIds = form.data.userIds;
		if (!userIds) return message(form, 'No users selected', { status: 400 });

		const server = simpleDb.getServer(form.data.serverId);
		if (!server) return message(form, 'Server not found', { status: 404 });

		simpleDb.updateServer(form.data.serverId, { userIds: [...server.userIds, ...userIds] });

		return { form };
	}
};

export const load: PageServerLoad = async () => {
	const addUsersToServerForm = await superValidate(zod(addUsersToServerSchema));
	return { addUsersToServerForm };
};