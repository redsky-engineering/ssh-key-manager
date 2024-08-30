import { addSshKeySchema, deleteSshKeySchema, isActiveSchema, userNameSchema } from '$lib/schema/schema.js';
import simpleDb from '$lib/server/simpleDb.js';
import { getPublicKeyComment, getPublicKeyFingerprint, isValidSshPublicKey } from '$lib/server/ssh.js';
import type { Actions } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types.js';

export const actions: Actions = {
	username: async ({ request }) => {
		const form = await superValidate(request, zod(userNameSchema));

		if (!form.valid) return fail(400, { form });
		console.log('form.data', form.data);

		const user = simpleDb.getUser(form.data.userId);
		if (!user) return message(form, 'User not found', { status: 404 });

		simpleDb.updateUser(form.data.userId, { name: form.data.name });

		return { form };
	},
	active: async ({ request }) => {
		const form = await superValidate(request, zod(isActiveSchema));

		if (!form.valid) return fail(400, { form });
		console.log('form.data', form.data);

		const user = simpleDb.getUser(form.data.userId);
		if (!user) return message(form, 'User not found', { status: 404 });

		simpleDb.updateUser(form.data.userId, { isActive: form.data.isActive });

		return { form };
	},
	'add-ssh-key': async ({ request }) => {
		const form = await superValidate(request, zod(addSshKeySchema));

		if (!form.valid) return fail(400, { form });
		console.log('form.data', form.data);

		const user = simpleDb.getUser(form.data.userId);
		if (!user) return message(form, 'User not found', { status: 404 });

		if (!isValidSshPublicKey(form.data.sshKey)) {
			return message(form, 'Invalid SSH Key', { status: 400 });
		}

		simpleDb.updateUser(form.data.userId, {
			sshKeyData: [
				...user.sshKeyData,
				{
					comment: getPublicKeyComment(form.data.sshKey),
					fingerPrint: getPublicKeyFingerprint(form.data.sshKey),
					publicKey: form.data.sshKey
				}
			]
		});

		return { form };
	},
	'delete-ssh-key': async ({ request }) => {
		const form = await superValidate(request, zod(deleteSshKeySchema));
		console.log('form', form);

		if (!form.valid) return fail(400, { form });
		console.log('form.data', form.data);

		const user = simpleDb.getUser(form.data.userId);
		if (!user) return message(form, 'User not found', { status: 404 });

		// Find the key to delete
		const keyToDelete = user.sshKeyData.find((key) => key.fingerPrint === form.data.fingerprint);
		if (!keyToDelete) return message(form, 'Key not found', { status: 404 });

		simpleDb.updateUser(form.data.userId, {
			sshKeyData: user.sshKeyData.filter((key) => key.fingerPrint !== form.data.fingerprint)
		});

		return { form };
	}
};

export const load: PageServerLoad = async () => {
	const userNameForm = await superValidate(zod(userNameSchema));
	const isActiveForm = await superValidate(zod(isActiveSchema));
	const addSshKeyForm = await superValidate(zod(addSshKeySchema));
	const deleteSshKeyForm = await superValidate(zod(deleteSshKeySchema));

	return { userNameForm, isActiveForm, addSshKeyForm, deleteSshKeyForm };
};
