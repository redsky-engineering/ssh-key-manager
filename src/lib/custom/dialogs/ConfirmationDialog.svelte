<script lang="ts">
	import { Button } from '$lib/components/shadcn/ui/button';
	import * as Dialog from '$lib/components/shadcn/ui/dialog/index.js';
	import type { Snippet } from 'svelte';

	export interface ConfirmationDialogProps {
		isLoading?: boolean;
		open: boolean;
		title: string;
		description: string;
		isDestructive?: boolean;
		cancelButtonText?: string;
		confirmButtonText?: string;
		children?: Snippet;
		onConfirm: () => void;
		onCancel: () => void;
	}

	let {
		isLoading = false,
		open = $bindable(),
		title,
		description,
		onCancel,
		onConfirm,
		children,
		isDestructive = false,
		cancelButtonText = 'Cancel',
		confirmButtonText = 'Confirm'
	}: ConfirmationDialogProps = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-[336px] sm:max-w-[336px]">
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>{description}</Dialog.Description>
			{@render children?.()}
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" class="flex-1" onclick={onCancel}>{cancelButtonText}</Button>
			<Button
				disabled={isLoading}
				variant={isDestructive ? 'destructive' : 'default'}
				class="flex-1"
				onclick={onConfirm}
			>
				{confirmButtonText}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
