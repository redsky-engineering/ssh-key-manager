<script lang="ts">
	import type { UserData } from '$lib/types.js';
	import AppBarMobileMenu from '$lib/ui/appBarMobileMenu/AppBarMobileMenu.svelte';
	import { Badge } from '$lib/ui/badge/index.js';
	import { Label } from '$lib/ui/label/index.js';
	import * as Sheet from '$lib/ui/sheet/index.js';
	import { Switch } from '$lib/ui/switch/index.js';

	import * as Card from '$lib/ui/card/index.js';
	import { Key, Pencil, Server, Shield, Trash2 } from 'lucide-svelte';
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
	}
</script>

{#snippet userCard(user: UserData)}
	<button onclick={() => handleClickUserCard(user)} class="text-left" aria-label="Select User">
		<Card.Root class="flex h-full cursor-pointer flex-col justify-between">
			<Card.Header>
				<Card.Title>
					<div class="flex items-center justify-between">
						<div class="flex gap-2">
							{user.name}
							{#if user.isPrimary}
								<Shield size={16} class="text-green-300" />
							{/if}
						</div>
						<Badge class="text-sm" variant={user.isActive ? 'default' : 'destructive'}>
							{user.isActive ? 'Active' : 'Inactive'}
						</Badge>
					</div>
				</Card.Title>
				<!-- <Card.Description>
					
						<span class="rounded-md bg-green-300 p-1 text-black">Admin</span>
					{/if}
				</Card.Description> -->
			</Card.Header>
			<Card.Footer class="flex justify-between">
				<div class="flex gap-2"><Key /> {user.sshKeyData.length}</div>
				<div class="flex gap-2"><Server /> 3</div>
			</Card.Footer>
		</Card.Root>
	</button>
{/snippet}

<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
	<AppBarMobileMenu bind:searchValue />
	<main class="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
		{#each filteredUsers as user (user.id)}
			{@render userCard(user)}
		{/each}
	</main>
</div>

<Sheet.Root bind:open={isSheetOpen}>
	<Sheet.Content side="right" class="sm:max-w-lg">
		<Sheet.Header>
			<Sheet.Title>
				<div class="flex items-baseline gap-2">
					{selectedUser!.name}<Pencil size={16} class="cursor-pointer" />
				</div>
			</Sheet.Title>
		</Sheet.Header>
		{#if !selectedUser!.isPrimary}
			<div class="mt-4 flex items-center gap-2">
				<Switch
					id="airplane-mode"
					checked={selectedUser!.isActive}
					onCheckedChange={(isActive) => console.log('toggle', isActive)}
				/>
				<Label for="airplane-mode" class="cursor-pointer">
					{selectedUser!.isActive ? 'Active' : 'Inactive'}
				</Label>
			</div>
		{/if}
		<h3 class="my-4">SSH Keys</h3>
		<div class="flex flex-col gap-4">
			{#each selectedUser!.sshKeyData as key}
				<div class="relative grid grid-cols-[auto_1fr] gap-2 bg-slate-600 p-4">
					<p class="text-orange-200">Comment</p>
					<p>{key.comment}</p>
					<p class="text-orange-200">Finger Print</p>
					<p class="text-wrap break-all">{key.fingerPrint}</p>
					<button>
						<Trash2
							size={24}
							class="absolute right-2 top-2 p-1 text-destructive hover:rounded-full hover:bg-slate-100"
						/>
					</button>
				</div>
			{/each}
		</div>
	</Sheet.Content>
</Sheet.Root>
