import { removeAuth } from '$lib/server/auth.js';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ cookies, locals }) => {
		removeAuth(cookies, locals);
		redirect(302, '/');
	}
};
