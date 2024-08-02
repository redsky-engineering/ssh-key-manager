// src/routes/custom-event/+server.js
import { sseClients } from '$lib/server/sseClients';
import { type RequestHandler } from '@sveltejs/kit'; // Adjust the import based on your actual setup
import { produce } from 'sveltekit-sse';
import { v4 as uuidv4 } from 'uuid';

export const POST: RequestHandler = () => {
	const uuid = uuidv4();
	return produce(
		async function start({ emit }) {
			// let uuid = cookies.get('sseUuid');
			// if (!uuid) {
			// 	uuid = uuidv4();
			// 	console.log('SSE connection assigned UUID:', uuid);
			// 	// If the maxAge is not set, the cookie will be a session cookie and will not be persisted after the browser is closed.
			// 	cookies.set('sseUuid', uuid, { path: '/', httpOnly: true });
			// } else {
			console.log('SSE connection resumed with UUID:', uuid);
			// }
			sseClients.set(uuid, emit);
		},
		{
			stop() {
				// const uuid = cookies.get('sseUuid');
				// if (!uuid) {
				// 	console.log('Client disconnected without UUID!');
				// 	return;
				// }
				console.log('Client disconnected', uuid);
				sseClients.delete(uuid);
			}
		}
	);
};
