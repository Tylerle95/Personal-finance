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
| `full_name` | String | Yes | Minimum 2 characters, alphanumeric and spaces | "Họ và tên phải có ít nhất 2 ký tự." |
| `email` | String | Yes | Valid email format (RFC 5322 regex) | "Vui lòng nhập địa chỉ email hợp lệ." |
| `password` | String | Yes | Minimum 8 characters, at least 1 letter and 1 number | "Mật khẩu phải từ 8 ký tự trở lên và chứa cả chữ và số." |

### 2. User Login Schema

| Field | Type | Required | Rules | Error Message |
|-------|------|----------|-------|---------------|
| `email` | String | Yes | Non-empty | "Email là bắt buộc." |
| `password` | String | Yes | Non-empty | "Mật khẩu là bắt buộc." |

---

## SQL Migration Script

> ⚠️ **Phải chạy trước migration của các feature khác** (e.g., `002-asset-management`). Bảng `profiles` là dependency của toàn bộ dự án.

Chạy script sau trong **Supabase Dashboard → SQL Editor**:

```sql
-- 1. Tạo bảng profiles đồng bộ với auth.users
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text,
  created_at timestamptz default now() not null
);

-- 2. Enable RLS
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 3. Trigger: tự động tạo profile khi user đăng ký mới
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```
