<script lang="ts">
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import Copy from 'lucide-svelte/icons/copy';
	import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';
	import Network from 'lucide-svelte/icons/network';
	import Trash2 from 'lucide-svelte/icons/trash-2';

	import AppUtils from '$lib/AppUtils.js';
	import type { ServerData, UserData } from '$lib/server/simpleDb.js';
	import { Button, buttonVariants } from '$lib/ui/button/index.js';
	import * as Card from '$lib/ui/card/index.js';
	import * as Dialog from '$lib/ui/dialog';
	import * as DropdownMenu from '$lib/ui/dropdown-menu/index.js';
	import * as Pagination from '$lib/ui/pagination/index.js';
	import * as Select from '$lib/ui/select/index.js';
	import { Separator } from '$lib/ui/separator/index.js';
	import { superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { z } from 'zod';
	import { addUsersToServerSchema, deleteUserFromServerSchema } from '$lib/schema/schema';
	import { Popover } from 'bits-ui';

	interface Props {
		serverInfo: ServerData;
		users: UserData[];
		onNextServer: () => void;
		onPreviousServer: () => void;
		addUsersToServer: z.infer<typeof addUsersToServerSchema>;
		deleteUserFromServer: z.infer<typeof deleteUserFromServerSchema>;
	}

	let { serverInfo, users, onNextServer, onPreviousServer, addUsersToServer, deleteUserFromServer }: Props = $props();
	let isAddToUsersDialogOpen = $state(false);
	let userIdsToAdd = $state<number[]>([]);
	let deleteUserForm: z.infer<typeof deleteUserFromServerSchema>;

	const usersAvailableToAdd = $derived(users.filter((user) => !serverInfo.userIds.find((id) => id === user.id)));

	const addUsersToServerForm = superForm(addUsersToServer, {
		validators: zod(addUsersToServerSchema),
		onUpdated: ({ form }) => {
			if (!form.valid) {
				if (form.message) toast.error(form.message);
				return;
			}
			toast.success('Users added to server successfully');
			userIdsToAdd = [];
			isAddToUsersDialogOpen = false;
		}
	});
	const { enhance, form: addUsersToServerFormData, errors, constraints } = addUsersToServerForm;

	const deleteUserFromServerForm = superForm(deleteUserFromServer, {
		onUpdated: ({ form }) => {
			if (!form.valid) {
				if (form.message) toast.error(form.message);
				return;
			}

			toast.success('User deleted successfully');
		}
	});
	const { enhance: deleteUserFromServerFormEnhance } = deleteUserFromServerForm;

	$effect(() => {
		$addUsersToServerFormData = { userIds: userIdsToAdd, serverId: serverInfo.id };
	});
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
				<span class="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">Copy IP</span>
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
					<span class="text-muted-foreground">CPU Usage</span>
					<span>{serverInfo.cpuUsagePercent}%</span>
				</li>
				<li class="flex items-center justify-between">
					<span class="text-muted-foreground">RAM Usage</span>
					<span>{serverInfo.memoryUsagePercent}%</span>
				</li>
				<li class="flex items-center justify-between">
					<span class="text-muted-foreground">Disk Usage</span>
					<span>{serverInfo.diskUsagePercent}%</span>
				</li>
			</ul>
			<Separator class="my-2" />
			<div class="font-semibold">Users</div>
			<ul class="grid gap-3">
				{#each serverInfo.userIds as userId}
					{#if users.find((user) => user.id === userId)}
						{@const user = users.find((user) => user.id === userId)}
						<li class="flex items-center justify-between">
							<span class="text-muted-foreground">{user!.name}</span>
							<form
								id={`delete-user-form-${userId}`}
								action="?/delete-user-from-server"
								method="POST"
								use:deleteUserFromServerFormEnhance
								class="contents"
							>
								<Popover.Root>
									<Popover.Trigger>
										<Trash2
											class="h-4 w-4 cursor-pointer text-muted-foreground hover:text-red-300"
										/>
									</Popover.Trigger>
									<Popover.Content class="w-48 rounded-md border bg-popover p-0 shadow-md">
										<Popover.Arrow class="fill-popover" />
										<div class="space-y-2 p-3">
											<p class="text-sm text-muted-foreground">
												Are you sure you want to delete {user!.name} from {serverInfo.name}?
											</p>
											<div class="flex justify-end gap-2">
												<Popover.Close>
													<Button variant="outline">Cancel</Button>
												</Popover.Close>
												<Popover.Close>
													<Button
														on:click={() => {
															const form = document.getElementById(
																`delete-user-form-${userId}`
															);
															if (form) {
																form.dispatchEvent(new Event('submit'));
															}
														}}
													>
														Delete
													</Button>
												</Popover.Close>
											</div>
										</div>
									</Popover.Content>
								</Popover.Root>
								<input type="hidden" name="serverId" value={serverInfo.id} />
								<input type="hidden" name="userId" value={userId} />
							</form>
						</li>
					{/if}
				{/each}
				<Dialog.Root
					closeOnOutsideClick={false}
					onOpenChange={() => ($errors.userIds = undefined)}
					bind:open={isAddToUsersDialogOpen}
				>
					<Dialog.Trigger class={buttonVariants({ variant: 'secondary', size: 'sm' })}>
						Add User
					</Dialog.Trigger>
					<Dialog.Content class="w-[90%] max-w-sm">
						<form method="POST" action="?/add-users-to-server" use:enhance class="grid gap-4">
							<Dialog.Header>
								<Dialog.Title class="mb-2">Who do you want to add?</Dialog.Title>
								<Dialog.Description>
									<Select.Root
										multiple
										onSelectedChange={(selected) => {
											if (selected) {
												const selectedItems = selected as { value: number; label: string }[];
												userIdsToAdd = selectedItems.map((item) => item.value);
											}
										}}
									>
										<Select.Trigger class="w-[100%]">
											<Select.Value placeholder="Select a user" />
										</Select.Trigger>
										<Select.Content>
											<Select.Group>
												{#each usersAvailableToAdd as user}
													<Select.Item value={user.id} label={user.name}>
														{user.name}
													</Select.Item>
												{/each}
											</Select.Group>
										</Select.Content>
									</Select.Root>
								</Dialog.Description>
								{#if $errors.userIds}<span class="pl-2 text-sm text-red-500">
										{$errors.userIds._errors}
									</span>{/if}
							</Dialog.Header>
							<Dialog.Footer class="gap-2">
								{#each userIdsToAdd as tag, index}
									<input
										type="hidden"
										name="userIds"
										bind:value={userIdsToAdd[index]}
										{...$constraints.userIds}
									/>
								{/each}
								<input type="hidden" name="serverId" value={serverInfo.id} />
								<Button
									class="w-full"
									variant="outline"
									onclick={() => {
										isAddToUsersDialogOpen = false;
										userIdsToAdd = [];
									}}
								>
									Cancel
								</Button>
								<Button class="w-full" type="submit">Add Users</Button>
							</Dialog.Footer>
						</form>
					</Dialog.Content>
				</Dialog.Root>
			</ul>
		</div>
	</Card.Content>
	<Card.Footer class="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
		<div class="text-xs text-muted-foreground">
			Updated <time dateTime="2024-07-15T10:01:03">{AppUtils.getRelativeTime(serverInfo.lastHeartbeatOn)}</time>
		</div>
		<Pagination.Root count={10} class="ml-auto mr-0 w-auto">
			<Pagination.Content>
				<Pagination.Item>
					<Button size="icon" variant="outline" class="h-6 w-6" onclick={onPreviousServer}>
						<ChevronLeft class="h-3.5 w-3.5" />
						<span class="sr-only">Previous Server</span>
					</Button>
				</Pagination.Item>
				<Pagination.Item>
					<Button size="icon" variant="outline" class="h-6 w-6" onclick={onNextServer}>
						<ChevronRight class="h-3.5 w-3.5" />
						<span class="sr-only">Next Server</span>
					</Button>
				</Pagination.Item>
			</Pagination.Content>
		</Pagination.Root>
	</Card.Footer>
</Card.Root>
