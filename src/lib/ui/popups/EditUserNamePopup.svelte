<script lang="ts">
	import type { UserNameSchema } from '$lib/schema/schema.js';
	import * as Dialog from '$lib/ui/dialog';
	import { Input } from '$lib/ui/input/index.js';
	import type { SuperForm } from 'sveltekit-superforms';
	import Button from '../button/button.svelte';
	import Label from '../label/label.svelte';

	type Props = {
		open: boolean;
		form: SuperForm<UserNameSchema>;
	};
	let { open = $bindable(), form }: Props = $props();

	const { enhance, form: formData, errors, constraints } = form;
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="w-[90%]">
		<Dialog.Header>
			<Dialog.Title>Edit User's Name</Dialog.Title>
		</Dialog.Header>

		<form method="POST" action="?/username" use:enhance class="contents">
			<div class="flex flex-col gap-1">
				<Label for="userName" class="mb-1">New Name</Label>
				<Input
					type="text"
					placeholder="Name"
					name="name"
					bind:value={$formData.name}
					class="w-full"
					aria-invalid={$errors.name ? 'true' : undefined}
					{...$constraints.name}
				/>
				{#if $errors.name}<span class="text-red-500">{$errors.name}</span>{/if}
			</div>
			<Button variant="default" type="submit">Save</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
