import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		watch: {
			ignored: [resolve('./data')]
		}
	},
	plugins: [tailwindcss(), sveltekit()]
});
