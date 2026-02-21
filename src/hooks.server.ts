import { JWT_SECRET } from '$env/static/private';
import { isUnprotectedRoute, removeAuth } from '$lib/server/auth.js';
import simpleDb from '$lib/server/simpleDb.js';
// import serviceFactory from '$lib/services/serviceFactory.js';
import { dev } from '$app/environment';
import { type Cookies, type Handle, redirect } from '@sveltejs/kit';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

// Put initialization code here
await simpleDb.loadInitialData();

console.log('hooks on server....');

export const handle = (async ({ event, resolve }) => {
	if (dev && event.url.pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
		return new Response(undefined, { status: 404 });
	}

	await validateTokens(event.fetch, event.cookies, event.locals);
	checkProtectedRoutes(event.url, event.cookies);

	// The resolve will call the layout and page's server load functions
	return resolve(event);
}) satisfies Handle;

async function validateTokens(
	svelteFetch: typeof fetch,
	cookies: Cookies,
	locals: App.Locals
): Promise<void> {
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
	if (isUnprotectedRoute(url.pathname.toLowerCase())) return;
	console.log('route is protected');

	const accessToken = cookies.get('accessToken');
	// If we do not have an access token and are not on an unprotected route, redirect to the login page
	if (!accessToken) throw redirect(302, '/');
}
