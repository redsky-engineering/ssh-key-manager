<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import type { Snippet } from 'svelte';
	import { Toaster } from 'svelte-sonner';
	import '../app.css';

	let { children }: { children: Snippet } = $props();
</script>

<Toaster richColors />
<ModeWatcher />
{@render children()}
