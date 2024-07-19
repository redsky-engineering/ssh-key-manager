<script lang="ts">
	import File from 'lucide-svelte/icons/file';
	import Home from 'lucide-svelte/icons/house';
	import KeyRound from 'lucide-svelte/icons/key-round';
	import PanelLeft from 'lucide-svelte/icons/panel-left';
	import Search from 'lucide-svelte/icons/search';
	import Settings from 'lucide-svelte/icons/settings';
	import UserRound from 'lucide-svelte/icons/user-round';
	import UsersRound from 'lucide-svelte/icons/users-round';

	import AppUtils from '$lib/AppUtils.js';
	import type { ServerData } from '$lib/types.js';
	import { Badge } from '$lib/ui/badge/index.js';
	import { Button } from '$lib/ui/button/index.js';
	import * as Card from '$lib/ui/card/index.js';
	import * as DropdownMenu from '$lib/ui/dropdown-menu/index.js';
	import { Input } from '$lib/ui/input/index.js';
	import { Progress } from '$lib/ui/progress/index.js';
	import ServerInfoCard from '$lib/ui/serverInfoCard/ServerInfoCard.svelte';
	import * as Sheet from '$lib/ui/sheet/index.js';
	import * as Table from '$lib/ui/table/index.js';
	import * as Tabs from '$lib/ui/tabs/index.js';
	import { cn } from '$lib/utils.js';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();

	let selectedServerId: number | null = $state(data.servers.length > 0 ? data.servers[0].id : null);

	let searchValue = $state('');

	let filteredServers = $derived.by(() => {
		return data.servers.filter((server) =>
			server.name.toLowerCase().includes(searchValue.toLowerCase())
		);
	});
</script>

<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
	<header
		class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
	>
		<Sheet.Root>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]} size="icon" variant="outline" class="sm:hidden">
					<PanelLeft class="h-5 w-5" />
					<span class="sr-only">Toggle Menu</span>
				</Button>
			</Sheet.Trigger>
			<Sheet.Content side="left" class="sm:max-w-xs">
				<nav class="grid gap-6 text-lg font-medium">
					<div
						class="flex shrink-0 items-center justify-center gap-2 text-lg font-semibold text-muted-foreground md:text-base"
					>
						<KeyRound class="h-5 w-5" />
						SSH Key Manager
					</div>
					<a
						href="##"
						class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
					>
						<Home class="h-5 w-5" />
						Dashboard
					</a>
					<a
						href="##"
						class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
					>
						<UsersRound class="h-5 w-5" />
						Customers
					</a>
					<a
						href="##"
						class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
					>
						<Settings class="h-5 w-5" />
						Settings
					</a>
				</nav>
			</Sheet.Content>
		</Sheet.Root>
		<div class="relative ml-auto flex-1 md:grow-0">
			<Search class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Search..."
				class="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
				bind:value={searchValue}
			/>
		</div>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button
					variant="outline"
					size="icon"
					class="overflow-hidden rounded-full"
					builders={[builder]}
				>
					<UserRound class="h-6 w-6" />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Item class="cursor-pointer">Settings</DropdownMenu.Item>
				<DropdownMenu.Item class="cursor-pointer">Support</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<a href="/"><DropdownMenu.Item class="cursor-pointer">Logout</DropdownMenu.Item></a>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</header>
	<main
		class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3"
	>
		<div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
			<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Description>Total Servers</Card.Description>
						<Card.Title class="text-4xl">8</Card.Title>
					</Card.Header>
				</Card.Root>
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Description>Active Servers</Card.Description>
						<Card.Title class="text-4xl text-green-300">4</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="text-xs text-muted-foreground">1 new from last week</div>
					</Card.Content>
					<Card.Footer>
						<Progress value={50} aria-label="1 new active server" />
					</Card.Footer>
				</Card.Root>
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Description>Stale Servers</Card.Description>
						<Card.Title class="text-3xl text-red-300">4</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="text-xs text-muted-foreground">2 new from last week</div>
					</Card.Content>
					<Card.Footer>
						<Progress value={50} aria-label="2 new inactive servers" />
					</Card.Footer>
				</Card.Root>
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Description>Users Access</Card.Description>
						<Card.Title class="text-3xl">8</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="text-xs text-muted-foreground">16 total users</div>
					</Card.Content>
				</Card.Root>
			</div>
			<Tabs.Root value="all">
				<div class="flex items-center">
					<Tabs.List>
						<Tabs.Trigger value="all">All</Tabs.Trigger>
						<Tabs.Trigger value="active">Active</Tabs.Trigger>
						<Tabs.Trigger value="inactive">Inactive</Tabs.Trigger>
					</Tabs.List>
					<div class="ml-auto flex items-center gap-2">
						<Button size="sm" variant="outline" class="h-7 gap-1 text-sm">
							<File class="h-3.5 w-3.5" />
							<span class="sr-only sm:not-sr-only">Export</span>
						</Button>
					</div>
				</div>
				<Tabs.Content value="all">
					<Card.Root>
						<Card.Header class="px-7">
							<Card.Title>Servers</Card.Title>
							<Card.Description>All servers whether active or inactive</Card.Description>
						</Card.Header>
						<Card.Content>
							<Table.Root>
								<Table.Header>
									<Table.Row>
										<Table.Head>Hostname</Table.Head>
										<Table.Head class="hidden sm:table-cell">IP Address</Table.Head>
										<Table.Head class="hidden sm:table-cell">Status</Table.Head>
										<Table.Head class="hidden sm:table-cell">Users</Table.Head>
										<Table.Head class="text-right">Stale Time</Table.Head>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{#each filteredServers as server}
										<Table.Row
											class={cn('cursor-pointer', { 'bg-accent': server.id === selectedServerId })}
											onclick={() => (selectedServerId = server.id)}
										>
											<Table.Cell>
												<div class="font-medium">{server.name}</div>
											</Table.Cell>
											<Table.Cell class="hidden sm:table-cell">{server.ipAddress}</Table.Cell>
											<Table.Cell class="hidden sm:table-cell">
												<Badge class="text-xs" variant="secondary">Active</Badge>
											</Table.Cell>
											<Table.Cell class="hidden sm:table-cell">{server.users.length}</Table.Cell>
											<Table.Cell class="text-right">
												{AppUtils.getRelativeTime(server.lastHeartbeatOn)}
											</Table.Cell>
										</Table.Row>
									{/each}
								</Table.Body>
							</Table.Root>
						</Card.Content>
					</Card.Root>
				</Tabs.Content>
			</Tabs.Root>
		</div>
		<div>
			{#if selectedServerId !== null}
				<ServerInfoCard
					serverInfo={data.servers.find((server) => server.id === selectedServerId) as ServerData}
					users={data.users}
				/>
			{:else}
				<h3>No server selected</h3>
			{/if}
		</div>
	</main>
</div>
