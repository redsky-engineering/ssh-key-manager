import { addUsersToServerSchema, deleteUserFromServerSchema } from '$lib/schema/schema';
import simpleDb from '$lib/server/simpleDb.js';
import type { Actions } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const actions: Actions = {
	'add-users-to-server': async ({ request }) => {
		const form = await superValidate(request, zod4(addUsersToServerSchema));

		if (!form.valid) return fail(400, { form });

		const userIds = form.data.userIds;
		if (!userIds) return message(form, 'No users selected', { status: 404 });

		const server = simpleDb.getServer(form.data.serverId);
		if (!server) return message(form, 'Server not found', { status: 404 });

		simpleDb.updateServer(form.data.serverId, { userIds: [...server.userIds, ...userIds] });

		return { form };
	},
	'delete-user-from-server': async ({ request }) => {
		const form = await superValidate(request, zod4(deleteUserFromServerSchema));

		if (!form.valid) return fail(400, { form });

		console.log('form.data', form.data.userId);

		const user = simpleDb.getUser(form.data.userId);
		if (!user) return message(form, 'User not found', { status: 404 });

		if (user.isSystemAdmin)
			return message(form, 'You cannot delete a system admin', { status: 400 });

		const server = simpleDb.getServer(form.data.serverId);
		if (!server) return message(form, 'Server not found', { status: 404 });

		simpleDb.updateServer(form.data.serverId, {
			userIds: server.userIds.filter((id) => id !== form.data.userId)
		});
		return { form };
	}
};

export const load: PageServerLoad = async () => {
	const addUsersToServerForm = await superValidate(zod4(addUsersToServerSchema));
	const deleteUserFromServerForm = await superValidate(zod4(deleteUserFromServerSchema));

	return { addUsersToServerForm, deleteUserFromServerForm };
};
