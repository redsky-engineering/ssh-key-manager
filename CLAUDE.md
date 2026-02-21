# Project Context

This is a Svelte 5 + TypeScript frontend application with an Express backend.

## How to Use This Guide

**IMPORTANT**: This root file provides an overview. For detailed standards, you MUST read the relevant context files from `.claude/` directory.

### Quick Start Process

1. **Read this entire root file first** - Understand the tech stack and critical rules
2. **Identify your task type** - Component work? API integration? Forms?
3. **Read the required context files** - See "Context Files" section below
4. **Follow the patterns exactly** - The context files contain examples and anti-patterns
5. **Ask if unclear** - Better to clarify than generate non-compliant code

### Example Workflows

**Creating a new component:**

1. Read `.claude/naming.md` (naming conventions)
2. Read `.claude/component-structure.md` (structure and ordering)
3. Read `.claude/state-management.md` if using complex state
4. Generate component following those patterns

**Adding API integration:**

1. Read `.claude/services-api.md` (service layer architecture)
2. Read `.claude/naming.md` (naming conventions)
3. Never call API directly from components - always use services

**Building a form:**

1. Read `.claude/forms-validation.md` (forms and Zod)
2. Read `.claude/component-structure.md` (component ordering)
3. Read `.claude/dialogs-popups.md` if form is in a dialog

---

## Technology Stack

- **Frontend**: Svelte 5 with TypeScript
- **Component Library**: Shadcn-Svelte
- **Styling**: Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Databases**: PostgreSQL (primary), Redis (caching)
- **API**: Restura (REST API generator)
- **Forms**: Superforms with Zod validation

## Key Directories

- `/src/routes` - SvelteKit file-based routes
- `/src/lib/components` - Reusable UI components
    - `/custom` - User-created components organized by type (card, dialog, drawer)
    - `/shadcn/ui` - Shadcn components
- `/src/lib/services` - Business logic and API layer (MANDATORY)
- `/src/schema` - Zod validation schemas
- `/src/lib/utils` - Utility functions
- `/src/lib/stores` - Global state (use sparingly)
- `/generated` - Restura auto-generated API types

---

## Context Files

**ALWAYS READ** the context files relevant to your task. They contain critical patterns, examples, and anti-patterns.

### Core Files (Read for Most Tasks)

**`.claude/naming.md`** - Naming conventions

- Variables, functions, files, types
- camelCase vs PascalCase vs UPPERCASE_SNAKE_CASE rules
- Boolean prefixes (is, has, can, should, are)
- Read this for: Any code generation task

**`.claude/component-structure.md`** - Component ordering and patterns

- Strict section ordering (Imports → Props → State → Functions)
- Svelte 5 runes usage ($state, $derived, $effect, $props)
- Anti-patterns (NO export let, NO $: syntax)
- Read this for: Creating or modifying components

### Feature-Specific Files

**`.claude/services-api.md`** - Service layer architecture

- Service layer pattern (MANDATORY for all API calls)
- HttpClient wrapper usage
- Restura integration
- Error handling
- Read this for: API integration, backend communication

**`.claude/forms-validation.md`** - Forms and validation

- Zod schema patterns
- Superforms integration
- Form state management
- Validation patterns
- Read this for: Building forms, user input

**`.claude/dialogs-popups.md`** - Dialog/popup patterns

- State management (parent owns isOpen, popup owns form state)
- Callback patterns (onValidSubmit)
- Bindable props
- Read this for: Modals, dialogs, drawers, popups

**`.claude/state-management.md`** - State management

- When to use local vs global state
- Svelte 5 stores pattern
- Passing data via props vs await parent()
- Read this for: Complex state, global state, data flow

**`.claude/utilities.md`** - Utility organization

- When to use local vs shared vs global utils
- AppUtils class pattern
- Module script exports
- Read this for: Helper functions, shared logic

**`.claude/architecture.md`** - Architecture and file organization

- Project structure
- File/folder naming
- Component organization
- Nested components vs snippets
- Read this for: Project setup, refactoring, large features

---

## Critical Rules (Non-Negotiable)

These rules ALWAYS apply, regardless of task:

### 1. Svelte 5 Only

```typescript
// ✓ CORRECT - Svelte 5 runes
const { value }: MyComponentProps = $props();
let count = $state(0);
let doubled = $derived(count * 2);

// ✗ WRONG - Svelte 4 syntax (FORBIDDEN)
export let value: number;
$: doubled = count * 2;
```

### 2. Type Annotations with Colon Notation

```typescript
// ✓ CORRECT
let users: User[] = $state([]);
let config: AppConfig | null = $state(null);

// ✗ WRONG - Don't use generic notation
let users = $state<User[]>([]);
```

### 3. Service Layer is MANDATORY

```typescript
// ✓ CORRECT - UI calls service
let user = await userService.getUserMe();

// ✗ WRONG - NEVER call API directly from component
let user = await fetch('/api/user/me');
```

### 4. Clean Code Principles

- Meaningful variable names (NO single letters)
- Small, focused functions
- Self-documenting code (comments only for complex logic)
- camelCase for variables/functions, PascalCase for types/components

### 5. Boolean Naming

```typescript
// ✓ CORRECT - Always use prefix
let isOpen = $state(false);
let hasAccess = $state(true);
let canEdit = $state(false);

// ✗ WRONG - Generic names
let open = false;
let access = true;
```

---

## Quick Reference

### Naming Standards

- **camelCase**: variables, functions, database tables/columns
- **PascalCase**: components, interfaces, types, classes
- **UPPERCASE_SNAKE_CASE**: global constants only
- **Boolean prefix**: `is`, `has`, `can`, `should`, `are`
- **Arrays**: plural naming (`users` not `userList`)
- **Event handlers**: `onSubmit`, `onClick` (not `handleSubmit`)

### Component Structure Order

1. Imports
2. Local Types (optional)
3. Props
4. Constants
5. State & Derived
6. Lifecycle
7. Effects
8. Functions

### File Organization

```
src/lib/components/custom/
  card/
    userCard/UserCard.svelte
  dialog/
    editUserDialog/EditUserDialog.svelte

src/lib/services/
  index.ts                    # Service registry
  user/
    UserService.ts
    UserServiceTypes.ts
```

---

## Common Mistakes to Avoid

❌ Using `export let` instead of `$props()`  
❌ Using `$:` reactive statements instead of `$derived`  
❌ Calling API directly from components instead of services  
❌ Generic prop interface names (`Props` instead of `UserCardProps`)  
❌ Putting business logic in dialogs instead of parent components  
❌ Using single-letter variable names  
❌ Event handlers with "handle" prefix (`handleClick` vs `onClick`)  
❌ Type annotations with generic notation (`$state<Type>()`)

---

## Before You Generate Code

**Checklist:**

- [ ] Have I read the relevant context files?
- [ ] Do I understand the pattern I'm implementing?
- [ ] Am I using Svelte 5 syntax only?
- [ ] Are my naming conventions correct?
- [ ] Am I following the service layer pattern?
- [ ] Is my component structure in the correct order?

**If you're unsure about any of these, STOP and ask for clarification.**

---

## Getting Help

If context files conflict or you're unclear on a pattern:

1. State which context files you've read
2. Describe the specific conflict or confusion
3. Ask for clarification before generating code

Better to ask than to generate code that needs refactoring.

---

## External Resources

- **Svelte 5 LLM Guide**: https://svelte.dev/llms-full.txt
- **Shadcn-Svelte Docs**: https://www.shadcn-svelte.com/

---

**Version**: 1.0  
**Last Updated**: 2026-02-11  
**Maintained By**: Red Sky Engineering

---

## Remember

This root file is your roadmap. The `.claude/*.md` files are your detailed specifications. Read them before writing code, not after fixing bugs.
