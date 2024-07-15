import { loginSchema } from '$lib/schema/schema.js';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod(loginSchema));

	return { form };
};

export const actions = {
	default: async ({ request }) => {
		console.log(request);
		const form = await superValidate(request, zod(loginSchema));
		console.log(form);

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

		if (form.data.password !== 'password') {
			// Return a custom error message
			return setError(form, 'password', 'Invalid Password');
		}

		redirect(301, '/dashboard');
	}
};
