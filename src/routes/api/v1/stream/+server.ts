// src/routes/custom-event/+server.js
import { sseClients } from '$lib/server/sseClients';
import type { RequestHandler } from '@sveltejs/kit'; // Adjust the import based on your actual setup
import { produce } from 'sveltekit-sse';

export const POST: RequestHandler = () => {
	return produce(
		async function start({ emit }) {
			const clientId = (Math.random() * 1000).toString();
			console.log('Client connected', clientId);
			sseClients.set(clientId, emit);
		},
		{
			stop() {
				console.log('Client disconnected');
			}
		}
	);
};
