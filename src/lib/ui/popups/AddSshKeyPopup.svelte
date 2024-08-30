<script lang="ts">
	import type { AddSshKeySchema } from '$lib/schema/schema.js';
	import * as Dialog from '$lib/ui/dialog';
	import type { SuperForm } from 'sveltekit-superforms';
	import Button from '../button/button.svelte';
	import Label from '../label/label.svelte';
	import Textarea from '../textarea/textarea.svelte';

	type Props = {
		open: boolean;
		form: SuperForm<AddSshKeySchema>;
	};
	let { open = $bindable(), form }: Props = $props();

	const { enhance, form: formData, errors, constraints } = form;
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="w-[90%]">
		<Dialog.Header>
			<Dialog.Title>Add SSH Key For User</Dialog.Title>
		</Dialog.Header>

		<form method="POST" action="?/add-ssh-key" use:enhance class="contents">
			<div class="flex flex-col gap-1">
				<Label for="userName" class="mb-1">Public SSH Key</Label>
				<Textarea
					placeholder="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDZ..."
					name="sshKey"
					class="w-full"
					bind:value={$formData.sshKey}
					aria-invalid={$errors.sshKey ? 'true' : undefined}
					{...$constraints.sshKey}
				/>
				{#if $errors.sshKey}<span class="text-red-500">{$errors.sshKey}</span>{/if}
			</div>
			<input type="hidden" name="id" value={$formData.userId} />
			<Button variant="default" type="submit">Add</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
