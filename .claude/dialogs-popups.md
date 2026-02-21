# Dialogs & Popups

This document defines state management patterns for dialogs, drawers, and popups.

---

## Core Principles

1. **`isOpen` state lives in PARENT** - Parent controls when dialog opens/closes
2. **Form state lives IN DIALOG** - Dialog owns its own form data
3. **Business logic in PARENT** - Parent handles API calls, navigation, etc.
4. **Use callbacks** - Dialog calls parent function with form data

---

## State Ownership

### What the Parent Owns

```typescript
// Parent.svelte
<script lang="ts">
let isDialogOpen = $state(false); // ✓ Parent owns isOpen
let user: User | null = $state(null); // ✓ Parent owns data

// ✓ Parent owns business logic
async function handleUserUpdate(data: UpdateUserData) {
  try {
    await userService.updateUser(userId, data);
    isDialogOpen = false;
    showSuccessToast('User updated');
  } catch (error) {
    showErrorToast('Update failed');
  }
}
</script>

<Button onclick={() => isDialogOpen = true}>Edit User</Button>

<EditUserDialog
  bind:isOpen={isDialogOpen}
  user={user}
  onValidSubmit={handleUserUpdate}
/>
```

### What the Dialog Owns

```typescript
// EditUserDialog.svelte
<script lang="ts">
import { superForm } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userSchema } from '$lib/schema/userSchema';

interface EditUserDialogProps {
  isOpen: boolean;
  user: User;
  onValidSubmit: (data: UpdateUserData) => void;
}

const {
  isOpen = $bindable(),
  user,
  onValidSubmit
}: EditUserDialogProps = $props();

// ✓ Dialog owns form state
const form = superForm(
  defaults({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  }, zod(userSchema)),
  {
    onUpdate: ({ form }) => {
      if (!form.valid) return;
      onValidSubmit(form.data);
    }
  }
);

const { form: formData, enhance, reset } = form;

// ✓ Dialog owns cancel logic
function handleCancel() {
  isOpen = false;
  reset();
}
</script>
```

---

## Dialog Patterns

### Basic Dialog

```typescript
// MyDialog.svelte
<script lang="ts">
import * as Dialog from '$lib/components/ui/dialog';
import { Button } from '$lib/components/ui/button';

interface MyDialogProps {
  isOpen: boolean;
}

const { isOpen = $bindable() }: MyDialogProps = $props();
</script>

<Dialog.Root bind:open={isOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Dialog Title</Dialog.Title>
      <Dialog.Description>
        Dialog description text here.
      </Dialog.Description>
    </Dialog.Header>

    <div>
      <!-- Dialog content -->
    </div>

    <Dialog.Footer>
      <Button onclick={() => isOpen = false}>Close</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

### Dialog with Form

```typescript
// EditUserDialog.svelte
<script lang="ts">
import { superForm } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userSchema } from '$lib/schema/userSchema';
import * as Dialog from '$lib/components/ui/dialog';
import * as Form from '$lib/components/ui/form';
import { Input } from '$lib/components/ui/input';
import { Button } from '$lib/components/ui/button';

interface EditUserDialogProps {
  isOpen: boolean;
  user: User;
  onValidSubmit: (data: UpdateUserData) => void;
}

const { isOpen = $bindable(), user, onValidSubmit }: EditUserDialogProps = $props();

const form = superForm(
  defaults({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  }, zod(userSchema)),
  {
    onUpdate: ({ form }) => {
      if (!form.valid) return;
      onValidSubmit(form.data);
    }
  }
);

const { form: formData, enhance, reset } = form;

function handleCancel() {
  isOpen = false;
  reset();
}

// Reset form when dialog opens/closes
function handleOpenChange(open: boolean) {
  if (!open) {
    reset();
  }
}
</script>

<Dialog.Root bind:open={isOpen} onOpenChange={handleOpenChange}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Edit User</Dialog.Title>
      <Dialog.Description>
        Update user information below.
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" use:enhance class="space-y-4">
      <Form.Field {form} name="firstName">
        <Form.Control let:attrs>
          <Form.Label>First Name</Form.Label>
          <Input {...attrs} bind:value={$formData.firstName} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="lastName">
        <Form.Control let:attrs>
          <Form.Label>Last Name</Form.Label>
          <Input {...attrs} bind:value={$formData.lastName} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="email">
        <Form.Control let:attrs>
          <Form.Label>Email</Form.Label>
          <Input {...attrs} type="email" bind:value={$formData.email} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Dialog.Footer>
        <Button type="button" variant="outline" onclick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
```

### Dialog with Loading State

```typescript
// DeleteUserDialog.svelte
<script lang="ts">
import * as Dialog from '$lib/components/ui/dialog';
import { Button } from '$lib/components/ui/button';

interface DeleteUserDialogProps {
  isOpen: boolean;
  userName: string;
  onConfirm: () => Promise<void>;
}

const { isOpen = $bindable(), userName, onConfirm }: DeleteUserDialogProps = $props();

let isDeleting = $state(false);

async function handleConfirm() {
  isDeleting = true;
  try {
    await onConfirm();
    isOpen = false;
  } finally {
    isDeleting = false;
  }
}
</script>

<Dialog.Root bind:open={isOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Delete User</Dialog.Title>
      <Dialog.Description>
        Are you sure you want to delete {userName}? This action cannot be undone.
      </Dialog.Description>
    </Dialog.Header>

    <Dialog.Footer>
      <Button
        variant="outline"
        onclick={() => isOpen = false}
        disabled={isDeleting}
      >
        Cancel
      </Button>
      <Button
        variant="destructive"
        onclick={handleConfirm}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

---

## Drawer Patterns

Drawers follow the same patterns as dialogs, just using the Drawer component:

```typescript
// UserDetailsDrawer.svelte
<script lang="ts">
import * as Drawer from '$lib/components/ui/drawer';
import { Button } from '$lib/components/ui/button';

interface UserDetailsDrawerProps {
  isOpen: boolean;
  user: User;
}

const { isOpen = $bindable(), user }: UserDetailsDrawerProps = $props();
</script>

<Drawer.Root bind:open={isOpen}>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>{user.firstName} {user.lastName}</Drawer.Title>
      <Drawer.Description>User Details</Drawer.Description>
    </Drawer.Header>

    <div class="p-4 space-y-4">
      <div>
        <p class="font-semibold">Email</p>
        <p>{user.email}</p>
      </div>

      <div>
        <p class="font-semibold">Role</p>
        <p>{user.role}</p>
      </div>
    </div>

    <Drawer.Footer>
      <Button onclick={() => isOpen = false}>Close</Button>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
```

---

## Callback Patterns

### Simple Callback

```typescript
// Dialog
interface MyDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
}

// Parent
function handleConfirm() {
  console.log('Confirmed!');
  isDialogOpen = false;
}

<MyDialog bind:isOpen={isDialogOpen} onConfirm={handleConfirm} />
```

### Callback with Data

```typescript
// Dialog
interface EditUserDialogProps {
	isOpen: boolean;
	onValidSubmit: (data: UpdateUserData) => void;
}

const { onValidSubmit }: EditUserDialogProps = $props();

const form = superForm(defaults(zod(userSchema)), {
	onUpdate: ({ form }) => {
		if (!form.valid) return;
		onValidSubmit(form.data); // Pass data to parent
	}
});

// Parent
async function handleUserUpdate(data: UpdateUserData) {
	await userService.updateUser(userId, data);
	isDialogOpen = false;
}
```

### Async Callback

```typescript
// Dialog
interface DeleteDialogProps {
	isOpen: boolean;
	onConfirm: () => Promise<void>;
}

const { onConfirm }: DeleteDialogProps = $props();

let isDeleting = $state(false);

async function handleConfirm() {
	isDeleting = true;
	try {
		await onConfirm(); // Await async callback
		isOpen = false;
	} catch (error) {
		console.error('Delete failed:', error);
	} finally {
		isDeleting = false;
	}
}

// Parent
async function handleDelete() {
	await userService.deleteUser(userId);
	showSuccessToast('User deleted');
}
```

---

## Multiple Dialogs

### Parent with Multiple Dialogs

```typescript
// Parent.svelte
<script lang="ts">
import EditUserDialog from './EditUserDialog.svelte';
import DeleteUserDialog from './DeleteUserDialog.svelte';

let isEditDialogOpen = $state(false);
let isDeleteDialogOpen = $state(false);
let selectedUser: User | null = $state(null);

function openEditDialog(user: User) {
  selectedUser = user;
  isEditDialogOpen = true;
}

function openDeleteDialog(user: User) {
  selectedUser = user;
  isDeleteDialogOpen = true;
}
</script>

<div>
  {#each users as user (user.id)}
    <div>
      <span>{user.firstName} {user.lastName}</span>
      <Button onclick={() => openEditDialog(user)}>Edit</Button>
      <Button onclick={() => openDeleteDialog(user)}>Delete</Button>
    </div>
  {/each}
</div>

{#if selectedUser}
  <EditUserDialog
    bind:isOpen={isEditDialogOpen}
    user={selectedUser}
    onValidSubmit={handleUserUpdate}
  />

  <DeleteUserDialog
    bind:isOpen={isDeleteDialogOpen}
    userName={selectedUser.firstName}
    onConfirm={() => handleDelete(selectedUser.id)}
  />
{/if}
```

---

## Dialog Close Behavior

### Close on Success Only

```typescript
// Dialog
const form = superForm(defaults(zod(schema)), {
	onUpdate: ({ form }) => {
		if (!form.valid) return;
		onValidSubmit(form.data);
		// Don't close here - let parent decide
	}
});

// Parent
async function handleSubmit(data: FormData) {
	try {
		await service.update(data);
		isDialogOpen = false; // ✓ Close on success
	} catch (error) {
		// ✗ Don't close on error, let user retry
		showErrorToast('Update failed');
	}
}
```

### Reset Form on Close

```typescript
function handleOpenChange(open: boolean) {
  if (!open) {
    reset(); // Reset form when dialog closes
  }
}

<Dialog.Root bind:open={isOpen} onOpenChange={handleOpenChange}>
```

### Close with ESC Key

```typescript
// Default behavior - ESC closes dialog
<Dialog.Root bind:open={isOpen}>

// Prevent closing with ESC if needed
<Dialog.Root
  bind:open={isOpen}
  onOpenChange={(open) => {
    if (!open && hasUnsavedChanges) {
      // Confirm before closing
      if (confirm('Discard changes?')) {
        isOpen = false;
      }
    } else {
      isOpen = open;
    }
  }}
>
```

---

## Confirmation Dialogs

### Simple Confirmation

```typescript
// ConfirmDialog.svelte
<script lang="ts">
import * as Dialog from '$lib/components/ui/dialog';
import { Button } from '$lib/components/ui/button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

const {
  isOpen = $bindable(),
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm
}: ConfirmDialogProps = $props();

function handleConfirm() {
  onConfirm();
  isOpen = false;
}
</script>

<Dialog.Root bind:open={isOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Description>{message}</Dialog.Description>
    </Dialog.Header>

    <Dialog.Footer>
      <Button variant="outline" onclick={() => isOpen = false}>
        {cancelLabel}
      </Button>
      <Button onclick={handleConfirm}>
        {confirmLabel}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

### Usage

```typescript
<script lang="ts">
import ConfirmDialog from './ConfirmDialog.svelte';

let isConfirmOpen = $state(false);

function handleDelete() {
  console.log('Deleting...');
}
</script>

<Button onclick={() => isConfirmOpen = true}>Delete</Button>

<ConfirmDialog
  bind:isOpen={isConfirmOpen}
  title="Delete User"
  message="Are you sure you want to delete this user? This action cannot be undone."
  confirmLabel="Delete"
  cancelLabel="Cancel"
  onConfirm={handleDelete}
/>
```

---

## Anti-Patterns

### ❌ Business Logic in Dialog

```typescript
// ✗ WRONG - API call in dialog
const form = superForm(defaults(zod(schema)), {
	onUpdate: async ({ form }) => {
		if (!form.valid) return;

		// Don't do this!
		await userService.updateUser(userId, form.data);
		isOpen = false;
	}
});

// ✓ CORRECT - Callback to parent
interface MyDialogProps {
	onValidSubmit: (data: FormData) => void;
}

const form = superForm(defaults(zod(schema)), {
	onUpdate: ({ form }) => {
		if (!form.valid) return;
		onValidSubmit(form.data); // Parent handles API
	}
});
```

### ❌ isOpen State in Dialog

```typescript
// ✗ WRONG - Dialog owns isOpen
let isOpen = $state(false);

// ✓ CORRECT - Parent owns isOpen
interface MyDialogProps {
	isOpen: boolean;
}
const { isOpen = $bindable() }: MyDialogProps = $props();
```

### ❌ Not Resetting Form

```typescript
// ✗ WRONG - Form keeps old values
<Dialog.Root bind:open={isOpen}>

// ✓ CORRECT - Reset on close
function handleOpenChange(open: boolean) {
  if (!open) reset();
}

<Dialog.Root bind:open={isOpen} onOpenChange={handleOpenChange}>
```

### ❌ Closing Dialog in Dialog

```typescript
// ✗ WRONG - Dialog closes itself
async function handleSubmit() {
	await userService.update(data);
	isOpen = false; // Don't do this
}

// ✓ CORRECT - Parent decides when to close
// Dialog just calls callback
onValidSubmit(form.data);

// Parent closes after success
async function handleSubmit(data) {
	await userService.update(data);
	isDialogOpen = false; // Parent controls
}
```

---

## Checklist

Before submitting dialog/popup code:

- [ ] `isOpen` state in parent component
- [ ] Form state in dialog component
- [ ] Business logic in parent component
- [ ] Callback pattern for data submission
- [ ] Form reset on dialog close
- [ ] Loading state during async operations
- [ ] Error handling in parent
- [ ] `$bindable()` on isOpen prop

---

**Remember**: Dialogs are just UI. They show forms and content, but the parent component owns the lifecycle and business logic.
