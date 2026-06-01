# Data Model: Supabase Authentication Integration

This document defines the data structures and validation rules required for the user authentication feature.

## Database Entities

Although the authentication user database is managed internally by Supabase Auth (`auth.users`), we sync user profiles to our public schema for query access and references.

### 1. Profiles (`public.profiles`)

Represents the public profile information of an authenticated user. Created automatically via trigger when a new user registers.

| Field Name | Type | Key | Constraints | Description |
|------------|------|-----|-------------|-------------|
| `id` | `uuid` | PK | FK `auth.users.id` ON DELETE CASCADE | Unique user identifier synced with Auth user |
| `email` | `text` | | Unique, Non-null | User email address |
| `full_name`| `text` | | Nullable | User display name |
| `created_at`| `timestamp with time zone` | | Default: `now()` | Date and time profile was created |

#### Relationships
- `profiles.id` is referenced as a foreign key by other entities (e.g. `categories.user_id`, `transactions.user_id`).

---

## Form Validation Rules

Validation occurs client-side for immediate user feedback and server-side inside Server Actions for security.

### 1. User Registration Schema

| Field | Type | Required | Rules | Error Message |
|-------|------|----------|-------|---------------|
| `full_name` | String | Yes | Minimum 2 characters, alphanumeric and spaces | "Full name must be at least 2 characters long." |
| `email` | String | Yes | Valid email format (RFC 5322 regex) | "Please enter a valid email address." |
| `password` | String | Yes | Minimum 8 characters, at least 1 letter and 1 number | "Password must be at least 8 characters long and contain both letters and numbers." |

### 2. User Login Schema

| Field | Type | Required | Rules | Error Message |
|-------|------|----------|-------|---------------|
| `email` | String | Yes | Non-empty | "Email is required." |
| `password` | String | Yes | Non-empty | "Password is required." |
