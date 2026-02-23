import simpleDb from '$lib/server/simpleDb.js';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface ServerKeyEntry {
	name: string;
	publicKeys: string[];
}

export const GET: RequestHandler = async ({ url, getClientAddress }) => {
	const hostname = url.searchParams.get('hostname');

	if (!hostname) {
		error(400, 'hostname query parameter is required');
	}

	const clientIpAddress = getClientAddress();
	const cpuUsagePercent = Number(url.searchParams.get('cpuUsagePercent') ?? '0');
	const memoryUsagePercent = Number(url.searchParams.get('memoryUsagePercent') ?? '0');
	const diskUsagePercent = Number(url.searchParams.get('diskUsagePercent') ?? '0');

	const existingServer = simpleDb.servers.find((server) => server.name === hostname);

	let userIds: number[];

	if (!existingServer) {
		const defaultUserIds = simpleDb.users
			.filter((user) => user.isSystemAdmin && user.isActive)
			.map((user) => user.id);

		await simpleDb.addServer({
			name: hostname,
			ipAddress: clientIpAddress,
			lastHeartbeatOn: new Date().toISOString(),
			cpuUsagePercent,
			memoryUsagePercent,
			diskUsagePercent,
			userIds: defaultUserIds
		});

		userIds = defaultUserIds;
	} else {
		await simpleDb.updateServer(existingServer.id, {
			lastHeartbeatOn: new Date().toISOString(),
			ipAddress: clientIpAddress,
			cpuUsagePercent,
			memoryUsagePercent,
			diskUsagePercent
		});

		userIds = existingServer.userIds;
	}

	const keyEntries: ServerKeyEntry[] = userIds
		.map((userId) => simpleDb.getUser(userId))
		.filter((user): user is NonNullable<typeof user> => user !== undefined && user.isActive && user.sshKeyData.length > 0)
		.map((user) => ({
			name: user.name,
			publicKeys: user.sshKeyData.map((keyData) => keyData.publicKey)
		}));

	return new Response(JSON.stringify({ data: keyEntries }), {
		headers: { 'Content-Type': 'application/json' }
	});
};
