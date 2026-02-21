import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		alias: {
			$stores: path.resolve('src/stores'),
			$schema: path.resolve('src/schema')
		},
		adapter: adapter()
	},
	vitePlugin: {
		inspector: true
	}
};

export default config;
