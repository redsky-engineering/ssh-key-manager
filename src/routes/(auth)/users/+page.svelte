<script lang="ts">
	import { Badge } from '$lib/components/shadcn/ui/badge/index.js';
	import { Button } from '$lib/components/shadcn/ui/button/index.js';
	import { Input } from '$lib/components/shadcn/ui/input/index.js';
	import { Label } from '$lib/components/shadcn/ui/label/index.js';
	import * as Sheet from '$lib/components/shadcn/ui/sheet/index.js';
	import { Switch } from '$lib/components/shadcn/ui/switch/index.js';
	import * as Tabs from '$lib/components/shadcn/ui/tabs/index.js';
	import Search from '@lucide/svelte/icons/search';

	import * as Card from '$lib/components/shadcn/ui/card/index.js';
	import AddSshKeyPopup from '$lib/custom/dialogs/AddSshKeyDialog.svelte';
	import ConfirmationDialog from '$lib/custom/dialogs/ConfirmationDialog.svelte';
	import EditUserNamePopup from '$lib/custom/dialogs/EditUserNameDialog.svelte';
	import { addSshKeySchema, isActiveSchema, userNameSchema } from '$lib/schema/schema.js';
	import type { ServerData, UserData } from '$lib/server/simpleDb.js';
	import { CirclePlus, Key, Pencil, Server, Shield, Trash2 } from '@lucide/svelte/icons';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();

	let searchValue = $state('');
	let isSheetOpen = $state(false);
	let isEditUserNamePopupOpen = $state(false);
	let isAddSshKeyPopupOpen = $state(false);
	let isDeleteSshKeyConfirmOpen = $state(false);
	let pendingDeleteFingerprint: string | null = $state(null);
	let isRemoveFromServerConfirmOpen = $state(false);
	let pendingRemoveServerId: number | null = $state(null);
	let isSetInactiveConfirmOpen = $state(false);
	let isActiveFormEl: HTMLFormElement | undefined = $state();
	let selectedUser: UserData | null = $state(null);
	let deleteFormEl: HTMLFormElement;
	let removeFromServerFormEl: HTMLFormElement;

	let filteredUsers = $derived.by(() => {
		return data.users
			.filter((user) => user.name.toLowerCase().includes(searchValue.toLowerCase()))
			.sort((a, b) => {
				return a.name.localeCompare(b.name);
			});
	});

	let selectedUserServers = $derived.by((): ServerData[] => {
		if (!selectedUser) return [];
		return data.servers.filter((server) => server.userIds.includes(selectedUser!.id));
	});

	// svelte-ignore state_referenced_locally
	const userNameForm = superForm(data.userNameForm, {
		validators: zod4(userNameSchema),
		onUpdated: ({ form }) => {
			if (!form.valid) return;
			isEditUserNamePopupOpen = false;
			selectedUser!.name = form.data.name;
			toast.success("User's name updated successfully");
		}
	});
	const { form: userNameFormData } = userNameForm;

	// svelte-ignore state_referenced_locally
	const addSshKeyForm = superForm(data.addSshKeyForm, {
		validators: zod4(addSshKeySchema),
		onUpdated: ({ form }) => {
			if (!form.valid) {
				if (form.message) toast.error(form.message);
				return;
			}
			isAddSshKeyPopupOpen = false;
			// Need to add in the new key that was added, most likely need to send back extra data from server
			toast.success('SSH Key added successfully');
		}
	});
	const { form: addSshKeyFormData } = addSshKeyForm;

	// svelte-ignore state_referenced_locally
	const isActiveForm = superForm(data.isActiveForm, {
		validators: zod4(isActiveSchema),
		onUpdated: ({ form }) => {
			if (!form.valid) return;
			selectedUser!.isActive = form.data.isActive;
			if (!form.data.isActive) {
				for (const server of data.servers) {
					server.userIds = server.userIds.filter((id) => id !== form.data.userId);
				}
			}
			toast.success(`User is now ${selectedUser!.isActive ? 'active' : 'inactive'}`);
		}
	});
	const { form: isActiveFormData, enhance: isActiveFormEnhance } = isActiveForm;

	// svelte-ignore state_referenced_locally
	const deleteSshKeyForm = superForm(data.deleteSshKeyForm, {
		onSubmit: async (data) => {
			console.log(data);
		},
		onUpdated: ({ form }) => {
			if (!form.valid) {
				if (form.message) toast.error(form.message);
				return;
			}
			selectedUser!.sshKeyData = selectedUser!.sshKeyData.filter(
				(key) => key.fingerPrint !== form.data.fingerprint
			);
			toast.success('SSH Key deleted successfully');
		}
	});
	const { enhance: deleteSshKeyFormEnhance } = deleteSshKeyForm;

	// svelte-ignore state_referenced_locally
	const removeUserFromServerForm = superForm(data.deleteUserFromServerForm, {
		onUpdated: ({ form }) => {
			if (!form.valid) {
				if (form.message) toast.error(form.message);
				return;
			}
			const server = data.servers.find((s) => s.id === form.data.serverId);
			if (server) {
				server.userIds = server.userIds.filter((id) => id !== form.data.userId);
			}
			toast.success('Server access removed successfully');
		}
	});
	const { enhance: removeUserFromServerFormEnhance } = removeUserFromServerForm;

	$effect(() => {
		$userNameFormData = { name: selectedUser?.name || '', userId: selectedUser?.id || 0 };
		$isActiveFormData = {
			isActive: selectedUser?.isActive || false,
			userId: selectedUser?.id || 0
		};
		$addSshKeyFormData = { sshKey: '', userId: selectedUser?.id || 0 };
	});

	function handleClickUserCard(user: UserData) {
		isSheetOpen = true;
		selectedUser = user;
	}

	function onDeleteSshKeyClick(fingerprint: string) {
		pendingDeleteFingerprint = fingerprint;
		isDeleteSshKeyConfirmOpen = true;
	}

	function onConfirmDeleteSshKey() {
		deleteFormEl.requestSubmit();
		isDeleteSshKeyConfirmOpen = false;
		pendingDeleteFingerprint = null;
	}

	function onCancelDeleteSshKey() {
		isDeleteSshKeyConfirmOpen = false;
		pendingDeleteFingerprint = null;
	}

	function onRemoveFromServerClick(serverId: number) {
		pendingRemoveServerId = serverId;
		isRemoveFromServerConfirmOpen = true;
	}

	function onConfirmRemoveFromServer() {
		removeFromServerFormEl.requestSubmit();
		isRemoveFromServerConfirmOpen = false;
		pendingRemoveServerId = null;
	}

	function onCancelRemoveFromServer() {
		isRemoveFromServerConfirmOpen = false;
		pendingRemoveServerId = null;
	}

	function onSetInactiveClick(newValue: boolean) {
		if (!newValue) {
			isSetInactiveConfirmOpen = true;
		} else {
			isActiveFormEl?.requestSubmit();
		}
	}

	function onConfirmSetInactive() {
		isSetInactiveConfirmOpen = false;
		isActiveFormEl?.requestSubmit();
	}

	function onCancelSetInactive() {
		isSetInactiveConfirmOpen = false;
		$isActiveFormData.isActive = true;
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
							{#if user.isSystemAdmin}
								<Shield size={16} class="text-green-300" />
							{/if}
						</div>
						<Badge class="text-sm" variant={user.isActive ? 'default' : 'destructive'}>
							{user.isActive ? 'Active' : 'Inactive'}
						</Badge>
					</div>
				</Card.Title>
			</Card.Header>
			<Card.Footer class="flex justify-between">
				<div class="flex gap-2"><Key /> {user.sshKeyData.length}</div>
				<div class="flex gap-2">
					<Server />
					{data.servers.filter((server) => server.userIds.includes(user.id)).length}
				</div>
			</Card.Footer>
		</Card.Root>
	</button>
{/snippet}

<div class="flex flex-col gap-4 p-4">
	<div class="relative">
		<Search class="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
		<Input
			type="search"
			placeholder="Search users..."
			class="bg-background w-full rounded-lg pl-8 md:w-[200px] lg:w-[336px]"
			bind:value={searchValue}
		/>
	</div>
	<main class="grid flex-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
		{#each filteredUsers as user (user.id)}
			{@render userCard(user)}
		{/each}
	</main>
</div>

<Sheet.Root bind:open={isSheetOpen}>
	<Sheet.Content side="right" class="sm:max-w-lg">
		<Sheet.Header class="px-6 pt-6 pb-4">
			<Sheet.Title class="text-2xl">
				<div class="flex items-center gap-2">
					{selectedUser!.name}
					<Button
						size="icon"
						variant="ghost"
						class="size-7"
						onclick={() => (isEditUserNamePopupOpen = true)}
					>
						<Pencil class="size-4" />
					</Button>
				</div>
			</Sheet.Title>
		</Sheet.Header>
		<div class="flex flex-col gap-4 px-6 py-4">
			{#if !selectedUser!.isSystemAdmin}
				<div class="rounded-lg border p-4">
					<form action="?/active" use:isActiveFormEnhance method="POST" bind:this={isActiveFormEl}>
						<div class="flex items-center gap-3">
							<Switch
								id="isActive"
								name="isActive"
								bind:checked={$isActiveFormData.isActive}
								onCheckedChange={onSetInactiveClick}
							/>
							<Label for="isActive" class="cursor-pointer font-medium">
								{selectedUser!.isActive ? 'Active' : 'Inactive'}
							</Label>
							<input type="hidden" name="id" value={$isActiveFormData.userId} />
						</div>
					</form>
				</div>
			{/if}
			<Tabs.Root value="servers">
				<Tabs.List class="w-full">
					<Tabs.Trigger value="servers" class="flex-1">
						<Server class="mr-1.5 size-4" />
						Servers
					</Tabs.Trigger>
					<Tabs.Trigger value="ssh-keys" class="flex-1">
						<Key class="mr-1.5 size-4" />
						SSH Keys
					</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="servers" class="mt-3">
					<div class="flex flex-col gap-2">
						{#each selectedUserServers as server (server.id)}
							<div class="relative rounded-lg border p-4">
								<Button
									type="button"
									size="icon"
									variant="ghost"
									class="text-destructive hover:text-destructive absolute top-2 right-2 size-7"
									onclick={() => onRemoveFromServerClick(server.id)}
								>
									<Trash2 class="size-4" />
								</Button>
								<div class="grid gap-1 pr-8">
									<p class="text-sm font-medium">{server.name}</p>
									<p class="text-muted-foreground font-mono text-xs">{server.ipAddress}</p>
								</div>
							</div>
						{/each}
						{#if selectedUserServers.length === 0}
							<p class="text-muted-foreground py-6 text-center text-sm">No servers assigned yet.</p>
						{/if}
					</div>
				</Tabs.Content>
				<Tabs.Content value="ssh-keys" class="mt-3">
					<div class="flex flex-col gap-2">
						<div class="flex justify-end">
							<Button variant="outline" onclick={() => (isAddSshKeyPopupOpen = true)}>
								<CirclePlus class="size-4" />
								Add SSH Key
							</Button>
						</div>
						{#each selectedUser!.sshKeyData as key (key.fingerPrint)}
							<div class="relative rounded-lg border p-4">
								<Button
									type="button"
									size="icon"
									variant="ghost"
									class="text-destructive hover:text-destructive absolute top-2 right-2 size-7"
									onclick={() => onDeleteSshKeyClick(key.fingerPrint)}
								>
									<Trash2 class="size-4" />
								</Button>
								<div class="grid gap-2 pr-8">
									<div>
										<p class="text-muted-foreground text-xs">Comment</p>
										<p class="text-sm font-medium">{key.comment}</p>
									</div>
									<div>
										<p class="text-muted-foreground text-xs">Fingerprint</p>
										<p class="font-mono text-xs break-all">{key.fingerPrint}</p>
									</div>
								</div>
							</div>
						{/each}
						{#if selectedUser!.sshKeyData.length === 0}
							<p class="text-muted-foreground py-6 text-center text-sm">No SSH keys added yet.</p>
						{/if}
					</div>
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</Sheet.Content>
</Sheet.Root>

<form
	bind:this={deleteFormEl}
	action="?/delete-ssh-key"
	method="POST"
	use:deleteSshKeyFormEnhance
	class="hidden"
>
	<input type="hidden" name="userId" value={selectedUser?.id} />
	<input type="hidden" name="fingerprint" value={pendingDeleteFingerprint} />
</form>

<form
	bind:this={removeFromServerFormEl}
	action="?/remove-user-from-server"
	method="POST"
	use:removeUserFromServerFormEnhance
	class="hidden"
>
	<input type="hidden" name="userId" value={selectedUser?.id} />
	<input type="hidden" name="serverId" value={pendingRemoveServerId} />
</form>

<EditUserNamePopup bind:open={isEditUserNamePopupOpen} form={userNameForm} />
<AddSshKeyPopup bind:open={isAddSshKeyPopupOpen} form={addSshKeyForm} />
<ConfirmationDialog
	bind:open={isDeleteSshKeyConfirmOpen}
	title="Delete SSH Key"
	description="Are you sure you want to delete this SSH key? This action cannot be undone."
	isDestructive={true}
	confirmButtonText="Delete"
	onConfirm={onConfirmDeleteSshKey}
	onCancel={onCancelDeleteSshKey}
/>
<ConfirmationDialog
	bind:open={isRemoveFromServerConfirmOpen}
	title="Remove Server Access"
	description="Are you sure you want to remove this user's access to this server?"
	isDestructive={true}
	confirmButtonText="Remove"
	onConfirm={onConfirmRemoveFromServer}
	onCancel={onCancelRemoveFromServer}
/>
<ConfirmationDialog
	bind:open={isSetInactiveConfirmOpen}
	title="Deactivate User"
	description="Setting this user as inactive will remove them from all servers. Are you sure?"
	isDestructive={true}
	confirmButtonText="Deactivate"
	onConfirm={onConfirmSetInactive}
	onCancel={onCancelSetInactive}
/>
