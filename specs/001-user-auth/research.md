# Research: Supabase Authentication Integration with OTP Verification

This document outlines the technical decisions, rationales, and alternatives considered for implementing authentication in the Personal Finance application.

## 1. Authentication Integration Strategy

* **Decision**: Integrate Supabase Auth utilizing the `@supabase/ssr` package.
* **Rationale**: Next.js App Router relies heavily on Server Components and Server Actions. Traditional client-side authentication storing tokens in `localStorage` causes a layout flash (showing the dashboard before redirecting) and makes Server Components unable to know if a user is logged in. Using `@supabase/ssr` stores session tokens in cookies, making auth state accessible in Server Components, Client Components, and Middleware.
* **Alternatives Considered**:
  - **Client-only Supabase SDK (`@supabase/supabase-js` with localStorage)**: Rejected. Leads to a bad user experience (flashes of protected content) and cannot protect page rendering on the server side.
  - **NextAuth.js (Auth.js) with Supabase Adapter**: Rejected for v1. NextAuth.js adds complexity and an extra layer of abstraction. Direct integration via `@supabase/ssr` is simpler, lightweight, and leverages Supabase's native user management trigger capabilities.

## 2. Forms & Form Handling (Server Actions vs API Routes)

* **Decision**: Use React 19 Server Actions for sign-in, sign-up, verification, and sign-out actions, and a REST Route Handler (`/auth/callback`) for handling email confirmations/redirect codes.
* **Rationale**: Server Actions are the native and recommended way to handle forms in Next.js App Router. They automatically handle POST requests, support React 19 transition states (`useActionState`), and allow redirecting and cache revalidation (`revalidatePath`) directly from the server.
* **Alternatives Considered**:
  - **Standard REST API Routes (`/api/auth/login`, etc.)**: Rejected. Requires more boilerplate code (writing fetch calls in client components, managing response state, setting up status codes).

## 3. Account Activation: Email Verification via OTP (One-Time Password)

* **Decision**: Implement a dedicated Verification Page (`/verify`) that processes a 6-digit OTP code sent via email, leveraging the `supabase.auth.verifyOtp` API.
* **Rationale**: By default, Supabase requires email confirmation for new signups. Instead of forcing users to click an external verification link (which breaks the web application flow, especially on mobile), we provide an in-app 6-digit OTP prompt. When registration succeeds, the user is redirected to `/verify?email=...`, inputs the code, and is logged in directly.
* **Alternatives Considered**:
  - **Disable Email Confirmation in Supabase**: Possible during early development for frictionless testing, but highly discouraged for production as it opens the system to fake emails.
  - **Rely strictly on email magic links**: Rejected for MVP. Clicking a link in an email client often opens a new browser instance/tab, leading to fragmented session cookies and potential authentication loops on mobile.

## 4. Route Protection & Middleware Filename

* **Decision**: Implement route protection and session cookie management in Next.js Middleware located strictly at `src/middleware.ts` exporting a `middleware` named function.
* **Rationale**: Next.js requires the middleware entry point to be named exactly `middleware.ts` at the root or within the `src` folder. Any deviations (such as `src/proxy.ts` or custom named functions like `proxy`) are ignored by the NextJS engine, disabling session refresh and route gates.
* **Alternatives Considered**:
  - **Layout or Page-level redirection**: Rejected. Check is run too late, causing layout jumps or flash of unauthenticated screens.

## 5. UI Library & Styling

* **Decision**: Use Tailwind CSS v4 (vanilla CSS + utility classes) with Lucide Icons.
* **Rationale**: Tailwind CSS v4 is already configured in the project. It provides fast styling, is responsive by design (necessary for Mobile-First), and avoids extra runtime JS overhead. Lucide React provides lightweight vector icons.
* **Alternatives Considered**:
  - **Component Libraries (e.g., Shadcn UI)**: Rejected for this feature. We want clean, custom, lightweight inputs and buttons that we have absolute visual control over, avoiding external dependencies for basic form controls.
