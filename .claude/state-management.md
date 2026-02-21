# State Management

This document defines when and how to use local vs global state in Svelte 5 applications.

---

## Core Principle

**Prefer local state and props. Use global state sparingly.**

```
Local State (Default) → Props → await parent() → Global State (Last Resort)
```

---

## Local State

### When to Use

- Component-specific data
- UI state (isOpen, isLoading, isEditing)
- Form inputs
- Temporary values
- Anything that doesn't need to be shared

### Type Annotations for State

**IMPORTANT**: Always use colon notation for type annotations on `$state`. Never use generic notation.

```typescript
// ✓ CORRECT - Colon notation
let users: User[] = $state([]);
let config: AppConfig | null = $state(null);
let mode: 'create' | 'edit' = $state('create');

// ✓ CORRECT - Inferred types when obvious
let count = $state(0);
let isOpen = $state(false);
let userName = $state('');

// ✗ WRONG - Generic notation (NEVER do this)
let users = $state<User[]>([]);
let config = $state<AppConfig | null>(null);
let mode = $state<'create' | 'edit'>('create');
```

### Pattern

```typescript
<script lang="ts">
// ✓ CORRECT - Local state for component-specific data
let userName = $state("");
let userAge = $state(0);
let isEditing = $state(false);
let isLoading = $state(false);

// Derived state
let isFormValid = $derived(userName.length > 0 && userAge >= 18);
</script>
```

### Example - Simple Counter

```typescript
<script lang="ts">
let count = $state(0);

function increment() {
  count++;
}

function decrement() {
  count--;
}
</script>

<div>
  <button onclick={decrement}>-</button>
  <span>{count}</span>
  <button onclick={increment}>+</button>
</div>
```

---

## Passing State via Props

### When to Use

- Child component needs parent's data
- Parent controls child's state
- Sharing data between siblings via parent

### Pattern - Pass Data Down

```typescript
// Parent.svelte
<script lang="ts">
import UserCard from './UserCard.svelte';

let user = $state({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com"
});

function handleUpdate() {
  // Update user
}
</script>

<UserCard {user} {handleUpdate} />

// UserCard.svelte
<script lang="ts">
import type { User } from '$lib/types/User';

interface UserCardProps {
  user: User;
  handleUpdate: () => void;
}

const { user, handleUpdate }: UserCardProps = $props();
</script>

<div>
  <h2>{user.firstName} {user.lastName}</h2>
  <p>{user.email}</p>
  <button onclick={handleUpdate}>Update</button>
</div>
```

### Pattern - Two-Way Binding

```typescript
// Parent.svelte
<script lang="ts">
import SearchInput from './SearchInput.svelte';

let searchQuery = $state("");
</script>

<SearchInput bind:value={searchQuery} />
<p>Searching for: {searchQuery}</p>

// SearchInput.svelte
<script lang="ts">
interface SearchInputProps {
  value: string;
}

const { value = $bindable() }: SearchInputProps = $props();
</script>

<input bind:value type="text" placeholder="Search..." />
```

---

## Passing State via await parent()

### When to Use

- Loading data in nested routes
- Sharing layout data with child pages
- Parent layout loads data once, children reuse it

### Pattern

```typescript
// routes/+layout.server.ts
export async function load() {
  const user = await userService.getUserMe();

  return {
    user
  };
}

// routes/dashboard/+page.server.ts
export async function load({ parent }) {
  const { user } = await parent(); // Get user from parent layout

  const dashboardData = await dashboardService.getData(user.id);

  return {
    user, // Pass user down
    dashboardData
  };
}

// routes/dashboard/+page.svelte
<script lang="ts">
import type { PageData } from './$types';

const { data }: { data: PageData } = $props();

const { user, dashboardData } = data;
</script>

<h1>Welcome, {user.firstName}!</h1>
```

---

## Global State

### When to Use (ONLY)

- User authentication state
- App theme (light/dark mode)
- User preferences
- Shopping cart
- Toast notifications
- Real-time data (WebSocket)

### When NOT to Use

- Component-specific state
- Form data
- Temporary UI state
- Data that can be passed via props
- Route-specific data

### Pattern - Svelte 5 Stores

**lib/stores/user.svelte.ts:**

```typescript
import type { User } from '$lib/types/User';

let currentUser: User | null = $state(null);

export function setUser(user: User) {
	currentUser = user;
}

export function getUser() {
	return currentUser;
}

export function clearUser() {
	currentUser = null;
}

// Derived state
export function isAuthenticated() {
	return currentUser !== null;
}

export function getUserRole() {
	return currentUser?.role ?? 'guest';
}
```

**Usage:**

```typescript
<script lang="ts">
import { getUser, setUser } from '$lib/stores/user.svelte';
import { userService } from '$lib/services';

const user = getUser();

async function loadUser() {
  const userData = await userService.getUserMe();
  setUser(userData);
}
</script>

{#if user}
  <p>Welcome, {user.firstName}!</p>
{:else}
  <button onclick={loadUser}>Login</button>
{/if}
```

---

## Global State Examples

### User Authentication Store

```typescript
// lib/stores/auth.svelte.ts
import type { User } from '$lib/types/User';

let currentUser: User | null = $state(null);
let isLoading = $state(false);
let error: string | null = $state(null);

export function getAuth() {
	return {
		user: currentUser,
		isLoading,
		error,
		isAuthenticated: currentUser !== null
	};
}

export function setUser(user: User) {
	currentUser = user;
	error = null;
}

export async function login(email: string, password: string) {
	isLoading = true;
	error = null;

	try {
		const user = await userService.login(email, password);
		currentUser = user;
	} catch (err) {
		error = 'Login failed';
		throw err;
	} finally {
		isLoading = false;
	}
}

export function logout() {
	currentUser = null;
}
```

### Theme Store

```typescript
// lib/stores/theme.svelte.ts
type Theme = 'light' | 'dark' | 'system';

let currentTheme: Theme = $state('system');

export function getTheme() {
	return currentTheme;
}

export function setTheme(theme: Theme) {
	currentTheme = theme;

	// Update DOM
	if (typeof document !== 'undefined') {
		document.documentElement.classList.remove('light', 'dark');

		if (theme === 'system') {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
		} else {
			document.documentElement.classList.add(theme);
		}
	}
}

// Initialize from localStorage
if (typeof window !== 'undefined') {
	const savedTheme = localStorage.getItem('theme') as Theme | null;
	if (savedTheme) {
		setTheme(savedTheme);
	}
}
```

### Toast Store

```typescript
// lib/stores/toast.svelte.ts
interface Toast {
	id: string;
	message: string;
	type: 'success' | 'error' | 'info' | 'warning';
	duration?: number;
}

let toasts: Toast[] = $state([]);

export function getToasts() {
	return toasts;
}

export function showToast(message: string, type: Toast['type'] = 'info', duration: number = 3000) {
	const id = crypto.randomUUID();
	const toast: Toast = { id, message, type, duration };

	toasts = [...toasts, toast];

	if (duration > 0) {
		setTimeout(() => {
			removeToast(id);
		}, duration);
	}
}

export function removeToast(id: string) {
	toasts = toasts.filter((t) => t.id !== id);
}

// Helper functions
export function showSuccess(message: string) {
	showToast(message, 'success');
}

export function showError(message: string) {
	showToast(message, 'error');
}

export function showInfo(message: string) {
	showToast(message, 'info');
}
```

### Shopping Cart Store

```typescript
// lib/stores/cart.svelte.ts
import type { Product } from '$lib/types/Product';

interface CartItem {
	product: Product;
	quantity: number;
}

let items: CartItem[] = $state([]);

export function getCart() {
	return {
		items,
		itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
		totalPrice: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
	};
}

export function addToCart(product: Product, quantity: number = 1) {
	const existingItem = items.find((item) => item.product.id === product.id);

	if (existingItem) {
		existingItem.quantity += quantity;
		items = [...items]; // Trigger reactivity
	} else {
		items = [...items, { product, quantity }];
	}
}

export function removeFromCart(productId: number) {
	items = items.filter((item) => item.product.id !== productId);
}

export function updateQuantity(productId: number, quantity: number) {
	const item = items.find((item) => item.product.id === productId);
	if (item) {
		item.quantity = quantity;
		items = [...items];
	}
}

export function clearCart() {
	items = [];
}
```

---

## State Persistence

### localStorage Pattern

```typescript
// lib/stores/preferences.svelte.ts
interface UserPreferences {
	fontSize: number;
	sidebarCollapsed: boolean;
	language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
	fontSize: 16,
	sidebarCollapsed: false,
	language: 'en'
};

// Load from localStorage
function loadPreferences(): UserPreferences {
	if (typeof window === 'undefined') return DEFAULT_PREFERENCES;

	const saved = localStorage.getItem('userPreferences');
	return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
}

let preferences: UserPreferences = $state(loadPreferences());

export function getPreferences() {
	return preferences;
}

export function updatePreferences(updates: Partial<UserPreferences>) {
	preferences = { ...preferences, ...updates };

	// Save to localStorage
	if (typeof window !== 'undefined') {
		localStorage.setItem('userPreferences', JSON.stringify(preferences));
	}
}

export function resetPreferences() {
	preferences = DEFAULT_PREFERENCES;

	if (typeof window !== 'undefined') {
		localStorage.removeItem('userPreferences');
	}
}
```

---

## State Composition

### Combining Multiple Stores

```typescript
// lib/stores/app.svelte.ts
import { getAuth } from './auth.svelte';
import { getTheme } from './theme.svelte';
import { getCart } from './cart.svelte';

export function getAppState() {
	return {
		auth: getAuth(),
		theme: getTheme(),
		cart: getCart()
	};
}
```

**Usage:**

```typescript
<script lang="ts">
import { getAppState } from '$lib/stores/app.svelte';

const app = getAppState();
</script>

{#if app.auth.isAuthenticated}
  <p>Cart items: {app.cart.itemCount}</p>
{/if}
```

---

## State Updates

### Immutable Updates

```typescript
// ✓ CORRECT - Trigger reactivity with spread
let users = $state([user1, user2]);
users = [...users, newUser]; // Triggers reactivity

// ✓ CORRECT - Direct property assignment works in Svelte 5
let user = $state({ name: 'John' });
user.name = 'Jane'; // Triggers reactivity

// ✓ CORRECT - Array methods that return new arrays
users = users.filter((u) => u.id !== userId);
users = users.map((u) => (u.id === userId ? updatedUser : u));
```

### Batched Updates

```typescript
// Multiple updates in single function
function updateUser(id: number, changes: Partial<User>) {
	const user = users.find((u) => u.id === id);
	if (user) {
		user.firstName = changes.firstName ?? user.firstName;
		user.lastName = changes.lastName ?? user.lastName;
		user.email = changes.email ?? user.email;
		// All updates batched, UI updates once
	}
}
```

---

## Anti-Patterns

### ❌ Using Global State for Local Concerns

```typescript
// ✗ WRONG - Global state for dialog open/close
// lib/stores/dialogs.svelte.ts
let isEditDialogOpen = $state(false);

// ✓ CORRECT - Local state in parent component
// Parent.svelte
let isEditDialogOpen = $state(false);
```

### ❌ Not Using Props

```typescript
// ✗ WRONG - Global store for parent-child communication
// stores/selected.svelte.ts
let selectedUser = $state(null);

// Parent.svelte
setSelectedUser(user);

// Child.svelte
const user = getSelectedUser();

// ✓ CORRECT - Props
// Parent.svelte
<UserCard {user} />

// UserCard.svelte
const { user }: UserCardProps = $props();
```

### ❌ Mutating State Directly (Svelte 4 mindset)

```typescript
// Svelte 5 actually handles this correctly now!
// But for clarity, prefer explicit reassignment for arrays

// ✓ WORKS in Svelte 5
users.push(newUser);

// ✓ ALSO WORKS and more explicit
users = [...users, newUser];
```

---

## Decision Tree

```
Need to share state?
├─ Between parent and child?
│  └─ Use props
│
├─ Between sibling components?
│  └─ Lift state to parent, pass via props
│
├─ Between routes?
│  └─ Use await parent() in load functions
│
├─ Across entire app?
│  ├─ User auth? → Global store
│  ├─ App theme? → Global store
│  ├─ Shopping cart? → Global store
│  ├─ Temporary UI? → Local state
│  └─ Form data? → Local state
│
└─ When in doubt → Local state first
```

---

## Checklist

Before using global state:

- [ ] Can this be local state? (Usually yes)
- [ ] Can this be passed via props? (Often yes)
- [ ] Can this use await parent()? (For routes)
- [ ] Is this truly global? (User, theme, cart)
- [ ] Will multiple unrelated components need this?

Only if all of the above point to global state, then use it.

---

**Remember**: Global state adds complexity. Start with local state and props. Only reach for global state when you have a clear need.
