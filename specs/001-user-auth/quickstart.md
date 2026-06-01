# Quickstart: Authentication Integration

This document outlines how to set up and verify the authentication feature locally in your development environment.

## 1. Prerequisites & Environment Setup

Ensure you have your Supabase credentials. Copy them from your Supabase dashboard (Project Settings -> API).

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Make sure the SQL script in Section 2 of `README.md` has been run on your Supabase project's SQL Editor to set up the `profiles` table, triggers, and Row Level Security (RLS) policies.

---

## 2. Running the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application will run on [http://localhost:3000](http://localhost:3000).

---

## 3. Step-by-Step Verification Flow

### Test Case 1: Route Protection
1. Open an incognito browser window.
2. Try to navigate directly to [http://localhost:3000/dashboard](http://localhost:3000/dashboard).
3. **Verify**: You should be automatically redirected to [http://localhost:3000/login](http://localhost:3000/login).

### Test Case 2: Sign Up & User Registration
1. Navigate to [http://localhost:3000/register](http://localhost:3000/register).
2. Enter:
   - Full Name: `Test User`
   - Email: `testuser@example.com`
   - Password: `Password123` (Ensure it meets complexity rules)
3. Submit the form.
4. **Verify**:
   - You are redirected to `/dashboard` (if auto-login is active) or see a check email verification prompt.
   - Open your Supabase Dashboard -> Table Editor -> `profiles`. Confirm a new profile record exists with `full_name: Test User` and `email: testuser@example.com`.

### Test Case 3: Sign In & Session persistence
1. Navigate to [http://localhost:3000/login](http://localhost:3000/login).
2. Enter the registered credentials: `testuser@example.com` / `Password123`.
3. Submit.
4. **Verify**:
   - You are redirected to `/dashboard` and see "Welcome, testuser@example.com".
   - Refresh the page. **Verify**: You remain on `/dashboard` (session is preserved in cookies).

### Test Case 4: Sign Out
1. On the `/dashboard` page, click the **Sign Out** button.
2. **Verify**:
   - You are redirected to `/login`.
   - Attempting to go back to `/dashboard` using the browser's Back button should block you and keep you at `/login`.
