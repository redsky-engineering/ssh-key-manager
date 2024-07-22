<script lang="ts">
	import Home from 'lucide-svelte/icons/house';
	import KeyRound from 'lucide-svelte/icons/key-round';
	import PanelLeft from 'lucide-svelte/icons/panel-left';
	import Search from 'lucide-svelte/icons/search';
	import Settings from 'lucide-svelte/icons/settings';
	import UserRound from 'lucide-svelte/icons/user-round';
	import UsersRound from 'lucide-svelte/icons/users-round';

	import * as DropdownMenu from '$lib/ui/dropdown-menu/index.js';
	import { Input } from '$lib/ui/input/index.js';

	import { Button } from '$lib/ui/button/index.js';

	import * as Sheet from '$lib/ui/sheet/index.js';

	interface Props {
		searchValue: string;
	}
	let { searchValue = $bindable() }: Props = $props();
</script>

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
				<a href="##" class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
					<Home class="h-5 w-5" />
					Dashboard
				</a>
				<a href="##" class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
					<UsersRound class="h-5 w-5" />
					Users
				</a>
				<a href="##" class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
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
			class="clearSearch w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
			bind:value={searchValue}
		/>
	</div>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button variant="outline" size="icon" class="overflow-hidden rounded-full" builders={[builder]}>
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

<style>
	:global(.clearSearch::-webkit-search-cancel-button) {
		font-size: 18px;
		cursor: pointer;
	}
</style>
