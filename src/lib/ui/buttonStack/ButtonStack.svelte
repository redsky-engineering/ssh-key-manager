<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let { class: className, children }: { class?: string; children: Snippet } = $props();
</script>

<div class={cn(className, 'grid grid-cols-2 gap-4')}>
	{@render children()}
</div>
