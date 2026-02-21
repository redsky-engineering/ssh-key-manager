# Component Structure & Ordering

This document defines the strict ordering and structure for Svelte 5 components.

---

## Component Section Order

Components MUST follow this exact ordering:

```typescript
<script lang="ts">
// ==========================================
// SECTION 1: IMPORTS
// ==========================================
import * as Carousel from '$lib/components/ui/carousel/index.js';
import type { CarouselAPI } from '$lib/components/ui/carousel/context.js';
import Button from '$lib/components/ui/button/button.svelte';
import { userService } from '$lib/services';

// ==========================================
// SECTION 2: LOCAL TYPES/INTERFACES (optional)
// ==========================================
type Days = string[];

interface ProductVariant {
  id: number;
  name: string;
  price: number;
}

// ==========================================
// SECTION 3: PROPS
// ==========================================
interface MyComponentProps {
  value: number | null;
  onUpdate: () => void;
  items?: string[]; // Optional props
}

const { value, onUpdate, items = [] }: MyComponentProps = $props();

// ==========================================
// SECTION 4: CONSTANTS (if used across file or globally)
// ==========================================
const US_STATES = ["MN", "UT", "CO", "CA", "NY"];
const MAX_RETRIES = 3;

// ==========================================
// SECTION 5: STATE & DERIVED
// ==========================================
// Group related state together
let userName = $state("john");
let userAge = $state(10);
let userEmail = $state("");

let productName = $state("");
let productPrice = $state(0);

// Derived values - AFTER all $state declarations
let userAgeDoubled = $derived(userAge * 2);
let userAgeQuadratic = $derived.by(() => {
  return Math.pow(userAge, 4);
});

// ==========================================
// SECTION 6: LIFECYCLE
// ==========================================
onMount(() => {
  fetchSomething();
});

onDestroy(() => {
  // cleanup
});

// ==========================================
// SECTION 7: EFFECTS
// ==========================================
$effect(() => {
  console.log('User age changed:', userAge);
});

// ==========================================
// SECTION 8: FUNCTIONS
// ==========================================
// Public event handlers first
async function onSubmit() {
  const result = await fetchSomething();
  console.log(result);
}

function onCancel() {
  userName = "";
}

// Private helper functions at the end
function _validateForm() {
  // Helper logic
}

async function fetchSomething() {
  // API call
}
</script>

<div>
  <!-- Template content -->
</div>
```

---

## Section Rules

### 1. Imports

All import statements grouped at the top:

```typescript
// ✓ CORRECT - Organized imports
import { onMount, onDestroy } from 'svelte';
import { userService } from '$lib/services';
import Button from '$lib/components/ui/button/button.svelte';
import type { User } from '$lib/types/User';

// ✗ WRONG - Mixed imports throughout file
import Button from '$lib/components/ui/button/button.svelte';
// ... some code ...
import { userService } from '$lib/services'; // Don't do this
```

### 2. Local Types (Optional)

Types/interfaces used ONLY in this component:

```typescript
// ✓ CORRECT - Local types before props
type Days = string[];

interface FormData {
	email: string;
	password: string;
}

// ✗ WRONG - Don't define types after props or state
const { value }: MyComponentProps = $props();
type Days = string[]; // Too late!
```

### 3. Props

**Always define props interface inline** and prefix with component name:

```typescript
// ✓ CORRECT - Props with interface
interface UserCardProps {
  firstName: string;
  lastName: string;
  email: string;
  onUpdate?: () => void; // Optional
}

const { firstName, lastName, email, onUpdate }: UserCardProps = $props();

// ✓ CORRECT - Destructure with defaults for optional props
const { value = 0, items = [] }: MyComponentProps = $props();

// ✗ WRONG - NO export let (Svelte 4 syntax)
export let firstName: string;
export let lastName: string;

// ✗ WRONG - Generic interface name
interface Props { ... }
```

### 4. Constants

**UPPERCASE_SNAKE_CASE** for module/global constants:

```typescript
// ✓ CORRECT - Global constants
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRIES = 3;
const TIMEOUT_MS = 5000;

// ✓ CORRECT - camelCase for values imported from elsewhere
const maxRetries = import.meta.env.VITE_MAX_RETRIES;
```

### 5. State & Derived

**State first, then derived:**

```typescript
// ✓ CORRECT - All state, then all derived
let userName = $state('john');
let userAge = $state(10);
let userEmail = $state('');

let fullName = $derived(`${userName}`);
let ageDoubled = $derived(userAge * 2);

// ✗ WRONG - Don't mix state and derived
let userName = $state('john');
let fullName = $derived(`${userName}`);
let userAge = $state(10); // Don't declare state after derived
```

#### State Grouping

Group related state together:

```typescript
// ✓ CORRECT - Option A: Grouped by feature
let userName = $state('john');
let userAge = $state(10);
let userEmail = $state('');

let productName = $state('');
let productPrice = $state(0);

// ✓ ALSO CORRECT - Simple alphabetical if no clear grouping
let productName = $state('');
let productPrice = $state(0);
let userAge = $state(10);
let userEmail = $state('');
let userName = $state('john');
```

### 6. Lifecycle

All lifecycle functions together:

```typescript
// ✓ CORRECT
onMount(() => {
  fetchUsers();
});

onDestroy(() => {
  cleanup();
});

// ✗ WRONG - Don't mix lifecycle with other functions
function onClick() { ... }
onMount(() => { ... }); // Don't do this
function onSubmit() { ... }
```

### 7. Effects

All `$effect` declarations:

```typescript
// ✓ CORRECT
$effect(() => {
  console.log('User changed:', userName);
});

$effect(() => {
  if (isActive) {
    startPolling();
  }
});

// ✗ WRONG - NO $: reactive statements (Svelte 4 syntax)
$: console.log(userName); // Don't use this
$: if (isActive) { ... } // Use $effect instead
```

### 8. Functions

Event handlers first, then helper functions:

```typescript
// ✓ CORRECT - Public event handlers first
async function onSubmit() {
  const isValid = _validateForm();
  if (!isValid) return;

  await saveData();
}

function onCancel() {
  resetForm();
}

// Private/helper functions at the end
function _validateForm() {
  return userName.length > 0;
}

async function saveData() {
  await userService.updateUser(...);
}

// ✗ WRONG - Don't use const for functions
const onSubmit = async () => { ... }; // Use function declaration

// ✗ WRONG - Don't use "handle" prefix
function handleSubmit() { ... }; // Use onSubmit instead
```

---

## Complete Example

```typescript
<script lang="ts">
// SECTION 1: IMPORTS
import { onMount } from 'svelte';
import { userService } from '$lib/services';
import Button from '$lib/components/ui/button/button.svelte';
import Input from '$lib/components/ui/input/input.svelte';
import type { User } from '$lib/types/User';

// SECTION 2: LOCAL TYPES
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

// SECTION 3: PROPS
interface UserProfileProps {
  userId: number;
  onUpdate?: () => void;
}

const { userId, onUpdate }: UserProfileProps = $props();

// SECTION 4: CONSTANTS
const FIELD_MAX_LENGTH = 100;

// SECTION 5: STATE & DERIVED
let user: User | null = $state(null);
let isLoading = $state(false);
let isEditing = $state(false);

let firstName = $state("");
let lastName = $state("");
let email = $state("");

let fullName = $derived(`${firstName} ${lastName}`);
let isFormValid = $derived(
  firstName.length > 0 &&
  lastName.length > 0 &&
  email.includes('@')
);

// SECTION 6: LIFECYCLE
onMount(() => {
  loadUser();
});

// SECTION 7: EFFECTS
$effect(() => {
  if (user) {
    firstName = user.firstName;
    lastName = user.lastName;
    email = user.email;
  }
});

// SECTION 8: FUNCTIONS
async function loadUser() {
  isLoading = true;
  try {
    user = await userService.getUser(userId);
  } catch (error) {
    console.error('Failed to load user:', error);
  } finally {
    isLoading = false;
  }
}

async function onSubmit() {
  if (!isFormValid) return;

  try {
    await userService.updateUser(userId, {
      firstName,
      lastName,
      email
    });
    isEditing = false;
    onUpdate?.();
  } catch (error) {
    console.error('Failed to update user:', error);
  }
}

function onCancel() {
  isEditing = false;
  if (user) {
    firstName = user.firstName;
    lastName = user.lastName;
    email = user.email;
  }
}
</script>

{#if isLoading}
  <div>Loading...</div>
{:else if user}
  <div class="space-y-4">
    {#if isEditing}
      <Input bind:value={firstName} placeholder="First Name" maxlength={FIELD_MAX_LENGTH} />
      <Input bind:value={lastName} placeholder="Last Name" maxlength={FIELD_MAX_LENGTH} />
      <Input bind:value={email} type="email" placeholder="Email" />

      <div class="flex gap-2">
        <Button onclick={onCancel}>Cancel</Button>
        <Button onclick={onSubmit} disabled={!isFormValid}>Save</Button>
      </div>
    {:else}
      <div>
        <h2>{fullName}</h2>
        <p>{email}</p>
      </div>

      <Button onclick={() => isEditing = true}>Edit</Button>
    {/if}
  </div>
{/if}
```

---

## Important Notes

### NO Svelte 4 Syntax

```typescript
// ✗ WRONG - Svelte 4 (deprecated)
export let value: number;
$: doubled = value * 2;

// ✓ CORRECT - Svelte 5
interface MyComponentProps {
	value: number;
}
const { value }: MyComponentProps = $props();
let doubled = $derived(value * 2);
```

### Type Annotations

```typescript
// ✓ CORRECT - Colon notation
let users: User[] = $state([]);
let count: number = $state(0);

// ✗ WRONG - Generic notation
let users = $state<User[]>([]);
```

### Keyed `{#each}` Loops

**ALWAYS provide a unique key** on `{#each}` blocks. This ensures Svelte can efficiently track, reorder, and update DOM elements.

```svelte
<!-- ✓ CORRECT - Keyed by unique identifier -->
{#each users as user (user.id)}
	<UserCard {user} />
{/each}

<!-- ✓ CORRECT - Key works with index variable too -->
{#each shipments as shipment, shipmentIndex (shipment.id)}
	<p>Shipment {shipmentIndex + 1}</p>
{/each}

<!-- ✓ CORRECT - Primitive arrays can use the value itself -->
{#each tags as tag (tag)}
	<span>{tag}</span>
{/each}

<!-- ✗ WRONG - Missing key -->
{#each users as user}
	<UserCard {user} />
{/each}
```

**Key selection priority:**

1. `id` field (most common)
2. Another unique identifier (`orderItemId`, `slug`, `sku`, etc.)
3. The value itself (for primitive arrays like `string[]` or `number[]`)

### Comments

Avoid section divider comments in production code:

```typescript
// ✗ AVOID in production - Only use for documentation
// ==========================================
// SECTION 1: IMPORTS
// ==========================================

// ✓ CORRECT - Clean code
import { onMount } from 'svelte';
import Button from '$lib/components/ui/button/button.svelte';
```

Comments should only explain **complex logic**, not **structure**.

---

## Quick Checklist

Before submitting component code:

- [ ] Sections in correct order (Imports → Types → Props → Constants → State → Lifecycle → Effects → Functions)
- [ ] Props interface named `{Component}Props`
- [ ] NO `export let` (use `$props()`)
- [ ] NO `$:` reactive statements (use `$derived` or `$effect`)
- [ ] Type annotations use colon notation
- [ ] State grouped logically
- [ ] All derived after all state
- [ ] Event handlers before helper functions
- [ ] Functions use `function` declaration (not `const`)
- [ ] Event handlers use `on` prefix (not `handle`)
- [ ] All `{#each}` blocks have a unique key expression

---

**Remember**: Strict ordering makes components predictable and easier to navigate. Always follow this structure.
