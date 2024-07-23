<script lang="ts">
	import type { UserData } from '$lib/types.js';
	import AppBarMobileMenu from '$lib/ui/appBarMobileMenu/AppBarMobileMenu.svelte';
	import { Badge } from '$lib/ui/badge/index.js';
	import { Button } from '$lib/ui/button/index.js';
	import { Label } from '$lib/ui/label/index.js';
	import * as Sheet from '$lib/ui/sheet/index.js';
	import { Switch } from '$lib/ui/switch/index.js';

	import * as Card from '$lib/ui/card/index.js';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();

	let searchValue = $state('');
	let isSheetOpen = $state(false);
	let selectedUser: UserData | null = $state(null);

	let filteredUsers = $derived.by(() => {
		return data.users.filter((user) => user.name.toLowerCase().includes(searchValue.toLowerCase()));
	});

	$inspect(data);

	function handleClickUserCard(user: UserData) {
		isSheetOpen = true;
		selectedUser = user;
		console.log('User card clicked');
	}
</script>

{#snippet userCard(user: UserData)}
	<button onclick={() => handleClickUserCard(user)} class="text-left" aria-label="Select User">
		<Card.Root class="cursor-pointer">
			<Card.Header>
				<Card.Title>
					<div class="flex justify-between">
						{user.name}
						<Badge class="text-sm" variant={user.isActive ? 'default' : 'secondary'}>
							{user.isActive ? 'Active' : 'Inactive'}
						</Badge>
					</div>
				</Card.Title>
				<Card.Description></Card.Description>
			</Card.Header>
			<Card.Content>
				<p>Card Content</p>
			</Card.Content>
			<Card.Footer>
				<p>Card Footer</p>
			</Card.Footer>
		</Card.Root>
	</button>
{/snippet}

<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
	<AppBarMobileMenu bind:searchValue />
	<main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
		{#each filteredUsers as user (user.id)}
			{@render userCard(user)}
		{/each}
	</main>
</div>

<Sheet.Root bind:open={isSheetOpen}>
	<Sheet.Content side="right" class="sm:max-w-lg">
		<Sheet.Header>
			<Sheet.Title>
				{selectedUser?.name}
			</Sheet.Title>
		</Sheet.Header>
		<div class="my-4 flex items-center gap-2">
			<Switch id="airplane-mode" />
			<Label for="airplane-mode" class="cursor-pointer">Active</Label>
		</div>
		<h3>SSH Keys</h3>
		<div class="grid gap-4 py-2">
			<div class="grid grid-cols-4 items-center gap-4">
				<p>Name</p>
				<p>Pedro</p>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<p>Name</p>
				<p>Pedro</p>
			</div>
		</div>
		<Sheet.Footer>
			<Sheet.Close asChild let:builder>
				<Button builders={[builder]} type="submit">Save changes</Button>
			</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
