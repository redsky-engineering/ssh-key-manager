import { JWT_SECRET } from '$env/static/private';
import { loginSchema } from '$lib/schema/schema.js';
import { setAccessTokenCookie } from '$lib/server/auth.js';
import simpleDb from '$lib/server/simpleDb.js';
import { fail, redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

// Give the user 30 minutes and then they will need to log in again.
// No refresh tokens at this time.
const ACCESS_TOKEN_TIMEOUT_HUMAN = '30m';

export const load = async () => {
	const form = await superValidate(zod(loginSchema));

	return { form };
};

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(loginSchema));

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

		console.log(simpleDb.users);

		if (form.data.password !== 'password') {
			// Return a custom error message
			return setError(form, 'password', 'Invalid Password');
		}

		// JWT sign a token and set it in a cookie
		// Generate a new JWT for the user
		const accessToken = jwt.sign(
			{
				userId: 3
			},
			JWT_SECRET,
			{ expiresIn: ACCESS_TOKEN_TIMEOUT_HUMAN }
		);

		setAccessTokenCookie(cookies, accessToken);
		redirect(301, '/dashboard');
	}
};
