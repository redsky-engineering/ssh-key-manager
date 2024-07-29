import type { ServerData, UserData } from '$lib/types.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	// Create some fake server data
	const servers: ServerData[] = [
		{
			id: 1,
			name: 'Server1',
			ipAddress: '192.168.1.1',
			lastHeartbeatOn: '2024-07-20T00:16:00Z',
			cpuUsagePercent: 45,
			memoryUsagePercent: 70,
			diskUsagePercent: 60,
			users: [1, 2, 3]
		},
		{
			id: 2,
			name: 'Server2',
			ipAddress: '192.168.1.2',
			lastHeartbeatOn: '2024-07-17T03:55:00Z',
			cpuUsagePercent: 55,
			memoryUsagePercent: 65,
			diskUsagePercent: 75,
			users: [1, 2]
		},
		{
			id: 3,
			name: 'Server3',
			ipAddress: '192.168.1.3',
			lastHeartbeatOn: '2024-07-15T12:10:00Z',
			cpuUsagePercent: 35,
			memoryUsagePercent: 50,
			diskUsagePercent: 40,
			users: []
		},
		{
			id: 4,
			name: 'Server4',
			ipAddress: '192.168.1.4',
			lastHeartbeatOn: '2024-07-15T12:15:00Z',
			cpuUsagePercent: 25,
			memoryUsagePercent: 45,
			diskUsagePercent: 55,
			users: [1, 2]
		},
		{
			id: 5,
			name: 'Server5',
			ipAddress: '192.168.1.5',
			lastHeartbeatOn: '2024-07-15T12:20:00Z',
			cpuUsagePercent: 65,
			memoryUsagePercent: 80,
			diskUsagePercent: 85,
			users: [3, 4]
		},
		{
			id: 6,
			name: 'Server6',
			ipAddress: '192.168.1.6',
			lastHeartbeatOn: '2024-07-15T12:25:00Z',
			cpuUsagePercent: 50,
			memoryUsagePercent: 60,
			diskUsagePercent: 70,
			users: [1]
		},
		{
			id: 7,
			name: 'Server7',
			ipAddress: '192.168.1.7',
			lastHeartbeatOn: '2024-07-15T12:30:00Z',
			cpuUsagePercent: 30,
			memoryUsagePercent: 55,
			diskUsagePercent: 65,
			users: [5, 6]
		},
		{
			id: 8,
			name: 'Server8',
			ipAddress: '192.168.1.8',
			lastHeartbeatOn: '2024-07-15T12:35:00Z',
			cpuUsagePercent: 40,
			memoryUsagePercent: 50,
			diskUsagePercent: 60,
			users: [2, 4, 6]
		},
		{
			id: 9,
			name: 'Server9',
			ipAddress: '192.168.1.9',
			lastHeartbeatOn: '2024-07-15T12:40:00Z',
			cpuUsagePercent: 70,
			memoryUsagePercent: 75,
			diskUsagePercent: 80,
			users: []
		},
		{
			id: 10,
			name: 'Server10',
			ipAddress: '192.168.1.10',
			lastHeartbeatOn: '2024-07-15T12:45:00Z',
			cpuUsagePercent: 60,
			memoryUsagePercent: 65,
			diskUsagePercent: 55,
			users: []
		},
		{
			id: 11,
			name: 'Server11',
			ipAddress: '192.168.1.11',
			lastHeartbeatOn: '2024-07-15T12:50:00Z',
			cpuUsagePercent: 20,
			memoryUsagePercent: 30,
			diskUsagePercent: 40,
			users: []
		},
		{
			id: 12,
			name: 'Server12',
			ipAddress: '192.168.1.12',
			lastHeartbeatOn: '2024-07-15T12:55:00Z',
			cpuUsagePercent: 45,
			memoryUsagePercent: 55,
			diskUsagePercent: 65,
			users: []
		},
		{
			id: 13,
			name: 'Server13',
			ipAddress: '192.168.1.13',
			lastHeartbeatOn: '2024-07-15T13:00:00Z',
			cpuUsagePercent: 35,
			memoryUsagePercent: 50,
			diskUsagePercent: 60,
			users: []
		},
		{
			id: 14,
			name: 'Server14',
			ipAddress: '192.168.1.14',
			lastHeartbeatOn: '2024-07-15T13:05:00Z',
			cpuUsagePercent: 50,
			memoryUsagePercent: 65,
			diskUsagePercent: 75,
			users: []
		},
		{
			id: 15,
			name: 'Server15',
			ipAddress: '192.168.1.15',
			lastHeartbeatOn: '2024-07-15T13:10:00Z',
			cpuUsagePercent: 55,
			memoryUsagePercent: 60,
			diskUsagePercent: 65,
			users: []
		}
	];

	const users: UserData[] = [
		{
			id: 1,
			isPrimary: true,
			isActive: true,
			name: 'Alice',
			sshKeyData: [
				{
					comment: "Alice's SSH Key",
					fingerPrint: '00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF'
				}
			]
		},
		{
			id: 2,
			isPrimary: false,
			isActive: true,
			name: 'Bob',

			sshKeyData: [
				{
					comment: "Bob's SSH Key",
					fingerPrint: '11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00'
				},
				{
					comment: "Bob's SSH Key 2",
					fingerPrint: '11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00'
				}
			]
		},
		{
			id: 3,
			isPrimary: false,
			isActive: true,
			name: 'David',
			sshKeyData: [
				{
					comment: "David's SSH Key",
					fingerPrint: '22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11'
				}
			]
		},
		{ id: 4, isPrimary: true, isActive: false, name: 'Eva', sshKeyData: [] },
		{ id: 5, isPrimary: false, isActive: false, name: 'Frank', sshKeyData: [] },
		{ id: 6, isPrimary: true, isActive: false, name: 'Grace', sshKeyData: [] },
		{ id: 7, isPrimary: false, isActive: false, name: 'John Wick', sshKeyData: [] }
	];

	return {
		servers,
		users
	};
};
