# Interfaces & Contracts: Authentication

This document details the interface definitions, paths, and server action contracts for the authentication feature.

## 1. Page Routes

| Route | Accessibility | Component Type | Layout | Redirect Logic |
|-------|---------------|----------------|--------|----------------|
| `/login` | Public (Unauthenticated) | Client Page | Auth Layout | Redirects to `/dashboard` if user is already logged in. |
| `/register` | Public (Unauthenticated) | Client Page | Auth Layout | Redirects to `/dashboard` if user is already logged in. |
| `/dashboard` | Protected (Private) | Server Page | Dashboard Layout | Redirects to `/login` if user is not logged in. |
| `/auth/callback` | Public API | Route Handler | N/A | Exchanges temp oauth/confirm code for session cookies, then redirects to `/dashboard`. |

---

## 2. Server Actions (`src/app/actions/auth.ts`)

Server actions process credentials on the server side, interact with Supabase Auth, and manage cookie states.

### A. `signUp`
Registers a new user and signs them in immediately (auto-login).

* **Signature**:
  ```typescript
  export async function signUp(
    prevState: { error: string | null; success: boolean },
    formData: FormData
  ): Promise<{ error: string | null; success: boolean }>
  ```
* **Inputs**:
  - `formData` containing: `full_name`, `email`, `password`.
* **Behavior**:
  1. Validates inputs.
  2. Calls `supabase.auth.signUp({ email, password, options: { data: { full_name } } })`.
  3. Returns `{ error: null, success: true }` and redirects to `/dashboard` if successful, or `{ error: errorMessage, success: false }` on failure.

### B. `signIn`
Authenticates an existing user and creates session cookies.

* **Signature**:
  ```typescript
  export async function signIn(
    prevState: { error: string | null; success: boolean },
    formData: FormData
  ): Promise<{ error: string | null; success: boolean }>
  ```
* **Inputs**:
  - `formData` containing: `email`, `password`.
* **Behavior**:
  1. Validates inputs.
  2. Calls `supabase.auth.signInWithPassword({ email, password })`.
  3. Revalidates layout cache via `revalidatePath('/', 'layout')`.
  4. Returns error state on failure, or redirects to `/dashboard` on success.

### C. `signOut`
Logs the user out and clears session cookies.

* **Signature**:
  ```typescript
  export async function signOut(): Promise<void>
  ```
* **Behavior**:
  1. Calls `supabase.auth.signOut()`.
  2. Revalidates layout cache via `revalidatePath('/', 'layout')`.
  3. Redirects to `/login`.
