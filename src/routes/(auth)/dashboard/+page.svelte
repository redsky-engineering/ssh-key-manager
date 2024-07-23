<script lang="ts">
	import File from 'lucide-svelte/icons/file';

	import AppUtils from '$lib/AppUtils.js';
	import type { ServerData } from '$lib/types.js';
	import AppBarMobileMenu from '$lib/ui/appBarMobileMenu/AppBarMobileMenu.svelte';
	import { Badge } from '$lib/ui/badge/index.js';
	import { Button } from '$lib/ui/button/index.js';
	import * as Card from '$lib/ui/card/index.js';
	import { Progress } from '$lib/ui/progress/index.js';
	import ServerInfoCard from '$lib/ui/serverInfoCard/ServerInfoCard.svelte';
	import * as Table from '$lib/ui/table/index.js';
	import * as Tabs from '$lib/ui/tabs/index.js';
	import { cn } from '$lib/utils.js';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();

	let selectedServerId: number | null = $state(data.servers.length > 0 ? data.servers[0].id : null);
	$inspect(selectedServerId);

	let searchValue = $state('');

	let filteredServers = $derived.by(() => {
		return data.servers.filter((server) => server.name.toLowerCase().includes(searchValue.toLowerCase()));
	});

	function isServerActive(server: ServerData): boolean {
		const staleTime = Date.now() - new Date(server.lastHeartbeatOn).getTime();
		return staleTime < 3 * 60 * 1000;
	}

	function handleAddUsersToServer(userIds: number[]) {
		console.log('Adding users to server', userIds);
	}
</script>

<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
	<AppBarMobileMenu bind:searchValue />
	<main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
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
						<Progress value={50} aria-label="2 new stale servers" />
					</Card.Footer>
				</Card.Root>
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Description>Users With Access</Card.Description>
						<Card.Title class="text-3xl">{data.users.length}</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="text-xs text-muted-foreground">{data.users.length} total users</div>
					</Card.Content>
				</Card.Root>
			</div>
			<Tabs.Root value="all">
				<div class="flex items-center">
					<Tabs.List>
						<Tabs.Trigger value="all">All</Tabs.Trigger>
						<Tabs.Trigger value="active">Active</Tabs.Trigger>
						<Tabs.Trigger value="stale">Stale</Tabs.Trigger>
					</Tabs.List>
					<div class="ml-auto flex items-center gap-2">
						<Button size="sm" variant="outline" class="h-7 gap-1 text-sm">
							<File class="h-3.5 w-3.5" />
							<span class="sr-only sm:not-sr-only">Export</span>
						</Button>
					</div>
				</div>
				<Tabs.Content value="all">
					{@render serverTable('all')}
				</Tabs.Content>
				<Tabs.Content value="active">
					{@render serverTable('active')}
				</Tabs.Content>
				<Tabs.Content value="stale">
					{@render serverTable('stale')}
				</Tabs.Content>
			</Tabs.Root>
		</div>
		<div>
			{#if selectedServerId !== null}
				<ServerInfoCard
					serverInfo={data.servers.find((server) => server.id === selectedServerId) as ServerData}
					users={data.users}
					onNextServer={() => {
						const index = data.servers.findIndex((server) => server.id === selectedServerId);
						selectedServerId = data.servers[(index + 1) % data.servers.length].id;
					}}
					onPreviousServer={() => {
						const index = data.servers.findIndex((server) => server.id === selectedServerId);
						selectedServerId = data.servers[(index - 1 + data.servers.length) % data.servers.length].id;
					}}
					onAddUsersToServer={handleAddUsersToServer}
				/>
			{:else}
				<h3>No server selected</h3>
			{/if}
		</div>
	</main>
</div>

{#snippet serverTable(state: 'all' | 'active' | 'stale')}
	<Card.Root>
		<Card.Header class="px-7">
			<Card.Title>Servers</Card.Title>
			{#if state === 'all'}
				<Card.Description>All servers whether active or stale</Card.Description>
			{:else if state === 'active'}
				<Card.Description>Only active servers</Card.Description>
			{:else}
				<Card.Description>Only stale servers</Card.Description>
			{/if}
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
						{@const serverActive = isServerActive(server)}
						{#if state === 'all' || (state === 'active' && serverActive) || (state === 'stale' && !serverActive)}
							<Table.Row
								class={cn('cursor-pointer', {
									'bg-accent': server.id === selectedServerId
								})}
								onclick={() => (selectedServerId = server.id)}
							>
								<Table.Cell>
									<div class="font-medium">{server.name}</div>
								</Table.Cell>
								<Table.Cell class="hidden sm:table-cell">{server.ipAddress}</Table.Cell>
								<Table.Cell class="hidden sm:table-cell">
									<Badge class="text-xs" variant={serverActive ? 'default' : 'secondary'}>
										{serverActive ? 'Active' : 'Stale'}
									</Badge>
								</Table.Cell>
								<Table.Cell class="hidden sm:table-cell">{server.users.length}</Table.Cell>
								<Table.Cell class="text-right">
									{AppUtils.getRelativeTime(server.lastHeartbeatOn)}
								</Table.Cell>
							</Table.Row>
						{/if}
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
{/snippet}
