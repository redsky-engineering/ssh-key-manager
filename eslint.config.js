import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';
const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		rules: {
			// Allow unused variables starting with exactly one underscore.
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_[^_].*$|^_$',
					varsIgnorePattern: '^_[^_].*$|^_$',
					caughtErrorsIgnorePattern: '^_[^_].*$|^_$'
				}
			],
			// Allow namespace usage
			'@typescript-eslint/no-namespace': 'off',
			// Don't require each key in a svelte component
			'svelte/require-each-key': 'off',
			'spaced-comment': [
				'error',
				'always',
				{
					block: {
						balanced: true
					}
				}
			]
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		ignores: ['eslint.config.js', 'svelte.config.js'],
		languageOptions: {
			parserOptions: {
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		},
		rules: {
			'no-undef': 'off',
			'svelte/no-navigation-without-resolve': 'off'
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/', 'src/generated/', 'src/fonts/', 'ios/', 'android/']
	}
);
