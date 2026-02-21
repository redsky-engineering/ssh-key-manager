# Naming Conventions

This document defines all naming standards for variables, functions, files, types, and more.

---

## Variables

```typescript
// ✓ CORRECT - camelCase for all variables
let myVariableName;
let userId;
let apiUrl;
let httpClient;

// ✗ WRONG - Never use var, underscores, or capital acronyms
var my_variable_name;
let userID;
let APIUrl;
let HTTPClient;
```

### Acronyms

Always lowercase acronyms in camelCase:

```typescript
// ✓ CORRECT
let apiUrl;
let httpClient;
let userId;
let xmlParser;

// ✗ WRONG
let apiURL;
let HTTPClient;
let userID;
let XMLParser;
```

---

## Booleans

Always use a prefix to identify boolean variables:

```typescript
// ✓ CORRECT - Boolean prefixes
let isOpen = false;
let hasLock = true;
let shouldUpdate = false;
let canExecute = true;
let areAvailable = false;

// Prefer positive naming
let isEnabled = false; // better than isDisabled = true
let isLoading = true; // better than isLoaded = false
let isSubmitting = false;

// ✗ WRONG - Generic names
let open = false;
let lock = true;
let update = false;
```

### Common Prefixes

- `is` - Single states (isOpen, isVisible, isActive)
- `are` - Plural states (areAvailable, areEnabled)
- `has` - Possession (hasItems, hasError, hasAccess)
- `can` - Capability (canExecute, canEdit, canDelete)
- `should` - Recommended action (shouldUpdate, shouldRender)

---

## Arrays and Objects

```typescript
// ✓ CORRECT - Plural for arrays
let users: User[] = $state([]);
let selectedItems: Item[] = $state([]);

// ✓ CORRECT - Descriptive for objects/records
let userById: Record<string, User> = $state({});
let config: AppConfig = $state({...});

// ✗ WRONG
let userList; // just use 'users'
let userArray;
let userMap; // just use 'users' or 'userById'
```

---

## Functions

```typescript
// ✓ CORRECT - Event handlers
function onSubmit() { ... }
function onCancel() { ... }
function onClick() { ... }

// ✓ CORRECT - Functions returning booleans use same prefixes
function isValidEmail(email: string): boolean { ... }
function canUserEdit(user: User): boolean { ... }
function shouldShowModal(): boolean { ... }

// ✓ CORRECT - Async functions
async function fetchUsers() { ... }

// ✗ WRONG
const onSubmit = () => { ... } // use function declaration
function handleOnSubmit() { ... } // don't use "handle" prefix
function handleSubmit() { ... } // don't use "handle" prefix
```

---

## Constants

```typescript
// ✓ CORRECT - UPPERCASE_SNAKE_CASE for global/module constants
const HOURS_IN_DAY = 24;
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRIES = 3;
const US_STATES = ['MN', 'UT', 'CO', 'CA', 'NY'];

// ✓ CORRECT - camelCase for local temporary values
function fetchUsers() {
	const responseObject = fetch('...');
	return responseObject.data;
}

// ✗ WRONG - Don't use UPPERCASE for temporary values
function fetchUsers() {
	const RESPONSE_OBJECT = fetch('...'); // This is temporary, use camelCase
}
```

**Rule**: Use UPPERCASE_SNAKE_CASE only for:

- Module-level constants
- Global constants exported from files
- Values that are truly constant across the application

Use camelCase for:

- Local variables within functions
- Temporary computed values

---

## Interfaces and Types

### Component Props

```typescript
// ✓ CORRECT - Component props always prefixed with component name
interface UserCardProps {
  firstName: string;
  lastName: string;
}

interface UserCardHeaderProps {
  title: string;
}

// ✗ WRONG - Generic prop names
interface Props { ... } // Always prefix with component name
```

### Data Interfaces

```typescript
// ✓ CORRECT - Data interfaces
interface User {
  id: number;
  firstName: string;
}

interface UserData {
  users: User[];
  total: number;
}

// ✗ WRONG
interface IUser { ... } // Don't use Hungarian notation
```

### Type vs Interface

**Use `interface`** for object shapes:

```typescript
interface User {
	id: number;
	name: string;
}
```

**Use `type`** for:

- Setting equal to another interface
- Union types
- Omitting properties

```typescript
// ✓ CORRECT - Type for unions
type UserRole = 'admin' | 'user' | 'guest';
type Status = 'SUCCESSFUL' | 'FAILED' | 'COMPLETED';

// ✓ CORRECT - Type for aliases
type UserResponse = Api.V1.User.Get.Res;

// ✓ CORRECT - Type for Omit/Pick
type PartialUser = Omit<User, 'password'>;
```

### Enums

**Use `type` with union** when values match names:

```typescript
// ✓ CORRECT - Union type
type Status = 'SUCCESSFUL' | 'FAILED' | 'COMPLETED';
```

**Use `enum`** when values differ from names:

```typescript
// ✓ CORRECT - Enum when value differs
enum Status {
	SUCCESSFUL = 'Successful',
	FAILED = 'unsuccessful'
}
```

---

## File Naming

### Component Files

```
// ✓ CORRECT - PascalCase.svelte
UserCard.svelte
ProductCard.svelte
EditUserDialog.svelte
ExpandableTextBlock.svelte

// ✗ WRONG
userCard.svelte
user-card.svelte
```

### Service Files

```
// ✓ CORRECT - PascalCase.ts
UserService.ts
ProductService.ts
AuthService.ts

// ✗ WRONG
userService.ts
user.service.ts
```

### Service Type Files

```
// ✓ CORRECT - PascalCaseServiceTypes.ts
UserServiceTypes.ts
ProductServiceTypes.ts

// ✗ WRONG
userServiceTypes.ts
UserService.types.ts
```

### Utility Files

```
// ✓ CORRECT - camelCaseUtils.ts or PascalCaseUtils.ts
dateUtils.ts
stringUtils.ts
AppUtils.ts
CookieUtils.ts

// ✗ WRONG
date-utils.ts
DateUtils.ts (unless it's a class like AppUtils)
```

### Schema Files

```
// ✓ CORRECT - camelCaseSchema.ts
loginSchema.ts
checkoutSchema.ts
addProductSchema.ts
userSchema.ts

// ✗ WRONG
LoginSchema.ts
login-schema.ts
```

---

## Folder Naming

### Always camelCase

```
// ✓ CORRECT
src/lib/components/custom/myAccount/
src/lib/components/custom/userCard/
src/lib/services/user/
src/lib/utils/

// ✗ WRONG
src/lib/components/custom/MyAccount/
src/lib/components/custom/user-card/
src/lib/services/User/
```

### Component Folders

Folder name matches component name (camelCase folder, PascalCase file):

```
// ✓ CORRECT
custom/myAccount/MyAccount.svelte
custom/userCard/UserCard.svelte
custom/productList/ProductList.svelte

// ✗ WRONG
custom/MyAccount/MyAccount.svelte
custom/user-card/UserCard.svelte
```

### Service Folders

```
// ✓ CORRECT
services/user/UserService.ts
services/product/ProductService.ts

// ✗ WRONG
services/User/UserService.ts
services/userService/UserService.ts
```

---

## TypeScript Type Annotations

### State Type Annotations

Always use colon notation with runes:

```typescript
// ✓ CORRECT - Colon notation
let name: string = $state('john');
let users: User[] = $state([]);
let config: AppConfig | null = $state(null);

// ✓ ALSO CORRECT - Inferred when obvious
let count = $state(0); // inferred as number
let isOpen = $state(false); // inferred as boolean

// ✗ WRONG - Don't use generic notation
let users = $state<User[]>([]); // Don't do this
let config = $state<AppConfig | null>(null); // Don't do this
```

### Prefer `string[]` over `Array<string>`

```typescript
// ✓ CORRECT
let users: string[];
let ids: number[];

// ✗ WRONG
let users: Array<string>;
let ids: Array<number>;
```

---

## Quick Reference

| Type               | Convention                | Example                       |
| ------------------ | ------------------------- | ----------------------------- |
| Variables          | camelCase                 | `userName`, `userId`          |
| Booleans           | prefix + camelCase        | `isActive`, `hasAccess`       |
| Functions          | camelCase                 | `onSubmit`, `fetchUsers`      |
| Event Handlers     | `on` + Event              | `onClick`, `onSubmit`         |
| Constants (global) | UPPERCASE_SNAKE_CASE      | `API_BASE_URL`, `MAX_RETRIES` |
| Constants (local)  | camelCase                 | `responseObject`              |
| Components         | PascalCase                | `UserCard.svelte`             |
| Interfaces         | PascalCase                | `User`, `UserCardProps`       |
| Types              | PascalCase                | `UserRole`, `Status`          |
| Service Files      | PascalCase                | `UserService.ts`              |
| Service Types      | PascalCase + ServiceTypes | `UserServiceTypes.ts`         |
| Utility Files      | camelCase + Utils         | `dateUtils.ts`, `AppUtils.ts` |
| Schema Files       | camelCase + Schema        | `loginSchema.ts`              |
| Folders            | camelCase                 | `myAccount/`, `userCard/`     |

---

## Anti-Patterns

### ❌ Don't Use `var`

```typescript
// ✗ WRONG
var userName = 'john';

// ✓ CORRECT
let userName = 'john';
const MAX_USERS = 100;
```

### ❌ Don't Use Single-Letter Variables

```typescript
// ✗ WRONG
let u = getUser();
let x = 10;

// ✓ CORRECT
let user = getUser();
let userCount = 10;
```

### ❌ Don't Use Generic Names for Booleans

```typescript
// ✗ WRONG
let active = true;
let disabled = false;

// ✓ CORRECT
let isActive = true;
let isDisabled = false;
```

### ❌ Don't Use "handle" Prefix for Event Handlers

```typescript
// ✗ WRONG
function handleSubmit() { ... }
function handleClick() { ... }

// ✓ CORRECT
function onSubmit() { ... }
function onClick() { ... }
```

---

**Remember**: Consistent naming makes code self-documenting and reduces cognitive load. When in doubt, choose clarity over brevity.
