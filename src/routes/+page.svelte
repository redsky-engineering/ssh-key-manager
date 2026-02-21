<script lang="ts">
	import { Button } from '$lib/components/shadcn/ui/button/index.js';
	import * as Card from '$lib/components/shadcn/ui/card/index.js';
	import { Input } from '$lib/components/shadcn/ui/input/index.js';
	import { Label } from '$lib/components/shadcn/ui/label/index.js';

	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();

	// svelte-ignore state_referenced_locally
	const { form, errors, constraints, message, enhance } = superForm(data.form);
</script>

<div class="flex h-screen w-screen items-center">
	<Card.Root class="grip mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">Login</Card.Title>
		</Card.Header>
		<Card.Content>
			{#if $message}<h3>{$message}</h3>{/if}
			<form method="POST" use:enhance>
				<div class="grid gap-4">
					<div class="grid gap-2">
						<div class="flex items-center">
							<Label for="password">Password</Label>
						</div>
						<Input
							type="password"
							name="password"
							required
							bind:value={$form.password}
							{...$constraints.password}
						/>
						{#if $errors.password}<span class="text-red-500">{$errors.password}</span>{/if}
					</div>
					<Button type="submit" class="w-full">Login</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
