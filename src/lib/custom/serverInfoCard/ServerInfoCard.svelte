<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Copy from '@lucide/svelte/icons/copy';
	import Network from '@lucide/svelte/icons/network';
	import Shield from '@lucide/svelte/icons/shield';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	import AppUtils from '$lib/AppUtils.js';
	import { Button, buttonVariants } from '$lib/components/shadcn/ui/button/index.js';
	import * as Card from '$lib/components/shadcn/ui/card/index.js';
	import * as Dialog from '$lib/components/shadcn/ui/dialog/index.js';
	import * as Select from '$lib/components/shadcn/ui/select/index.js';
	import { Separator } from '$lib/components/shadcn/ui/separator/index.js';
	import { addUsersToServerSchema, deleteUserFromServerSchema } from '$lib/schema/schema';
	import type { ServerData, UserData } from '$lib/server/simpleDb.js';
	import { Popover } from 'bits-ui';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import type { z } from 'zod';

	interface ServerInfoCardProps {
		serverInfo: ServerData;
		users: UserData[];
		onNextServer: () => void;
		onPreviousServer: () => void;
		addUsersToServer: z.infer<typeof addUsersToServerSchema>;
		deleteUserFromServer: z.infer<typeof deleteUserFromServerSchema>;
	}

	let {
		serverInfo,
		users,
		onNextServer,
		onPreviousServer,
		addUsersToServer,
		deleteUserFromServer
	}: ServerInfoCardProps = $props();
	let isAddToUsersDialogOpen = $state(false);
	let userIdsToAdd: number[] = $state([]);

	const usersAvailableToAdd = $derived(
		users.filter(
			(user) =>
				!serverInfo.userIds.find((id) => id === user.id) &&
				user.isActive &&
				user.sshKeyData.length > 0
		)
	);

	const serverUsers = $derived(
		serverInfo.userIds
			.map((userId) => users.find((user) => user.id === userId))
			.filter((user): user is UserData => user !== undefined)
			.sort((userA, userB) => {
				if (userA.isSystemAdmin !== userB.isSystemAdmin) {
					return userA.isSystemAdmin ? -1 : 1;
				}
				return userA.name.localeCompare(userB.name);
			})
	);

	// svelte-ignore state_referenced_locally
	const addUsersToServerForm = superForm(addUsersToServer, {
		validators: zod4(addUsersToServerSchema),
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
	const {
		enhance: addUsersToServerFormEnhance,
		form: addUsersToServerFormData,
		errors,
		constraints
	} = addUsersToServerForm;

	// svelte-ignore state_referenced_locally
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

	let forms: HTMLFormElement[] = $state([]);

	function onDelete(form: HTMLFormElement) {
		if (form) {
			form.requestSubmit();
		}
	}

	$effect(() => {
		$addUsersToServerFormData = { userIds: userIdsToAdd, serverId: serverInfo.id };
	});
</script>

<Card.Root class="overflow-hidden">
	<Card.Header class="bg-muted/50 flex flex-row items-start justify-between pt-5 pb-4">
		<div class="grid gap-1">
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
			<div class="text-muted-foreground flex items-center gap-2 text-sm">
				<span>IP: {serverInfo.ipAddress}</span>
				<Button
					size="sm"
					variant="outline"
					class="h-6 gap-1 px-2"
					onclick={() => {
						AppUtils.copyToClipboardWeb(serverInfo.ipAddress);
						toast.success('IP address copied to clipboard');
					}}
				>
					<Network class="h-3 w-3" />
					<span class="text-xs">Copy IP</span>
				</Button>
			</div>
			<div class="text-muted-foreground text-xs">
				Updated <time dateTime={serverInfo.lastHeartbeatOn}>
					{AppUtils.getRelativeTime(serverInfo.lastHeartbeatOn)}
				</time>
			</div>
		</div>
		<div class="flex items-center gap-1">
			<Button size="icon" variant="outline" class="h-6 w-6" onclick={onPreviousServer}>
				<ChevronLeft class="h-3.5 w-3.5" />
				<span class="sr-only">Previous Server</span>
			</Button>
			<Button size="icon" variant="outline" class="h-6 w-6" onclick={onNextServer}>
				<ChevronRight class="h-3.5 w-3.5" />
				<span class="sr-only">Next Server</span>
			</Button>
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
				{#each serverUsers as user (user.id)}
					<li class="flex items-center justify-between">
						<span class="text-muted-foreground">{user.name}</span>
						{#if !user.isSystemAdmin}
							<form
								action="?/delete-user-from-server"
								method="POST"
								use:deleteUserFromServerFormEnhance
								bind:this={forms[user.id]}
							>
								<Popover.Root>
									<Popover.Trigger>
										<Trash2
											class="text-muted-foreground h-4 w-4 cursor-pointer hover:text-red-300"
										/>
									</Popover.Trigger>
									<Popover.Content class="bg-popover w-48 rounded-md border p-0 shadow-md">
										<Popover.Arrow class="fill-popover" />
										<div class="space-y-2 p-3">
											<p class="text-muted-foreground text-sm">
												Are you sure you want to delete {user.name} from {serverInfo.name}?
											</p>
											<div class="flex justify-end gap-2">
												<Popover.Close>
													<Button variant="outline">Cancel</Button>
												</Popover.Close>
												<Popover.Close>
													<Button onclick={() => onDelete(forms[user.id])}>Delete</Button>
												</Popover.Close>
											</div>
										</div>
									</Popover.Content>
								</Popover.Root>
								<input type="hidden" name="serverId" value={serverInfo.id} />
								<input type="hidden" name="userId" value={user.id} />
							</form>
						{:else}
							<Shield class="h-4 w-4 text-green-300" />
						{/if}
					</li>
				{/each}
				<Dialog.Root
					onOpenChange={() => ($errors.userIds = undefined)}
					bind:open={isAddToUsersDialogOpen}
				>
					<Dialog.Trigger class={buttonVariants({ variant: 'secondary', size: 'sm' })}>
						Add User
					</Dialog.Trigger>
					<Dialog.Content class="w-[90%] max-w-sm" interactOutsideBehavior="ignore">
						<form
							method="POST"
							action="?/add-users-to-server"
							use:addUsersToServerFormEnhance
							class="grid gap-4"
						>
							<Dialog.Header>
								<Dialog.Title class="mb-2">Who do you want to add?</Dialog.Title>
								<Dialog.Description>
									<Select.Root
										type="multiple"
										onValueChange={(selected: string[]) => {
											if (selected) {
												userIdsToAdd = selected.map((idString) => parseInt(idString));
											}
										}}
									>
										<Select.Trigger class="w-full" aria-placeholder="Select a user">
											{userIdsToAdd
												.map((id) => usersAvailableToAdd.find((user) => user.id === id)?.name)
												.join(', ')}
										</Select.Trigger>
										<Select.Content>
											<Select.Group>
												{#each usersAvailableToAdd as user (user.id)}
													<Select.Item value={user.id.toString()} label={user.name}>
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
								{#each userIdsToAdd as userId (userId)}
									<input type="hidden" name="userIds" value={userId} {...$constraints.userIds} />
								{/each}
								<input type="hidden" name="serverId" value={serverInfo.id} />
								<Button
									variant="outline"
									onclick={() => {
										isAddToUsersDialogOpen = false;
										userIdsToAdd = [];
									}}
								>
									Cancel
								</Button>
								<Button type="submit">Add Users</Button>
							</Dialog.Footer>
						</form>
					</Dialog.Content>
				</Dialog.Root>
			</ul>
		</div>
	</Card.Content>
</Card.Root>
