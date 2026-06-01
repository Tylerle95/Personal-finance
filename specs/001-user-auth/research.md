# Research: Supabase Authentication Integration

This document outlines the technical decisions, rationales, and alternatives considered for implementing authentication in the Personal Finance application.

## 1. Authentication Integration Strategy

* **Decision**: Integrate Supabase Auth utilizing the `@supabase/ssr` package.
* **Rationale**: Next.js App Router relies heavily on Server Components and Server Actions. Traditional client-side authentication storing tokens in `localStorage` causes a layout flash (showing the dashboard before redirecting) and makes Server Components unable to know if a user is logged in. Using `@supabase/ssr` stores session tokens in cookies, making auth state accessible in Server Components, Client Components, and Middleware.
* **Alternatives Considered**:
  - **Client-only Supabase SDK (`@supabase/supabase-js` with localStorage)**: Rejected. Leads to a bad user experience (flashes of protected content) and cannot protect page rendering on the server side.
  - **NextAuth.js (Auth.js) with Supabase Adapter**: Rejected for v1. NextAuth.js adds complexity and an extra layer of abstraction. Direct integration via `@supabase/ssr` is simpler, lightweight, and leverages Supabase's native user management trigger capabilities.

## 2. Forms & Form Handling (Server Actions vs API Routes)

* **Decision**: Use React 19 Server Actions for sign-in, sign-up, and sign-out actions, and a REST Route Handler (`/auth/callback`) for handling email confirmations/redirect codes.
* **Rationale**: Server Actions are the native and recommended way to handle forms in Next.js App Router. They automatically handle POST requests, support React 19 transition states (`useActionState`), and allow redirecting and cache revalidation (`revalidatePath`) directly from the server.
* **Alternatives Considered**:
  - **Standard REST API Routes (`/api/auth/login`, etc.)**: Rejected. Requires more boilerplate code (writing fetch calls in client components, managing response state, setting up status codes).

## 3. Route Protection Mechanism

* **Decision**: Implement route protection in Next.js Middleware (`middleware.ts`).
* **Rationale**: Middleware runs before any request is completed, enabling redirecting of unauthenticated users at the routing level before the page starts rendering on the server. The middleware will also dynamically refresh the session cookie if it is close to expiration.
* **Alternatives Considered**:
  - **Layout or Page-level redirection**: Rejected. Check is run too late, causing layout jumps or flash of unauthenticated screens.

## 4. UI Library & Styling

* **Decision**: Use Tailwind CSS v4 (vanilla CSS + utility classes) with Lucide Icons.
* **Rationale**: Tailwind CSS v4 is already configured in the project. It provides fast styling, is responsive by design (necessary for Mobile-First), and avoids extra runtime JS overhead. Lucide React provides lightweight vector icons.
* **Alternatives Considered**:
  - **Component Libraries (e.g., Shadcn UI)**: Rejected for this feature. We want clean, custom, lightweight inputs and buttons that we have absolute visual control over, avoiding external dependencies for basic form controls.
