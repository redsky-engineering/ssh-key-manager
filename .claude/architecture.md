# Architecture & File Organization

This document defines project structure, file organization, and architectural patterns.

---

## Project Structure Overview

```
project-root/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── stores/
│   │   ├── types/
│   │   └── constants.ts
│   ├── routes/
│   ├── schema/
│   ├── @types/
│   └── app.html
├── generated/
├── static/
└── tests/
```

---

## Component Organization

### Directory Structure

```
src/lib/components/
├── custom/                     # User-created components
│   ├── card/                   # Organized by UI pattern type
│   │   ├── productCard/
│   │   │   └── ProductCard.svelte
│   │   └── userCard/
│   │       └── UserCard.svelte
│   ├── dialog/
│   │   ├── editUserDialog/
│   │   │   └── EditUserDialog.svelte
│   │   └── addProductDialog/
│   │       └── AddProductDialog.svelte
│   ├── drawer/
│   │   └── userDetailsDrawer/
│   │       └── UserDetailsDrawer.svelte
│   └── form/
│       └── loginForm/
│           └── LoginForm.svelte
├── shadcn/ui/                  # Shadcn components (unchanged)
│   ├── button/
│   │   └── button.svelte
│   ├── dialog/
│   │   └── dialog.svelte
│   └── input/
│       └── input.svelte
└── shadcn-extra/ui/            # Extended Shadcn components
    ├── file-drop-zone/
    │   └── file-drop-zone.svelte
    └── phone-input/
        └── phone-input.svelte
```

### Component Naming

```
Folder: camelCase
File: PascalCase.svelte

Examples:
custom/myAccount/MyAccount.svelte
custom/userCard/UserCard.svelte
custom/productList/ProductList.svelte
```

### Component Organization by Type

Components are grouped by UI pattern, not by feature:

```
✓ CORRECT - Organized by pattern
custom/
  card/
    userCard/UserCard.svelte
    productCard/ProductCard.svelte
  dialog/
    editUserDialog/EditUserDialog.svelte
    deleteUserDialog/DeleteUserDialog.svelte

✗ WRONG - Organized by feature
custom/
  user/
    UserCard.svelte
    EditUserDialog.svelte
  product/
    ProductCard.svelte
```

**Why?** UI patterns (card, dialog, drawer) define component structure and behavior. Grouping by pattern makes it easier to find components with similar patterns and maintain consistency.

---

## Service Layer Organization

### Directory Structure

```
src/lib/services/
├── index.ts                    # Service registry
├── Service.ts                  # Base class (optional)
├── user/
│   ├── UserService.ts
│   └── UserServiceTypes.ts
├── product/
│   ├── ProductService.ts
│   └── ProductServiceTypes.ts
└── auth/
    ├── AuthService.ts
    └── AuthServiceTypes.ts
```

### Service Naming

```
Folder: camelCase
Service File: PascalCase + Service.ts
Types File: PascalCase + ServiceTypes.ts

Examples:
services/user/UserService.ts
services/user/UserServiceTypes.ts
services/product/ProductService.ts
services/product/ProductServiceTypes.ts
```

### Service Registry Pattern

```typescript
// services/index.ts
import UserService from './user/UserService.js';
import ProductService from './product/ProductService.js';
import AuthService from './auth/AuthService.js';

const userService = new UserService();
const productService = new ProductService();
const authService = new AuthService();

const services = {
	userService,
	productService,
	authService
};

// Initialize all services
const serviceInstances = Object.values(services);
serviceInstances.forEach((service) => {
	service.start?.();
});

export { userService, productService, authService };
```

---

## Routes Organization

### SvelteKit File-Based Routing

```
src/routes/
├── (auth)/                     # Layout group for auth pages
│   ├── login/
│   │   └── +page.svelte
│   ├── register/
│   │   └── +page.svelte
│   └── +layout.svelte
├── (noauth)/                   # Layout group for public pages
│   ├── dashboard/
│   │   ├── +page.svelte
│   │   └── +page.server.ts
│   ├── users/
│   │   ├── +page.svelte
│   │   ├── [id]/
│   │   │   └── +page.svelte
│   │   └── +page.server.ts
│   └── +layout.svelte
├── api/                        # API routes
│   └── users/
│       └── +server.ts
└── +layout.svelte              # Root layout
```

### Layout Groups

Use parentheses `()` to create layout groups:

```
(auth)/         # Shared layout for auth pages
(noauth)/       # Shared layout for protected pages
```

### Dynamic Routes

```
users/[id]/+page.svelte         # Dynamic user ID
products/[slug]/+page.svelte    # Dynamic product slug
```

---

## Schema Organization

### Directory Structure

```
src/schema/
├── loginSchema.ts
├── registerSchema.ts
├── userSchema.ts
├── productSchema.ts
└── checkoutSchema.ts
```

### Schema File Pattern

```typescript
// schema/userSchema.ts
import { z } from 'zod';

export const userSchema = z.object({
	email: z.string().email('Invalid email'),
	firstName: z.string().min(1, 'First name required'),
	lastName: z.string().min(1, 'Last name required'),
	role: z.enum(['admin', 'user', 'guest'])
});

export type UserSchema = typeof userSchema;
```

### Schema Naming

```
File: camelCase + Schema.ts

Examples:
loginSchema.ts
userSchema.ts
checkoutSchema.ts
```

---

## Types Organization

### Directory Structure

```
src/lib/types/
├── User.ts
├── Product.ts
├── Order.ts
└── auth/
    └── JwtPayload.ts
```

### Type File Pattern

```typescript
// types/User.ts
export interface User {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	role: 'admin' | 'user' | 'guest';
	createdAt: Date;
	updatedAt: Date;
}

export type UserRole = User['role'];

export interface UserListParams {
	page?: number;
	limit?: number;
	search?: string;
	role?: UserRole;
}
```

### Type Naming

```
File: PascalCase.ts

Examples:
User.ts
Product.ts
JwtPayload.ts
```

---

## Utils Organization

### Directory Structure

```
src/lib/utils/
├── AppUtils.ts                 # General utilities
├── HttpClient.ts               # HTTP client
├── dateUtils.ts                # Date utilities
├── stringUtils.ts              # String utilities
├── arrayUtils.ts               # Array utilities
└── validationUtils.ts          # Validation utilities
```

### Utils Naming

```
General: AppUtils.ts, CookieUtils.ts
Specific: camelCaseUtils.ts

Examples:
AppUtils.ts
dateUtils.ts
stringUtils.ts
```

---

## Stores Organization

### Directory Structure

```
src/lib/stores/
├── user.svelte.ts              # User authentication
├── theme.svelte.ts             # Theme preferences
├── toast.svelte.ts             # Toast notifications
└── cart.svelte.ts              # Shopping cart
```

### Store File Pattern

```typescript
// stores/user.svelte.ts
import type { User } from '$lib/types/User';

let currentUser: User | null = $state(null);

export function getUser() {
	return currentUser;
}

export function setUser(user: User) {
	currentUser = user;
}

export function clearUser() {
	currentUser = null;
}
```

### Store Naming

```
File: camelCase.svelte.ts

Examples:
user.svelte.ts
theme.svelte.ts
cart.svelte.ts
```

---

## Generated Files

### Directory Structure

```
generated/
└── apiRequests.ts              # Restura-generated API calls

src/@types/
├── api.d.ts                    # Restura-generated API types
├── models.d.ts                 # Restura-generated model types
└── restura.d.ts                # Restura-generated general types
```

### DO NOT EDIT

Files in `generated/` and `src/@types/` are auto-generated by Restura. **Never edit these files manually.**

---

## Static Assets

### Directory Structure

```
static/
├── images/
│   ├── logo.png
│   └── hero.jpg
├── fonts/
│   └── custom-font.woff2
└── favicon.ico
```

### Access in Components

```typescript
<img src="/images/logo.png" alt="Logo" />
<link rel="icon" href="/favicon.ico" />
```

---

## Constants

### Global Constants File

```typescript
// lib/constants.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const ITEMS_PER_PAGE = 20;

export const USER_ROLES = {
	ADMIN: 'admin',
	USER: 'user',
	GUEST: 'guest'
} as const;

export const ROUTES = {
	HOME: '/',
	LOGIN: '/login',
	DASHBOARD: '/dashboard',
	USERS: '/users'
} as const;
```

---

## Nested Components

### When to Create Separate Files

```
✓ CREATE separate file when:
- Component is reused elsewhere
- Component is complex (>50 lines)
- Component has its own state/logic

✗ DO NOT create separate file when:
- Used only in one parent
- Simple presentation logic
- Can be a snippet
```

### Snippet Pattern (Svelte 5)

```typescript
// MyComponent.svelte
<script lang="ts">
let items = $state([1, 2, 3]);
</script>

{#snippet itemCard(item: number)}
  <div class="card">
    <h3>Item {item}</h3>
  </div>
{/snippet}

<div>
  {#each items as item (item)}
    {@render itemCard(item)}
  {/each}
</div>
```

### Same-File Component Pattern

```typescript
// MyComponent.svelte
<script lang="ts">
// Define component in same file if more complex than snippet
function ItemCard(props: { item: number }) {
  return `
    <div class="card">
      <h3>Item ${props.item}</h3>
      <p>Complex logic here</p>
    </div>
  `;
}

let items = $state([1, 2, 3]);
</script>

<div>
  {#each items as item (item)}
    <ItemCard {item} />
  {/each}
</div>
```

---

## Import Aliases

### Configured Aliases

```typescript
// Use $lib to import from src/lib/
import { userService } from '$lib/services';
import Button from '$lib/components/ui/button/button.svelte';
import type { User } from '$lib/types/User';

// Use $schema for schemas
import { loginSchema } from '$schema/loginSchema';

// Generated types don't need aliases
import { ApiRequestV1 } from '../../../generated/apiRequests';
```

### svelte.config.js

```javascript
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$lib: 'src/lib',
			$schema: 'src/schema'
		}
	}
};
```

---

## Architecture Principles

### 1. Separation of Concerns

```
UI Layer (Components)
  ↓ Uses
Service Layer (Business Logic)
  ↓ Calls
API Layer (HTTP Client)
  ↓ Communicates
Backend API
```

### 2. Single Responsibility

Each file has one clear purpose:

- Components: UI rendering
- Services: Business logic
- Utils: Helper functions
- Stores: Global state
- Schemas: Validation

### 3. Dependency Direction

```
Components → Services → HTTP Client → API
Components → Stores
Components → Utils
Services → Types
```

**Never:**

- Services importing components
- Utils importing services
- Circular dependencies

---

## File Naming Quick Reference

| Type             | Convention                   | Example             |
| ---------------- | ---------------------------- | ------------------- |
| Component        | PascalCase.svelte            | UserCard.svelte     |
| Component Folder | camelCase                    | userCard/           |
| Service          | PascalCase + Service.ts      | UserService.ts      |
| Service Types    | PascalCase + ServiceTypes.ts | UserServiceTypes.ts |
| Service Folder   | camelCase                    | user/               |
| Utils            | camelCaseUtils.ts            | dateUtils.ts        |
| Utils (Class)    | PascalCaseUtils.ts           | AppUtils.ts         |
| Schema           | camelCaseSchema.ts           | loginSchema.ts      |
| Type             | PascalCase.ts                | User.ts             |
| Store            | camelCase.svelte.ts          | user.svelte.ts      |
| Route            | +page.svelte                 | +page.svelte        |

---

## Anti-Patterns

### ❌ Deep Nesting

```
✗ WRONG
components/custom/user/profile/card/UserProfileCard.svelte

✓ CORRECT
components/custom/card/userProfileCard/UserProfileCard.svelte
```

### ❌ Mixed Organization

```
✗ WRONG
components/custom/
  UserCard.svelte           # Mixed with folders
  productCard/
    ProductCard.svelte

✓ CORRECT
components/custom/
  card/
    userCard/UserCard.svelte
    productCard/ProductCard.svelte
```

### ❌ Feature-Based Component Organization

```
✗ WRONG - Organized by feature
components/custom/
  user/
    UserCard.svelte
    UserDialog.svelte
  product/
    ProductCard.svelte

✓ CORRECT - Organized by pattern
components/custom/
  card/
    userCard/UserCard.svelte
    productCard/ProductCard.svelte
  dialog/
    userDialog/UserDialog.svelte
```

---

## Checklist

Before creating new files/folders:

- [ ] Following naming conventions?
- [ ] In correct directory?
- [ ] Using import aliases ($lib, $schema)?
- [ ] Not creating deep nesting?
- [ ] Following separation of concerns?
- [ ] Component organized by UI pattern, not feature?

---

**Remember**: Consistent structure makes projects easier to navigate. When in doubt, follow the existing patterns in the project.
