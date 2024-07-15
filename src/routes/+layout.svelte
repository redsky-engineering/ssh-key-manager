<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import type { Snippet } from 'svelte';
	import '../app.css';

	let { children }: { children: Snippet } = $props();
</script>

<ModeWatcher />
{@render children()}
