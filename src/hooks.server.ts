import { JWT_SECRET } from '$env/static/private';
import { removeAuth } from '$lib/server/auth.js';
// import serviceFactory from '$lib/services/serviceFactory.js';
import { type Cookies, type Handle, redirect } from '@sveltejs/kit';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

// Put initialization code here
// serviceFactory.init();

console.log('hooks on server.');

const unProtectedRoutes = ['/'];

export const handle = (async ({ event, resolve }) => {
	await validateTokens(event.fetch, event.cookies, event.locals);
	checkProtectedRoutes(event.url, event.cookies);

	// The resolve will call the layout and page's server load functions
	return resolve(event);
}) satisfies Handle;

async function validateTokens(svelteFetch: typeof fetch, cookies: Cookies, locals: App.Locals): Promise<void> {
	// The reason why we use svelteFetch here is that it will include the cookies that are set on the client side
	const accessToken = cookies.get('accessToken') ?? '';
	try {
		const payload = jwt.verify(accessToken, JWT_SECRET) as JwtPayload;
		locals.userId = parseInt(payload.userId);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (_) {
		if (accessToken) removeAuth(cookies, locals);
	}
}

function checkProtectedRoutes(url: URL, cookies: Cookies): void {
	console.log('CHECK ROUTE - url.pathname: ', url.pathname);
	if (unProtectedRoutes.some((route) => url.pathname.toLowerCase() === route)) return;
	console.log('route is protected');

	const accessToken = cookies.get('accessToken');
	// If we do not have an access token and are not on an unprotected route, redirect to the login page
	if (!accessToken) throw redirect(302, '/');
}
