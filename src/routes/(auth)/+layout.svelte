<script lang="ts">
	import { page } from '$app/stores';
	import { buttonVariants } from '$lib/components/shadcn/ui/button/index.js';
	import * as Tooltip from '$lib/components/shadcn/ui/tooltip/index.js';
	import { cn } from '$lib/utils.js';
	import Home from '@lucide/svelte/icons/house';
	import KeyRound from '@lucide/svelte/icons/key-round';
	import Settings from '@lucide/svelte/icons/settings';
	import UsersRound from '@lucide/svelte/icons/users-round';
	import type { Snippet } from 'svelte';
	import { source } from 'sveltekit-sse';

	// Temp
	const value = source('/api/v1/stream').select('message');
	$inspect($value);

	let { children }: { children: Snippet } = $props();

	function getMenuItemClasses(path: string): string {
		return cn(
			'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
			{
				'bg-muted': $page.url.pathname === path
			}
		);
	}
</script>

<div class="bg-muted/40 flex min-h-screen w-full flex-col">
	<Tooltip.Provider>
		<aside class="bg-background fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r sm:flex">
			<nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
				<span
					class="bg-primary text-primary-foreground flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:h-8 md:w-8 md:text-base"
				>
					<KeyRound class="h-4 w-4" />
					<span class="sr-only">SSH Key Manager</span>
				</span>
				<Tooltip.Root>
					<Tooltip.Trigger class={buttonVariants({ variant: 'outline' })}>
						<a href="/dashboard" class={getMenuItemClasses('/dashboard')}>
							<Home class="h-5 w-5" />
							<span class="sr-only">Dashboard</span>
						</a>
					</Tooltip.Trigger>
					<Tooltip.Content side="right">Dashboard</Tooltip.Content>
				</Tooltip.Root>
				<Tooltip.Root>
					<Tooltip.Trigger class={buttonVariants({ variant: 'outline' })}>
						<a href="/users" class={getMenuItemClasses('/users')}>
							<UsersRound class="h-5 w-5" />
							<span class="sr-only">Users</span>
						</a>
					</Tooltip.Trigger>
					<Tooltip.Content side="right">Users</Tooltip.Content>
				</Tooltip.Root>
			</nav>
			<nav class="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
				<Tooltip.Root>
					<Tooltip.Trigger class={buttonVariants({ variant: 'outline' })}>
						<a href="/settings" class={getMenuItemClasses('/settings')}>
							<Settings class="h-5 w-5" />
							<span class="sr-only">Settings</span>
						</a>
					</Tooltip.Trigger>
					<Tooltip.Content side="right">Settings</Tooltip.Content>
				</Tooltip.Root>
			</nav>
		</aside>
	</Tooltip.Provider>
	{@render children()}
</div>
