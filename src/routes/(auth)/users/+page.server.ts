import { userNameSchema } from '$lib/schema/schema.js';
import type { Actions } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types.js';

export const actions: Actions = {
	username: async ({ request }) => {
		const form = await superValidate(request, zod(userNameSchema));

		if (!form.valid) return fail(400, { form });

		return { form };
	}
};

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(userNameSchema));
	return { form };
};
