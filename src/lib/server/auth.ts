import { JWT_SECRET } from '$env/static/private';
import { type Cookies } from '@sveltejs/kit';
import jwt, { type JwtPayload } from 'jsonwebtoken';

export function setAccessTokenCookie(cookies: Cookies, accessToken: string): void {
	// Validate accessToken is a JWT and get its expiration date
	let payload: JwtPayload | undefined;
	try {
		payload = jwt.verify(accessToken, JWT_SECRET) as JwtPayload;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (_) {
		throw new Error('Invalid accessToken, failed JWT verification');
	}

	if (!payload || !payload.exp) {
		throw new Error('Invalid accessToken, failed JWT verification');
	}

	// Calculate how long the cookie should last
	const expirationDate = new Date(payload.exp * 1000);
	const currentDate = new Date();
	const expirationSeconds = (expirationDate.getTime() - currentDate.getTime()) / 1000;
	console.log('expirationSeconds', expirationSeconds);
	const futureDate = new Date(currentDate.getTime() + expirationSeconds * 1000);

	cookies.set('accessToken', accessToken, {
		httpOnly: true,
		path: '/',
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		expires: futureDate
	});
}

export function removeAuth(cookies: Cookies, locals: App.Locals): void {
	cookies.delete('accessToken', { path: '/' });
	locals.userId = undefined;
}
