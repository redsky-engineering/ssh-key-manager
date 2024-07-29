export interface ServerData {
	id: number;
	name: string;
	ipAddress: string;
	lastHeartbeatOn: string;
	cpuUsagePercent: number;
	memoryUsagePercent: number;
	diskUsagePercent: number;
	users: number[];
}

export interface UserData {
	id: number;
	isPrimary: boolean;
	isActive: boolean;
	name: string;
	sshKeyData: { comment: string; fingerPrint: string }[];
}
