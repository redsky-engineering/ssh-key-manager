import { isActiveSchema, userNameSchema } from '$lib/schema/schema.js';
import simpleDb from '$lib/server/simpleDb.js';
import type { Actions } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types.js';

export const actions: Actions = {
	username: async ({ request }) => {
		const form = await superValidate(request, zod(userNameSchema));

		if (!form.valid) return fail(400, { form });
		console.log('form.data', form.data);

		simpleDb.updateUser(form.data.id, { name: form.data.name });

		return { form };
	},
	active: async ({ request }) => {
		const form = await superValidate(request, zod(isActiveSchema));

		if (!form.valid) return fail(400, { form });
		console.log('form.data', form.data);

		simpleDb.updateUser(form.data.id, { isActive: form.data.isActive });

		return { form };
	}
};

export const load: PageServerLoad = async () => {
	const userNameForm = await superValidate(zod(userNameSchema));
	const isActiveForm = await superValidate(zod(isActiveSchema));

	return { userNameForm, isActiveForm };
};
