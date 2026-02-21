<script lang="ts" module>
	import HouseIcon from '@lucide/svelte/icons/house';
	import KeyRoundIcon from '@lucide/svelte/icons/key-round';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import UsersRoundIcon from '@lucide/svelte/icons/users-round';

	const data = {
		user: {
			name: 'Admin',
			email: '',
			avatar: '',
		},
		navMain: [
			{
				title: 'Dashboard',
				url: '/dashboard',
				icon: HouseIcon,
			},
			{
				title: 'Users',
				url: '/users',
				icon: UsersRoundIcon,
			},
			{
				title: 'Settings',
				url: '/settings',
				icon: Settings2Icon,
			},
		],
	};
</script>

<script lang="ts">
	import NavMain from './nav-main.svelte';
	import NavUser from './nav-user.svelte';
	import * as Sidebar from '$lib/components/shadcn/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg">
					<div
						class="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
					>
						<KeyRoundIcon class="size-4" />
					</div>
					<div class="grid flex-1 text-start text-sm leading-tight">
						<span class="truncate font-medium">SSH Key Manager</span>
					</div>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
