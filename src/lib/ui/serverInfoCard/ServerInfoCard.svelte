<script lang="ts">
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import Copy from 'lucide-svelte/icons/copy';
	import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';
	import Network from 'lucide-svelte/icons/network';
	import Trash2 from 'lucide-svelte/icons/trash-2';

	import AppUtils from '$lib/AppUtils.js';
	import type { ServerData } from '$lib/types.js';
	import { Button } from '$lib/ui/button/index.js';
	import * as Card from '$lib/ui/card/index.js';
	import * as DropdownMenu from '$lib/ui/dropdown-menu/index.js';
	import * as Pagination from '$lib/ui/pagination/index.js';
	import { Separator } from '$lib/ui/separator/index.js';

	interface Props {
		serverInfo: ServerData;
	}
	let { serverInfo }: Props = $props();
</script>

<Card.Root class="overflow-hidden">
	<Card.Header class="flex flex-row items-start bg-muted/50">
		<div class="grid gap-0.5">
			<Card.Title class="group flex items-center gap-2 text-lg">
				{serverInfo.name}
				<Button
					size="icon"
					variant="outline"
					class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
					onclick={() => AppUtils.copyToClipboardWeb(serverInfo.name)}
				>
					<Copy class="h-3 w-3" />
					<span class="sr-only">Copy Server Name</span>
				</Button>
			</Card.Title>
			<Card.Description>IP Address: {serverInfo.ipAddress}</Card.Description>
		</div>
		<div class="ml-auto flex items-center gap-1">
			<Button
				size="sm"
				variant="outline"
				class="h-8 gap-1"
				onclick={() => AppUtils.copyToClipboardWeb(serverInfo.ipAddress)}
			>
				<Network class="h-3.5 w-3.5" />
				<span class="lg:sr-only xl:not-sr-only xl:whitespace-nowrap"> Copy IP </span>
			</Button>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} size="icon" variant="outline" class="h-8 w-8">
						<EllipsisVertical class="h-3.5 w-3.5" />
						<span class="sr-only">More</span>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Item>Edit</DropdownMenu.Item>
					<DropdownMenu.Item>Export</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>Trash</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</Card.Header>
	<Card.Content class="p-6 text-sm">
		<div class="grid gap-3">
			<div class="font-semibold">Health</div>
			<ul class="grid gap-3">
				<li class="flex items-center justify-between">
					<span class="text-muted-foreground"> CPU Usage </span>
					<span>{serverInfo.cpuUsagePercent}%</span>
				</li>
				<li class="flex items-center justify-between">
					<span class="text-muted-foreground"> RAM Usage </span>
					<span> {serverInfo.memoryUsagePercent}% </span>
				</li>
				<li class="flex items-center justify-between">
					<span class="text-muted-foreground"> Disk Usage </span>
					<span> {serverInfo.diskUsagePercent}% </span>
				</li>
			</ul>
			<Separator class="my-2" />
			<div class="font-semibold">Users</div>
			<ul class="grid gap-3">
				{#each serverInfo.users as user}
					<li class="flex items-center justify-between">
						<span class="text-muted-foreground">{user.name}</span>
						<Trash2 class="h-4 w-4 cursor-pointer text-muted-foreground hover:text-red-300" />
					</li>
				{/each}
				<Button variant="secondary" size="sm">Add User</Button>
			</ul>
		</div>
	</Card.Content>
	<Card.Footer class="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
		<div class="text-xs text-muted-foreground">
			Updated <time dateTime="2024-07-15T10:01:03"
				>{AppUtils.getRelativeTime(serverInfo.lastHeartbeatOn)}</time
			>
		</div>
		<Pagination.Root count={10} class="ml-auto mr-0 w-auto">
			<Pagination.Content>
				<Pagination.Item>
					<Button size="icon" variant="outline" class="h-6 w-6">
						<ChevronLeft class="h-3.5 w-3.5" />
						<span class="sr-only">Previous Server</span>
					</Button>
				</Pagination.Item>
				<Pagination.Item>
					<Button size="icon" variant="outline" class="h-6 w-6">
						<ChevronRight class="h-3.5 w-3.5" />
						<span class="sr-only">Next Server</span>
					</Button>
				</Pagination.Item>
			</Pagination.Content>
		</Pagination.Root>
	</Card.Footer>
</Card.Root>
