<script lang="ts">
	import type { UserData } from '$lib/types.js';
	import AppBarMobileMenu from '$lib/ui/appBarMobileMenu/AppBarMobileMenu.svelte';
	import { Button } from '$lib/ui/button/index.js';
	import * as Sheet from '$lib/ui/sheet/index.js';

	import * as Card from '$lib/ui/card/index.js';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();

	let searchValue = $state('');
	let isSheetOpen = $state(false);

	let filteredUsers = $derived.by(() => {
		return data.users.filter((user) => user.name.toLowerCase().includes(searchValue.toLowerCase()));
	});

	$inspect(data);

	function handleClickUserCard() {
		isSheetOpen = true;
		console.log('User card clicked');
	}
</script>

{#snippet userCard(user: UserData)}
	<button onclick={handleClickUserCard} class="text-left" aria-label="Select User">
		<Card.Root class="cursor-pointer">
			<Card.Header>
				<Card.Title>{user.name}</Card.Title>
				<Card.Description>Card Description</Card.Description>
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
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Edit profile</Sheet.Title>
			<Sheet.Description>Make changes to your profile here. Click save when you're done.</Sheet.Description>
		</Sheet.Header>
		<div class="grid gap-4 py-4">
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
