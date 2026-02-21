# Utilities

This document defines when and how to organize utility functions.

---

## Decision Tree

```
Where should this utility function live?

Used in ONE component only?
└─ Put it directly in the component

Used in 2-3 components?
├─ Are they in the same file/folder?
│  └─ Export from component using module script
└─ Are they spread across the app?
   └─ Create a specific utils file (e.g., dateUtils.ts)

Used across MANY components?
├─ Related utilities? (all date functions, all string functions)
│  └─ Grouped utils file (dateUtils.ts, stringUtils.ts)
└─ General purpose utilities?
   └─ AppUtils.ts class with static methods
```

---

## Local Utilities (Single Component)

### When to Use

- Function used only in one component
- Helper function specific to component logic
- Not worth exporting

### Pattern

```typescript
// MyComponent.svelte
<script lang="ts">
let items = $state([1, 2, 3, 4, 5]);

// ✓ CORRECT - Local utility function
function filterEvenNumbers(numbers: number[]): number[] {
  return numbers.filter(n => n % 2 === 0);
}

let evenItems = $derived(filterEvenNumbers(items));
</script>

<div>
  {#each evenItems as item (item)}
    <p>{item}</p>
  {/each}
</div>
```

---

## Shared Utilities (Few Components)

### When to Use

- Function used in 2-3 related components
- Components in same folder/feature area
- Want to keep utilities close to usage

### Pattern - Module Script

```typescript
// UserCard.svelte
<script lang="ts" module>
// Export utility for use in other components
export function formatUserName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

export function getUserInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}
</script>

<script lang="ts">
interface UserCardProps {
  firstName: string;
  lastName: string;
}

const { firstName, lastName }: UserCardProps = $props();

const fullName = formatUserName(firstName, lastName);
const initials = getUserInitials(firstName, lastName);
</script>

<div>
  <div class="avatar">{initials}</div>
  <h3>{fullName}</h3>
</div>
```

### Import in Other Components

```typescript
// OtherComponent.svelte
<script lang="ts">
import { formatUserName, getUserInitials } from './UserCard.svelte';

const fullName = formatUserName("John", "Doe");
const initials = getUserInitials("John", "Doe");
</script>
```

---

## Grouped Global Utilities

### When to Use

- Related utility functions (all work with dates, strings, etc.)
- Used across many components
- Want to keep related functions together

### Pattern - dateUtils.ts

```typescript
// lib/utils/dateUtils.ts

/**
 * Format a date to MM/DD/YYYY
 */
export function formatDate(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const year = date.getFullYear();

	return `${month}/${day}/${year}`;
}

/**
 * Format a date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffSec = Math.floor(diffMs / 1000);
	const diffMin = Math.floor(diffSec / 60);
	const diffHour = Math.floor(diffMin / 60);
	const diffDay = Math.floor(diffHour / 24);

	if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
	if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
	if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
	return 'Just now';
}

/**
 * Parse a date string (YYYY-MM-DD) to Date object
 */
export function parseDate(dateStr: string): Date {
	return new Date(dateStr);
}

/**
 * Check if a date is in the past
 */
export function isInPast(date: Date): boolean {
	return date.getTime() < Date.now();
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}
```

### Usage

```typescript
<script lang="ts">
import { formatDate, formatRelativeTime } from '$lib/utils/dateUtils';

let createdAt = new Date('2024-01-15');
let formattedDate = formatDate(createdAt);
let relativeTime = formatRelativeTime(createdAt);
</script>

<p>Created: {formattedDate}</p>
<p>{relativeTime}</p>
```

### More Examples

**lib/utils/stringUtils.ts:**

```typescript
export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncate(str: string, maxLength: number): string {
	if (str.length <= maxLength) return str;
	return str.slice(0, maxLength) + '...';
}

export function slugify(str: string): string {
	return str
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
```

**lib/utils/numberUtils.ts:**

```typescript
export function formatCurrency(amount: number, currency: string = 'USD'): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency
	}).format(amount);
}

export function formatPercent(value: number, decimals: number = 0): string {
	return `${(value * 100).toFixed(decimals)}%`;
}

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}
```

---

## AppUtils Class

### When to Use

- General-purpose utilities that don't fit a specific category
- Utility functions used across the entire app
- Want a central place for miscellaneous helpers

### Pattern

```typescript
// lib/utils/AppUtils.ts
export default class AppUtils {
	/**
	 * Format currency with USD symbol
	 */
	static formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	}

	/**
	 * Debounce a function
	 */
	static debounce<T extends (...args: any[]) => any>(fn: T, ms: number): (...args: Parameters<T>) => void {
		let timeoutId: ReturnType<typeof setTimeout>;

		return function (...args: Parameters<T>) {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => fn(...args), ms);
		};
	}

	/**
	 * Generate a random ID
	 */
	static generateId(): string {
		return crypto.randomUUID();
	}

	/**
	 * Sleep for specified milliseconds
	 */
	static sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Deep clone an object
	 */
	static deepClone<T>(obj: T): T {
		return JSON.parse(JSON.stringify(obj));
	}

	/**
	 * Check if value is empty (null, undefined, '', [], {})
	 */
	static isEmpty(value: any): boolean {
		if (value === null || value === undefined) return true;
		if (typeof value === 'string') return value.trim() === '';
		if (Array.isArray(value)) return value.length === 0;
		if (typeof value === 'object') return Object.keys(value).length === 0;
		return false;
	}

	/**
	 * Copy text to clipboard
	 */
	static async copyToClipboard(text: string): Promise<boolean> {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch (error) {
			console.error('Failed to copy to clipboard:', error);
			return false;
		}
	}

	/**
	 * Download data as a file
	 */
	static downloadFile(data: string, filename: string, mimeType: string = 'text/plain') {
		const blob = new Blob([data], { type: mimeType });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		link.click();
		URL.revokeObjectURL(url);
	}

	/**
	 * Format file size
	 */
	static formatFileSize(bytes: number): string {
		const units = ['B', 'KB', 'MB', 'GB', 'TB'];
		let size = bytes;
		let unitIndex = 0;

		while (size >= 1024 && unitIndex < units.length - 1) {
			size /= 1024;
			unitIndex++;
		}

		return `${size.toFixed(1)} ${units[unitIndex]}`;
	}
}
```

### Usage

```typescript
<script lang="ts">
import AppUtils from '$lib/utils/AppUtils';

let price = 1234.56;
let formattedPrice = AppUtils.formatCurrency(price);

async function handleCopy(text: string) {
  const success = await AppUtils.copyToClipboard(text);
  if (success) {
    console.log('Copied!');
  }
}

const debouncedSearch = AppUtils.debounce((query: string) => {
  console.log('Searching for:', query);
}, 300);
</script>
```

---

## Validation Utilities

### Pattern

```typescript
// lib/utils/validationUtils.ts

export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
	const phoneRegex = /^\+?1?\d{10,14}$/;
	return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

export function isValidUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

export function isStrongPassword(password: string): {
	isValid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (password.length < 8) {
		errors.push('Password must be at least 8 characters');
	}
	if (!/[A-Z]/.test(password)) {
		errors.push('Password must contain an uppercase letter');
	}
	if (!/[a-z]/.test(password)) {
		errors.push('Password must contain a lowercase letter');
	}
	if (!/[0-9]/.test(password)) {
		errors.push('Password must contain a number');
	}
	if (!/[!@#$%^&*]/.test(password)) {
		errors.push('Password must contain a special character');
	}

	return {
		isValid: errors.length === 0,
		errors
	};
}
```

---

## Array Utilities

### Pattern

```typescript
// lib/utils/arrayUtils.ts

export function unique<T>(array: T[]): T[] {
	return [...new Set(array)];
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
	return array.reduce(
		(groups, item) => {
			const groupKey = String(item[key]);
			if (!groups[groupKey]) {
				groups[groupKey] = [];
			}
			groups[groupKey].push(item);
			return groups;
		},
		{} as Record<string, T[]>
	);
}

export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
	return [...array].sort((a, b) => {
		const aVal = a[key];
		const bVal = b[key];

		if (aVal < bVal) return order === 'asc' ? -1 : 1;
		if (aVal > bVal) return order === 'asc' ? 1 : -1;
		return 0;
	});
}

export function chunk<T>(array: T[], size: number): T[][] {
	const chunks: T[][] = [];
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size));
	}
	return chunks;
}
```

---

## DOM Utilities

### Pattern

```typescript
// lib/utils/domUtils.ts

export function scrollToTop(smooth: boolean = true) {
	window.scrollTo({
		top: 0,
		behavior: smooth ? 'smooth' : 'auto'
	});
}

export function scrollToElement(elementId: string, offset: number = 0) {
	const element = document.getElementById(elementId);
	if (element) {
		const top = element.getBoundingClientRect().top + window.scrollY - offset;
		window.scrollTo({
			top,
			behavior: 'smooth'
		});
	}
}

export function isInViewport(element: HTMLElement): boolean {
	const rect = element.getBoundingClientRect();
	return rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth;
}

export function getScrollPercent(): number {
	const scrollTop = window.scrollY;
	const docHeight = document.documentElement.scrollHeight - window.innerHeight;
	return (scrollTop / docHeight) * 100;
}
```

---

## Anti-Patterns

### ❌ Overly Generic Utility Files

```typescript
// ✗ WRONG - utils.ts with everything
export function formatDate() { ... }
export function isValidEmail() { ... }
export function debounce() { ... }
export function sortArray() { ... }

// ✓ CORRECT - Specific files
// dateUtils.ts - Date functions only
// validationUtils.ts - Validation only
// arrayUtils.ts - Array operations only
```

### ❌ Not Using TypeScript Generics

```typescript
// ✗ WRONG - Loses type safety
export function sortBy(array: any[], key: string) {
	// ...
}

// ✓ CORRECT - Type safe
export function sortBy<T>(array: T[], key: keyof T) {
	// ...
}
```

### ❌ Exporting Everything from Component

```typescript
// ✗ WRONG - Exporting internal functions
<script lang="ts" module>
export function internalHelper() { ... }
export function anotherInternalThing() { ... }
</script>

// ✓ CORRECT - Only export what's needed elsewhere
<script lang="ts" module>
// Only export if used in other components
export function formatUserName() { ... }
</script>

<script lang="ts">
// Keep internal functions here
function internalHelper() { ... }
</script>
```

---

## Checklist

Before creating a utility function:

- [ ] Is it used in only one component? (Keep it local)
- [ ] Is it used in 2-3 related components? (Module script export)
- [ ] Is it part of a group? (Create specific utils file)
- [ ] Is it general purpose? (Add to AppUtils)
- [ ] Does it use TypeScript generics for type safety?
- [ ] Is it documented with JSDoc comments?
- [ ] Is the function name descriptive?

---

**Remember**: Start local, extract when needed. Don't create utility files preemptively—wait until you actually need to share the function.
