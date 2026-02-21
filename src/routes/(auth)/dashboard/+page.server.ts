import type { Actions } from '@sveltejs/kit';
import simpleDb from '$lib/server/simpleDb.js';
import type { PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { addUsersToServerSchema, deleteUserFromServerSchema } from '$lib/schema/schema';

export const actions: Actions = {
	'add-users-to-server': async ({ request }) => {
		const form = await superValidate(request, zod(addUsersToServerSchema));

		if (!form.valid) return fail(400, { form });

		const userIds = form.data.userIds;
		if (!userIds) return message(form, 'No users selected', { status: 404 });

		const server = simpleDb.getServer(form.data.serverId);
		if (!server) return message(form, 'Server not found', { status: 404 });

		simpleDb.updateServer(form.data.serverId, { userIds: [...server.userIds, ...userIds] });

		return { form };
	},
	'delete-user-from-server': async ({ request }) => {
		const form = await superValidate(request, zod(deleteUserFromServerSchema));

		if (!form.valid) return fail(400, { form });

		console.log('form.data', form.data.userId);

		const user = simpleDb.getUser(form.data.userId);
		if (!user) return message(form, 'User not found', { status: 404 });

		const server = simpleDb.getServer(form.data.serverId);
		if (!server) return message(form, 'Server not found', { status: 404 });

		simpleDb.updateServer(form.data.serverId, { userIds: server.userIds.filter((id) => id !== form.data.userId) });
		return { form };
	}
};

export const load: PageServerLoad = async () => {
	const addUsersToServerForm = await superValidate(zod(addUsersToServerSchema));
	const deleteUserFromServerForm = await superValidate(zod(deleteUserFromServerSchema));

	return { addUsersToServerForm, deleteUserFromServerForm };
};
