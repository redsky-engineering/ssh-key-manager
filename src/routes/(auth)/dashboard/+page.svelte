<script lang="ts">
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import Copy from 'lucide-svelte/icons/copy';
	import CreditCard from 'lucide-svelte/icons/credit-card';
	import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';
	import File from 'lucide-svelte/icons/file';
	import Home from 'lucide-svelte/icons/house';
	import KeyRound from 'lucide-svelte/icons/key-round';
	import ListFilter from 'lucide-svelte/icons/list-filter';
	import PanelLeft from 'lucide-svelte/icons/panel-left';
	import Search from 'lucide-svelte/icons/search';
	import Settings from 'lucide-svelte/icons/settings';
	import Truck from 'lucide-svelte/icons/truck';
	import UserRound from 'lucide-svelte/icons/user-round';
	import UsersRound from 'lucide-svelte/icons/users-round';

	import { Badge } from '$lib/ui/badge/index.js';
	import { Button } from '$lib/ui/button/index.js';
	import * as Card from '$lib/ui/card/index.js';
	import * as DropdownMenu from '$lib/ui/dropdown-menu/index.js';
	import { Input } from '$lib/ui/input/index.js';
	import * as Pagination from '$lib/ui/pagination/index.js';
	import { Progress } from '$lib/ui/progress/index.js';
	import { Separator } from '$lib/ui/separator/index.js';
	import * as Sheet from '$lib/ui/sheet/index.js';
	import * as Table from '$lib/ui/table/index.js';
	import * as Tabs from '$lib/ui/tabs/index.js';
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
			<Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Search..."
				class="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
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
				<DropdownMenu.Item class="cursor-pointer">Logout</DropdownMenu.Item>
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
						<Card.Description>Inactive Servers</Card.Description>
						<Card.Title class="text-3xl text-red-300">4</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="text-xs text-muted-foreground">2 new from last week</div>
					</Card.Content>
					<Card.Footer>
						<Progress value={50} aria-label="2 new inactive servers" />
					</Card.Footer>
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
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild let:builder>
								<Button variant="outline" size="sm" class="h-7 gap-1 text-sm" builders={[builder]}>
									<ListFilter class="h-3.5 w-3.5" />
									<span class="sr-only sm:not-sr-only">Filter</span>
								</Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end">
								<DropdownMenu.Label>Filter by</DropdownMenu.Label>
								<DropdownMenu.Separator />
								<DropdownMenu.CheckboxItem checked>Fulfilled</DropdownMenu.CheckboxItem>
								<DropdownMenu.CheckboxItem>Declined</DropdownMenu.CheckboxItem>
								<DropdownMenu.CheckboxItem>Refunded</DropdownMenu.CheckboxItem>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
						<Button size="sm" variant="outline" class="h-7 gap-1 text-sm">
							<File class="h-3.5 w-3.5" />
							<span class="sr-only sm:not-sr-only">Export</span>
						</Button>
					</div>
				</div>
				<Tabs.Content value="all">
					<Card.Root>
						<Card.Header class="px-7">
							<Card.Title>Orders</Card.Title>
							<Card.Description>Recent orders from your store.</Card.Description>
						</Card.Header>
						<Card.Content>
							<Table.Root>
								<Table.Header>
									<Table.Row>
										<Table.Head>Customer</Table.Head>
										<Table.Head class="hidden sm:table-cell">Type</Table.Head>
										<Table.Head class="hidden sm:table-cell">Status</Table.Head>
										<Table.Head class="hidden md:table-cell">Date</Table.Head>
										<Table.Head class="text-right">Amount</Table.Head>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									<Table.Row class="bg-accent">
										<Table.Cell>
											<div class="font-medium">Liam Johnson</div>
											<div class="hidden text-sm text-muted-foreground md:inline">
												liam@example.com
											</div>
										</Table.Cell>
										<Table.Cell class="hidden sm:table-cell">Sale</Table.Cell>
										<Table.Cell class="hidden sm:table-cell">
											<Badge class="text-xs" variant="secondary">Fulfilled</Badge>
										</Table.Cell>
										<Table.Cell class="hidden md:table-cell">2023-06-23</Table.Cell>
										<Table.Cell class="text-right">$250.00</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell>
											<div class="font-medium">Olivia Smith</div>
											<div class="hidden text-sm text-muted-foreground md:inline">
												olivia@example.com
											</div>
										</Table.Cell>
										<Table.Cell class="hidden sm:table-cell">Refund</Table.Cell>
										<Table.Cell class="hidden sm:table-cell">
											<Badge class="text-xs" variant="outline">Declined</Badge>
										</Table.Cell>
										<Table.Cell class="hidden md:table-cell">2023-06-24</Table.Cell>
										<Table.Cell class="text-right">$150.00</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell>
											<div class="font-medium">Noah Williams</div>
											<div class="hidden text-sm text-muted-foreground md:inline">
												noah@example.com
											</div>
										</Table.Cell>
										<Table.Cell class="hidden sm:table-cell">Subscription</Table.Cell>
										<Table.Cell class="hidden sm:table-cell">
											<Badge class="text-xs" variant="secondary">Fulfilled</Badge>
										</Table.Cell>
										<Table.Cell class="hidden md:table-cell">2023-06-25</Table.Cell>
										<Table.Cell class="text-right">$350.00</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell>
											<div class="font-medium">Emma Brown</div>
											<div class="hidden text-sm text-muted-foreground md:inline">
												emma@example.com
											</div>
										</Table.Cell>
										<Table.Cell class="hidden sm:table-cell">Sale</Table.Cell>
										<Table.Cell class="hidden sm:table-cell">
											<Badge class="text-xs" variant="secondary">Fulfilled</Badge>
										</Table.Cell>
										<Table.Cell class="hidden md:table-cell">2023-06-26</Table.Cell>
										<Table.Cell class="text-right">$450.00</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell>
											<div class="font-medium">Liam Johnson</div>
											<div class="hidden text-sm text-muted-foreground md:inline">
												liam@example.com
											</div>
										</Table.Cell>
										<Table.Cell class="hidden sm:table-cell">Sale</Table.Cell>
										<Table.Cell class="hidden sm:table-cell">
											<Badge class="text-xs" variant="secondary">Fulfilled</Badge>
										</Table.Cell>
										<Table.Cell class="hidden md:table-cell">2023-06-23</Table.Cell>
										<Table.Cell class="text-right">$250.00</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell>
											<div class="font-medium">Liam Johnson</div>
											<div class="hidden text-sm text-muted-foreground md:inline">
												liam@example.com
											</div>
										</Table.Cell>
										<Table.Cell class="hidden sm:table-cell">Sale</Table.Cell>
										<Table.Cell class="hidden sm:table-cell">
											<Badge class="text-xs" variant="secondary">Fulfilled</Badge>
										</Table.Cell>
										<Table.Cell class="hidden md:table-cell">2023-06-23</Table.Cell>
										<Table.Cell class="text-right">$250.00</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell>
											<div class="font-medium">Olivia Smith</div>
											<div class="hidden text-sm text-muted-foreground md:inline">
												olivia@example.com
											</div>
										</Table.Cell>
										<Table.Cell class="hidden sm:table-cell">Refund</Table.Cell>
										<Table.Cell class="hidden sm:table-cell">
											<Badge class="text-xs" variant="outline">Declined</Badge>
										</Table.Cell>
										<Table.Cell class="hidden md:table-cell">2023-06-24</Table.Cell>
										<Table.Cell class="text-right">$150.00</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell>
											<div class="font-medium">Emma Brown</div>
											<div class="hidden text-sm text-muted-foreground md:inline">
												emma@example.com
											</div>
										</Table.Cell>
										<Table.Cell class="hidden sm:table-cell">Sale</Table.Cell>
										<Table.Cell class="hidden sm:table-cell">
											<Badge class="text-xs" variant="secondary">Fulfilled</Badge>
										</Table.Cell>
										<Table.Cell class="hidden md:table-cell">2023-06-26</Table.Cell>
										<Table.Cell class="text-right">$450.00</Table.Cell>
									</Table.Row>
								</Table.Body>
							</Table.Root>
						</Card.Content>
					</Card.Root>
				</Tabs.Content>
			</Tabs.Root>
		</div>
		<div>
			<Card.Root class="overflow-hidden">
				<Card.Header class="flex flex-row items-start bg-muted/50">
					<div class="grid gap-0.5">
						<Card.Title class="group flex items-center gap-2 text-lg">
							Order Oe31b70H
							<Button
								size="icon"
								variant="outline"
								class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
							>
								<Copy class="h-3 w-3" />
								<span class="sr-only">Copy Order ID</span>
							</Button>
						</Card.Title>
						<Card.Description>Date: November 23, 2023</Card.Description>
					</div>
					<div class="ml-auto flex items-center gap-1">
						<Button size="sm" variant="outline" class="h-8 gap-1">
							<Truck class="h-3.5 w-3.5" />
							<span class="lg:sr-only xl:not-sr-only xl:whitespace-nowrap"> Track Order </span>
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
						<div class="font-semibold">Order Details</div>
						<ul class="grid gap-3">
							<li class="flex items-center justify-between">
								<span class="text-muted-foreground">
									Glimmer Lamps x <span>2</span>
								</span>
								<span>$250.00</span>
							</li>
							<li class="flex items-center justify-between">
								<span class="text-muted-foreground">
									Aqua Filters x <span>1</span>
								</span>
								<span>$49.00</span>
							</li>
						</ul>
						<Separator class="my-2" />
						<ul class="grid gap-3">
							<li class="flex items-center justify-between">
								<span class="text-muted-foreground">Subtotal</span>
								<span>$299.00</span>
							</li>
							<li class="flex items-center justify-between">
								<span class="text-muted-foreground">Shipping</span>
								<span>$5.00</span>
							</li>
							<li class="flex items-center justify-between">
								<span class="text-muted-foreground">Tax</span>
								<span>$25.00</span>
							</li>
							<li class="flex items-center justify-between font-semibold">
								<span class="text-muted-foreground">Total</span>
								<span>$329.00</span>
							</li>
						</ul>
					</div>
					<Separator class="my-4" />
					<div class="grid grid-cols-2 gap-4">
						<div class="grid gap-3">
							<div class="font-semibold">Shipping Information</div>
							<address class="grid gap-0.5 not-italic text-muted-foreground">
								<span>Liam Johnson</span>
								<span>1234 Main St.</span>
								<span>Anytown, CA 12345</span>
							</address>
						</div>
						<div class="grid auto-rows-max gap-3">
							<div class="font-semibold">Billing Information</div>
							<div class="text-muted-foreground">Same as shipping address</div>
						</div>
					</div>
					<Separator class="my-4" />
					<div class="grid gap-3">
						<div class="font-semibold">Customer Information</div>
						<dl class="grid gap-3">
							<div class="flex items-center justify-between">
								<dt class="text-muted-foreground">Customer</dt>
								<dd>Liam Johnson</dd>
							</div>
							<div class="flex items-center justify-between">
								<dt class="text-muted-foreground">Email</dt>
								<dd>
									<a href="mailto:">liam@acme.com</a>
								</dd>
							</div>
							<div class="flex items-center justify-between">
								<dt class="text-muted-foreground">Phone</dt>
								<dd>
									<a href="tel:">+1 234 567 890</a>
								</dd>
							</div>
						</dl>
					</div>
					<Separator class="my-4" />
					<div class="grid gap-3">
						<div class="font-semibold">Payment Information</div>
						<dl class="grid gap-3">
							<div class="flex items-center justify-between">
								<dt class="flex items-center gap-1 text-muted-foreground">
									<CreditCard class="h-4 w-4" />
									Visa
								</dt>
								<dd>**** **** **** 4532</dd>
							</div>
						</dl>
					</div>
				</Card.Content>
				<Card.Footer class="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
					<div class="text-xs text-muted-foreground">
						Updated <time dateTime="2023-11-23">November 23, 2023</time>
					</div>
					<Pagination.Root count={10} class="ml-auto mr-0 w-auto">
						<Pagination.Content>
							<Pagination.Item>
								<Button size="icon" variant="outline" class="h-6 w-6">
									<ChevronLeft class="h-3.5 w-3.5" />
									<span class="sr-only">Previous Order</span>
								</Button>
							</Pagination.Item>
							<Pagination.Item>
								<Button size="icon" variant="outline" class="h-6 w-6">
									<ChevronRight class="h-3.5 w-3.5" />
									<span class="sr-only">Next Order</span>
								</Button>
							</Pagination.Item>
						</Pagination.Content>
					</Pagination.Root>
				</Card.Footer>
			</Card.Root>
		</div>
	</main>
</div>