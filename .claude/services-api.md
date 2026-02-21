# Services & API Layer

This document defines the service layer architecture, API integration patterns, and HTTP client usage.

---

## Core Principle

**UI components NEVER call the API directly.** All API communication flows through the service layer.

```
┌─────────────────┐
│  UI Component   │  ← Handles UI state, user interactions
│  (Svelte)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Service Layer  │  ← Business logic, API wrapping
│  (UserService)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  HTTP Client    │  ← Request/response handling
│  (ApiRequestV1) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Backend API   │  ← Express + PostgreSQL
└─────────────────┘
```

---

## Service Structure

### Directory Organization

```
services/
├── index.ts                    # Service registry (exports all services)
├── Service.ts                  # Base class (optional)
├── user/
│   ├── UserService.ts
│   └── UserServiceTypes.ts
└── product/
    ├── ProductService.ts
    └── ProductServiceTypes.ts
```

---

## Service Registry Pattern

The `services/index.ts` file acts as a central registry for all services.

### services/index.ts

```typescript
// To add a new service:
// 1. Import it
// 2. Construct it
// 3. Add to services object
// 4. Export it

import UserService from './user/UserService.js';
import ProductService from './product/ProductService.js';

const userService = new UserService();
const productService = new ProductService();

const services = {
	userService,
	productService
};

// Start all services (if they have a start method)
const serviceInstances = Object.values(services);
serviceInstances.forEach((service) => {
	service.start?.();
});

export { userService, productService };
```

### Why This Pattern?

- **Single source of truth** - All services exported from one place
- **Easy to extend** - Add new services by following the pattern
- **Initialization** - Services can run startup logic via `start()` method
- **Testable** - Services can be mocked easily

---

## Service Implementation

### services/user/UserService.ts

```typescript
import type { HttpRequestOptions } from '$lib/utils/HttpClient';
import { ApiRequestV1 } from '../../../generated/apiRequests';
import { Service } from '../Service.js';
import type { UserServiceTypes } from './UserServiceTypes.js';

export default class UserService extends Service {
	/**
	 * Get current user
	 */
	getUserMe(requestOptions?: HttpRequestOptions): Promise<UserServiceTypes.UserMeResponse> {
		return ApiRequestV1.getUserMe(requestOptions);
	}

	/**
	 * Update user by ID
	 */
	async updateUser(
		userId: number,
		data: UserServiceTypes.UpdateUserRequest,
		requestOptions?: HttpRequestOptions
	): Promise<UserServiceTypes.UserResponse> {
		return ApiRequestV1.patchUser(userId, data, requestOptions);
	}

	/**
	 * Get user list with optional filters
	 */
	async getUsers(
		params?: UserServiceTypes.UserListParams,
		requestOptions?: HttpRequestOptions
	): Promise<UserServiceTypes.UserListResponse> {
		return ApiRequestV1.getUsers(params, requestOptions);
	}
}
```

### Key Points

- **Extends Service base class** (optional but recommended)
- **Methods wrap Restura-generated functions** - No direct HTTP calls
- **Types from UserServiceTypes** - Keep types separate
- **Business logic can go here** - Transform data, validate, etc.
- **Optional requestOptions** - For headers, auth, etc.

---

## Service Types

### services/user/UserServiceTypes.ts

```typescript
export namespace UserServiceTypes {
	// ==========================================
	// TYPES FIRST
	// ==========================================
	export type UserMeResponse = Api.V1.User.Me.Get.Res;
	export type UserResponse = Api.V1.User.Get.Res;
	export type UserListResponse = Api.V1.User.List.Get.Res;
	export type UpdateUserRequest = Api.V1.User.Patch.Req;
	export type CreateUserRequest = Api.V1.User.Post.Req;

	// ==========================================
	// INTERFACES SECOND
	// ==========================================
	export interface UserListParams {
		page?: number;
		limit?: number;
		search?: string;
		role?: 'admin' | 'user' | 'guest';
	}

	export interface UserFilterOptions {
		includeInactive?: boolean;
		sortBy?: 'name' | 'email' | 'createdAt';
		sortOrder?: 'asc' | 'desc';
	}
}
```

### Namespace Organization

- **Types first** - Aliases to Restura-generated types
- **Interfaces second** - Custom interfaces for params/options
- **Export within namespace** - Keeps types organized per service

---

## HTTP Client

### Location

`lib/utils/http.ts` and `lib/utils/HttpClient.ts`

### Configuration

```typescript
import { HttpClient } from './HttpClient';

export enum HttpStatusCode {
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	CONFLICT = 409,
	SERVER_ERROR = 500
}

let baseUrl: string;

// Determine base URL (browser vs SSR)
if (typeof window !== 'undefined') {
	baseUrl = window.location.origin;
} else {
	if (import.meta.env.DEV) {
		baseUrl = 'http://localhost:5173';
	} else {
		baseUrl = process.env.API_URL ?? '';
	}
}

const http = new HttpClient(
	{
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json, text/plain, */*'
		}
	},
	baseUrl
);

// Request interceptor - add auth tokens, etc.
http.addRequestIntercepter(async (request) => {
	// Modify request before sending
	// Example: Add JWT from cookie
	return request;
});

// Response interceptor - handle errors globally
http.addResponseIntercepter(async (response) => {
	// Handle responses
	// Example: Redirect on 401
	return response;
});

export function changeBaseUrl(url: string) {
	http.changeBaseUrl(url);
}

export default http;
```

### Features

- **Base URL handling** - Different for browser vs SSR
- **Request interceptors** - Add headers, auth tokens
- **Response interceptors** - Global error handling
- **Cookie-based auth** - JWT stored in httpOnly cookies

---

## Restura Integration

### Generated Types

Restura generates types at `src/@types/`:

```typescript
// api.d.ts - API endpoint types
declare namespace Api {
	export namespace V1 {
		export namespace User {
			export namespace Me {
				export namespace Get {
					export interface Req {}
					export interface Res {
						id: number;
						email: string;
						firstName: string;
						lastName: string;
					}
				}
			}
		}
	}
}

// models.d.ts - Database models
declare namespace Model {
	export interface User {
		id: number;
		email: string;
		createdAt: Date;
	}
}
```

### Generated API Requests

Restura generates request functions at `generated/apiRequests.ts`:

```typescript
import { ApiRequestV1 } from '../../../generated/apiRequests';

// Use in services
export default class UserService {
	getUserMe() {
		return ApiRequestV1.getUserMe();
	}
}
```

### Referencing Types in Services

```typescript
// services/user/UserServiceTypes.ts
export namespace UserServiceTypes {
	// Reference Restura-generated types
	export type UserMeResponse = Api.V1.User.Me.Get.Res;
	export type UpdateUserRequest = Api.V1.User.Patch.Req;

	// Reference model types
	export type User = Model.User;
}
```

---

## Usage in Components

### Basic API Call

```typescript
<script lang="ts">
import { onMount } from 'svelte';
import { userService } from '$lib/services';
import type { User } from '$lib/types/User';

let user: User | null = $state(null);
let isLoading = $state(false);
let error: string | null = $state(null);

async function loadUser() {
  isLoading = true;
  error = null;

  try {
    user = await userService.getUserMe();
  } catch (err) {
    error = 'Failed to load user';
    console.error(err);
  } finally {
    isLoading = false;
  }
}

onMount(() => {
  loadUser();
});
</script>

{#if isLoading}
  <LoadingSpinner />
{:else if error}
  <ErrorMessage message={error} />
{:else if user}
  <UserProfile {user} />
{/if}
```

### List Rendering

```typescript
<script lang="ts">
import { onMount } from 'svelte';
import { productService } from '$lib/services';
import type { Product } from '$lib/types/Product';

let products: Product[] = $state([]);
let isLoading = $state(false);

async function loadProducts() {
  isLoading = true;
  try {
    products = await productService.getProducts();
  } finally {
    isLoading = false;
  }
}

onMount(() => {
  loadProducts();
});
</script>

{#if isLoading}
  <LoadingSpinner />
{:else}
  <div class="grid grid-cols-3 gap-4">
    {#each products as product (product.id)}
      <ProductCard {product} />
    {/each}
  </div>
{/if}
```

### Form Submission

```typescript
<script lang="ts">
import { userService } from '$lib/services';

async function onSubmit() {
  try {
    await userService.updateUser(userId, {
      firstName,
      lastName,
      email
    });

    // Show success message
    showToast('User updated successfully');
  } catch (error) {
    // Handle error
    if (HttpError.isHttpError(error)) {
      const msg = await error.getResponseErrorMsg();
      showToast(msg);
    }
  }
}
</script>
```

---

## Error Handling

### Service Layer - Just Call API

Services don't handle errors, they let them bubble up:

```typescript
// ✓ CORRECT - Service just calls API
export default class UserService {
	async getUserMe(): Promise<UserMeResponse> {
		return ApiRequestV1.getUserMe();
	}
}
```

### Component Layer - Handle Errors

Components catch and handle errors:

```typescript
// ✓ CORRECT - Component handles errors
async function loadUser() {
	try {
		user = await userService.getUserMe();
	} catch (error) {
		if (HttpError.isHttpError(error)) {
			const msg = await error.getResponseErrorMsg();
			showToast(msg, 'error');
		} else {
			showToast('An unexpected error occurred', 'error');
		}
	}
}
```

### HttpError Class

```typescript
import { HttpError } from '$lib/utils/HttpError';

try {
	await userService.updateUser(userId, data);
} catch (error) {
	if (HttpError.isHttpError(error)) {
		const statusCode = error.status;
		const errorMsg = await error.getResponseErrorMsg();

		if (statusCode === 401) {
			// Redirect to login
		} else if (statusCode === 400) {
			// Show validation errors
		}
	}
}
```

---

## Common Patterns

### Loading States

```typescript
let isLoading = $state(false);

async function loadData() {
	isLoading = true;
	try {
		data = await service.getData();
	} finally {
		isLoading = false; // Always runs
	}
}
```

### Pagination

```typescript
let currentPage = $state(1);
let pageSize = $state(20);
let users: User[] = $state([]);

async function loadUsers() {
	const params = {
		page: currentPage,
		limit: pageSize
	};

	users = await userService.getUsers(params);
}

function nextPage() {
	currentPage++;
	loadUsers();
}
```

### Search/Filter

```typescript
let searchQuery = $state('');

let filteredUsers = $derived(users.filter((u) => u.firstName.toLowerCase().includes(searchQuery.toLowerCase())));

$effect(() => {
	// Debounced API call when search changes
	const timer = setTimeout(async () => {
		users = await userService.searchUsers(searchQuery);
	}, 300);

	return () => clearTimeout(timer);
});
```

---

## Anti-Patterns

### ❌ Calling API Directly from Component

```typescript
// ✗ WRONG - NEVER DO THIS
async function loadUser() {
	const response = await fetch('/api/user/me');
	const user = await response.json();
}

// ✓ CORRECT - Use service layer
async function loadUser() {
	user = await userService.getUserMe();
}
```

### ❌ Business Logic in Components

```typescript
// ✗ WRONG - Transform logic in component
async function loadUsers() {
  const data = await userService.getUsers();
  users = data.map(u => ({
    ...u,
    fullName: `${u.firstName} ${u.lastName}`
  }));
}

// ✓ CORRECT - Put transform logic in service
// UserService.ts
async getUsers() {
  const data = await ApiRequestV1.getUsers();
  return data.map(u => ({
    ...u,
    fullName: `${u.firstName} ${u.lastName}`
  }));
}
```

### ❌ Not Handling Errors

```typescript
// ✗ WRONG - Errors silently fail
async function loadUser() {
	user = await userService.getUserMe();
}

// ✓ CORRECT - Handle errors
async function loadUser() {
	try {
		user = await userService.getUserMe();
	} catch (error) {
		console.error('Failed to load user:', error);
		showErrorToast();
	}
}
```

---

## Checklist

Before submitting service/API code:

- [ ] All API calls go through service layer
- [ ] Services use Restura-generated functions
- [ ] Types defined in `{Service}ServiceTypes.ts`
- [ ] Errors handled in components, not services
- [ ] Loading states managed properly
- [ ] No direct `fetch()` calls in components
- [ ] HTTP interceptors configured if needed

---

**Remember**: The service layer is mandatory. It provides a consistent interface, enables testing, and keeps business logic out of UI components.
