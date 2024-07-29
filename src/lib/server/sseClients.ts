import type { Unsafe } from 'sveltekit-sse';

type ClientCallback = (eventName: string, data: string) => Unsafe<void, Error>;

export const sseClients: Map<string, ClientCallback> = new Map();
