# Forms & Validation

This document defines patterns for forms, Zod validation schemas, and Superforms integration.

---

## Core Principles

1. **All form schemas use Zod** - Defined in `src/schema/`
2. **Superforms for form state** - Handles validation, errors, submission
3. **Forms in dialogs** - Form state lives IN the dialog, business logic in parent
4. **Validation on submit** - Don't validate on every keystroke unless needed

---

## Zod Schemas

### Location

All schemas live in `src/schema/`:

```
schema/
├── loginSchema.ts
├── userSchema.ts
├── productSchema.ts
└── checkoutSchema.ts
```

### Schema File Structure

**schema/loginSchema.ts:**

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
	email: z.email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters')
});

export type LoginSchema = typeof loginSchema;
```

### Common Validation Patterns

```typescript
import { z } from 'zod';

export const userSchema = z.object({
	// Required fields
	email: z.email('Invalid email address'),
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),

	// Optional fields
	middleName: z.string().optional(),
	phoneNumber: z.string().optional(),

	// Number validation
	age: z.number().min(18, 'Must be at least 18').max(120, 'Invalid age'),

	// Custom validation
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/[0-9]/, 'Password must contain at least one number'),

	// Enum validation
	role: z.enum(['admin', 'user', 'guest']),

	// Date validation
	birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),

	// Conditional validation
	agreeToTerms: z.boolean().refine((val) => val === true, 'You must agree to the terms')
});

export type UserSchema = typeof userSchema;
```

### Schema Composition

```typescript
// Base schema
const addressSchema = z.object({
	street: z.string().min(1, 'Street is required'),
	city: z.string().min(1, 'City is required'),
	state: z.string().length(2, 'State must be 2 characters'),
	zipCode: z.string().regex(/^\d{5}$/, 'Invalid zip code')
});

// Extend base schema
export const userWithAddressSchema = z.object({
	email: z.email(),
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	address: addressSchema
});

// Or use merge
export const userSchema = baseUserSchema.merge(addressSchema);
```

---

## Superforms Integration

### Basic Form Setup

```typescript
<script lang="ts">
import { superForm } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/schema/loginSchema';
import * as Form from '$lib/components/ui/form';
import { Input } from '$lib/components/ui/input';
import { Button } from '$lib/components/ui/button';

interface LoginFormProps {
  onValidSubmit: (data: z.infer<typeof loginSchema>) => void;
}

const { onValidSubmit }: LoginFormProps = $props();

const form = superForm(defaults(zod(loginSchema)), {
  onUpdate: ({ form }) => {
    if (!form.valid) return;
    onValidSubmit(form.data);
  }
});

const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="email">
    <Form.Control let:attrs>
      <Form.Label>Email</Form.Label>
      <Input
        {...attrs}
        bind:value={$formData.email}
        type="email"
        placeholder="you@example.com"
      />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="password">
    <Form.Control let:attrs>
      <Form.Label>Password</Form.Label>
      <Input
        {...attrs}
        bind:value={$formData.password}
        type="password"
      />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Button type="submit">Login</Button>
</form>
```

### Form with Loading State

```typescript
<script lang="ts">
import { superForm } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userSchema } from '$lib/schema/userSchema';

interface UserFormProps {
  onValidSubmit: (data: UserFormData) => Promise<void>;
}

const { onValidSubmit }: UserFormProps = $props();

let isSubmitting = $state(false);

const form = superForm(defaults(zod(userSchema)), {
  onUpdate: async ({ form }) => {
    if (!form.valid) return;

    isSubmitting = true;
    try {
      await onValidSubmit(form.data);
    } finally {
      isSubmitting = false;
    }
  }
});

const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
  <!-- Form fields -->

  <Button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Saving...' : 'Save'}
  </Button>
</form>
```

### Form with Default Values

```typescript
<script lang="ts">
import { superForm } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userSchema } from '$lib/schema/userSchema';
import type { User } from '$lib/types/User';

interface EditUserFormProps {
  user: User;
  onValidSubmit: (data: UserFormData) => void;
}

const { user, onValidSubmit }: EditUserFormProps = $props();

// Set default values from existing user
const form = superForm(
  defaults({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  }, zod(userSchema)),
  {
    onUpdate: ({ form }) => {
      if (!form.valid) return;
      onValidSubmit(form.data);
    }
  }
);

const { form: formData, enhance } = form;
</script>
```

---

## Form Field Patterns

### Text Input

```typescript
<Form.Field {form} name="firstName">
  <Form.Control let:attrs>
    <Form.Label>First Name</Form.Label>
    <Input {...attrs} bind:value={$formData.firstName} />
  </Form.Control>
  <Form.Description>Your legal first name</Form.Description>
  <Form.FieldErrors />
</Form.Field>
```

### Select/Dropdown

```typescript
<Form.Field {form} name="role">
  <Form.Control let:attrs>
    <Form.Label>Role</Form.Label>
    <Select.Root
      selected={{ value: $formData.role, label: $formData.role }}
      onSelectedChange={(v) => v && ($formData.role = v.value)}
    >
      <Select.Trigger {...attrs}>
        <Select.Value placeholder="Select a role" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="admin">Admin</Select.Item>
        <Select.Item value="user">User</Select.Item>
        <Select.Item value="guest">Guest</Select.Item>
      </Select.Content>
    </Select.Root>
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
```

### Checkbox

```typescript
<Form.Field {form} name="agreeToTerms" class="flex items-center gap-2">
  <Form.Control let:attrs>
    <Checkbox
      {...attrs}
      bind:checked={$formData.agreeToTerms}
    />
    <Form.Label class="font-normal">
      I agree to the terms and conditions
    </Form.Label>
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
```

### Textarea

```typescript
<Form.Field {form} name="description">
  <Form.Control let:attrs>
    <Form.Label>Description</Form.Label>
    <Textarea
      {...attrs}
      bind:value={$formData.description}
      rows={4}
    />
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
```

### Number Input

```typescript
<Form.Field {form} name="age">
  <Form.Control let:attrs>
    <Form.Label>Age</Form.Label>
    <Input
      {...attrs}
      type="number"
      bind:value={$formData.age}
      min="18"
      max="120"
    />
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
```

---

## Form Validation Patterns

### Client-Side Validation

Validation happens automatically on submit with Superforms:

```typescript
const form = superForm(defaults(zod(loginSchema)), {
	onUpdate: ({ form }) => {
		// form.valid is automatically set by Superforms
		if (!form.valid) {
			// Errors are shown automatically via Form.FieldErrors
			return;
		}

		// Only called if valid
		onValidSubmit(form.data);
	}
});
```

### Custom Validation

```typescript
// In schema
export const passwordSchema = z
	.object({
		password: z.string().min(8),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'] // Error shows on confirmPassword field
	});
```

### Async Validation

```typescript
export const emailSchema = z
	.object({
		email: z.email()
	})
	.refine(
		async (data) => {
			// Check if email is available
			const available = await checkEmailAvailability(data.email);
			return available;
		},
		{
			message: 'Email is already taken',
			path: ['email']
		}
	);
```

---

## Form Reset

### Manual Reset

```typescript
const { form: formData, enhance, reset } = form;

function handleCancel() {
	reset(); // Reset to initial values
}
```

### Reset After Successful Submit

```typescript
const form = superForm(defaults(zod(loginSchema)), {
	onUpdate: async ({ form }) => {
		if (!form.valid) return;

		await onValidSubmit(form.data);
		reset(); // Clear form after success
	}
});
```

---

## Form in Dialog Pattern

### Dialog Component

```typescript
// ChangeEmailDialog.svelte
<script lang="ts">
import { superForm } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { changeEmailSchema } from '$lib/schema/changeEmailSchema';
import * as Dialog from '$lib/components/ui/dialog';
import * as Form from '$lib/components/ui/form';
import { Input } from '$lib/components/ui/input';
import { Button } from '$lib/components/ui/button';

interface ChangeEmailDialogProps {
  isOpen: boolean;
  onValidSubmit: (data: ChangeEmailData) => void;
}

const { isOpen = $bindable(), onValidSubmit }: ChangeEmailDialogProps = $props();

const form = superForm(defaults(zod(changeEmailSchema)), {
  onUpdate: ({ form }) => {
    if (!form.valid) return;
    onValidSubmit(form.data);
  }
});

const { form: formData, enhance, reset } = form;

function handleCancel() {
  isOpen = false;
  reset();
}

function handleOpenChange(open: boolean) {
  if (!open) {
    reset();
  }
}
</script>

<Dialog.Root bind:open={isOpen} onOpenChange={handleOpenChange}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Change Email</Dialog.Title>
      <Dialog.Description>
        Enter your new email address below.
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" use:enhance>
      <Form.Field {form} name="email">
        <Form.Control let:attrs>
          <Form.Label>New Email</Form.Label>
          <Input
            {...attrs}
            type="email"
            bind:value={$formData.email}
            placeholder="you@example.com"
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Dialog.Footer>
        <Button type="button" variant="outline" onclick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
```

### Parent Component

```typescript
// Parent.svelte
<script lang="ts">
import { userService } from '$lib/services';
import ChangeEmailDialog from '$lib/components/custom/dialog/changeEmailDialog/ChangeEmailDialog.svelte';

let isDialogOpen = $state(false);

async function handleEmailChange(data: ChangeEmailData) {
  try {
    await userService.updateEmail(data.email);
    isDialogOpen = false; // Close dialog on success
    showSuccessToast('Email updated successfully');
  } catch (error) {
    showErrorToast('Failed to update email');
  }
}
</script>

<Button onclick={() => isDialogOpen = true}>
  Change Email
</Button>

<ChangeEmailDialog
  bind:isOpen={isDialogOpen}
  onValidSubmit={handleEmailChange}
/>
```

---

## Common Patterns

### Multi-Step Form

```typescript
<script lang="ts">
let currentStep = $state(1);
const TOTAL_STEPS = 3;

const form = superForm(defaults(zod(checkoutSchema)), {
  onUpdate: ({ form }) => {
    if (!form.valid) return;

    if (currentStep < TOTAL_STEPS) {
      currentStep++;
    } else {
      onValidSubmit(form.data);
    }
  }
});

function goBack() {
  if (currentStep > 1) {
    currentStep--;
  }
}
</script>

<form method="POST" use:enhance>
  {#if currentStep === 1}
    <!-- Step 1 fields -->
  {:else if currentStep === 2}
    <!-- Step 2 fields -->
  {:else}
    <!-- Step 3 fields -->
  {/if}

  <div class="flex gap-2">
    {#if currentStep > 1}
      <Button type="button" onclick={goBack}>Back</Button>
    {/if}

    <Button type="submit">
      {currentStep < TOTAL_STEPS ? 'Next' : 'Submit'}
    </Button>
  </div>
</form>
```

### Form with File Upload

```typescript
<script lang="ts">
let selectedFile: File | null = $state(null);

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    selectedFile = input.files[0];
  }
}

async function onSubmit() {
  if (!selectedFile) return;

  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('userId', userId.toString());

  await userService.uploadAvatar(formData);
}
</script>

<form on:submit|preventDefault={onSubmit}>
  <input
    type="file"
    accept="image/*"
    on:change={handleFileSelect}
  />

  {#if selectedFile}
    <p>Selected: {selectedFile.name}</p>
  {/if}

  <Button type="submit" disabled={!selectedFile}>
    Upload
  </Button>
</form>
```

---

## Anti-Patterns

### ❌ Not Using Zod Schemas

```typescript
// ✗ WRONG - Manual validation
function validateForm() {
	if (!email.includes('@')) {
		errors.email = 'Invalid email';
	}
	if (password.length < 8) {
		errors.password = 'Too short';
	}
}

// ✓ CORRECT - Zod schema
export const loginSchema = z.object({
	email: z.email('Invalid email'),
	password: z.string().min(8, 'Password too short')
});
```

### ❌ Business Logic in Form Component

```typescript
// ✗ WRONG - API call in form component
const form = superForm(defaults(zod(loginSchema)), {
	onUpdate: async ({ form }) => {
		if (!form.valid) return;

		// Don't do this!
		await userService.updateEmail(form.data.email);
	}
});

// ✓ CORRECT - Pass callback to parent
interface LoginFormProps {
	onValidSubmit: (data: LoginData) => void;
}

const { onValidSubmit }: LoginFormProps = $props();

const form = superForm(defaults(zod(loginSchema)), {
	onUpdate: ({ form }) => {
		if (!form.valid) return;
		onValidSubmit(form.data); // Parent handles API call
	}
});
```

### ❌ Not Resetting Form on Dialog Close

```typescript
// ✗ WRONG - Form keeps old values
<Dialog.Root bind:open={isOpen}>
  <!-- No reset on close -->
</Dialog.Root>

// ✓ CORRECT - Reset on close
function handleOpenChange(open: boolean) {
  if (!open) {
    reset();
  }
}

<Dialog.Root bind:open={isOpen} onOpenChange={handleOpenChange}>
```

---

## Checklist

Before submitting form code:

- [ ] Schema defined in `src/schema/`
- [ ] Superforms used for form state
- [ ] Validation errors shown via `Form.FieldErrors`
- [ ] Business logic in parent component
- [ ] Form reset on dialog close
- [ ] Loading state during submission
- [ ] Error handling for API calls
- [ ] Proper field types (email, password, number)

---

**Remember**: Forms are just UI. Keep them simple, let Zod handle validation, and let the parent handle business logic.
