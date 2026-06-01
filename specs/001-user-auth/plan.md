# Implementation Plan: Supabase Authentication Integration

**Branch**: `001-user-auth` | **Date**: 2026-06-01 | **Spec**: [spec.md](./spec.md)

## Summary

Implement user authentication in the Next.js App Router project using Supabase Auth (`@supabase/ssr` cookie-based session management). This enables secure user registration with immediate auto-login, login, logout, session persistence, and proxy-based route protection.

## Technical Context

**Language/Version**: TypeScript / ES2022 (TypeScript v5, Node.js v20+)

**Primary Dependencies**: Next.js 16.2.6, React 19.2.4, `@supabase/ssr` ^0.10.3, `@supabase/supabase-js` ^2.106.2, `lucide-react` ^1.17.0, `tailwindcss` ^4

**Storage**: Supabase PostgreSQL (utilizing the native `auth.users` and synced `public.profiles` table via database triggers)

**Testing**: Manual route, registration, and login verification flows (documented in [quickstart.md](./quickstart.md))

**Target Platform**: Web browsers (Desktop and Mobile), PWA standalone mode

**Project Type**: Next.js App Router Web Application

**Performance Goals**: Page transitions and redirection checks in under 1 second; form validation feedback in under 100ms.

**Constraints**: Row Level Security (RLS) enabled on all database tables. Secure, HTTPOnly, SameSite cookies for cookie-based session persistence.

**Scale/Scope**: Initial authentication MVP supporting direct email/password registration and logins.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Principle I: Type Safety**: Enforce strict type definitions for all utility functions, Server Action returns, and database operations.
- [x] **Principle II: Edge Proxy Protection**: Use Next.js Proxy strictly located at `src/proxy.ts` to refresh tokens and validate routes before server component render cycles.
- [x] **Principle III: Mobile-First UI**: Design forms with responsive grids, minimum 48px tap targets, and no horizontal overflow.

## Project Structure

### Documentation (this feature)

```text
specs/001-user-auth/
├── plan.md              # This file
├── research.md          # Technical decisions and rationale (including proxy filename)
├── data-model.md        # Database schema details and form validation rules
├── quickstart.md        # Steps to setup and verify locally
└── contracts/
    └── interfaces.md    # Page route definition and server action signatures
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx           # Login page UI and form
│   │   └── register/
│   │       └── page.tsx           # Registration page UI and form (auto-logs in on success)
│   ├── dashboard/
│   │   └── page.tsx               # Dashboard (protected route placeholder)
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts           # Email confirmation callback
│   ├── actions/
│   │   └── auth.ts                # Server Actions (signIn, signUp, signOut)
│   ├── layout.tsx                 # Root layout with metadata and PWA settings
│   ├── page.tsx                   # Landing page directing to login/dashboard
│   └── proxy.ts                   # Route protection proxy entry point (Next.js 16 convention)
├── components/
│   └── ui/                        # Reusable premium UI components (Button, Input, Card)
└── lib/
    └── supabase/
        ├── client.ts              # Browser client initializer
        ├── server.ts              # Server client initializer (reads cookies)
        └── middleware.ts          # Session helper for Next.js Middleware
```

**Structure Decision**: Single project layout matching Next.js App Router structure directly at the repository root. All logic resides within the `src/` directory.

## Complexity Tracking

No violations to track. Designed strictly within standard Next.js App Router paradigms and direct Supabase auth integration.
