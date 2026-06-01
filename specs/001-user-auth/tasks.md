# Tasks: Supabase Authentication Integration

**Input**: Design documents from `/specs/001-user-auth/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required for user stories), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/interfaces.md](./contracts/interfaces.md)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project configuration and environment variables setup

- [ ] T001 Configure Supabase environment variables in `.env.local`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Initialize Supabase SSR clients and auth middleware

**⚠️ CRITICAL**: No user story page or form work can begin until this phase is complete

- [ ] T002 Create browser-side Supabase client helper in `src/lib/supabase/client.ts`
- [ ] T003 [P] Create server-side Supabase client helper in `src/lib/supabase/server.ts`
- [ ] T004 [P] Create middleware session helper client in `src/lib/supabase/middleware.ts`
- [ ] T005 Implement route protection and session refresh in Next.js Middleware `src/middleware.ts`

**Checkpoint**: Foundation ready - auth clients and route protection middleware are operational.

---

## Phase 3: User Story 1 - New User Registration (Priority: P1) 🎯 MVP

**Goal**: Allow new visitors to register with email, password, and full name.

**Independent Test**: Navigate to `/register`, submit a valid signup, and verify the user profile record is created in the database.

### Implementation for User Story 1

- [ ] T006 [US1] Create the sign-up Server Action (`signUp`) in `src/app/actions/auth.ts`
- [ ] T007 [P] [US1] Build the premium, mobile-friendly Registration page component at `src/app/(auth)/register/page.tsx`

**Checkpoint**: User registration is functional and profile metadata is stored correctly in the database.

---

## Phase 4: User Story 2 - User Sign In (Priority: P1)

**Goal**: Allow existing users to securely sign in with email and password.

**Independent Test**: Navigate to `/login`, enter valid credentials, submit, and confirm redirect to `/dashboard`.

### Implementation for User Story 2

- [ ] T008 [US2] Create the sign-in Server Action (`signIn`) in `src/app/actions/auth.ts`
- [ ] T009 [P] [US2] Build the premium, mobile-friendly Login page component at `src/app/(auth)/login/page.tsx`

**Checkpoint**: User sign-in is operational, verifying credentials and creating active sessions.

---

## Phase 5: User Story 3 - Route Protection & Session Management (Priority: P1)

**Goal**: Restrict pages (dashboard, transactions) and support session termination (sign out).

**Independent Test**: Click sign out button, verify redirect to `/login`, and confirm that the browser's back button does not grant access.

### Implementation for User Story 3

- [ ] T010 [US3] Create the sign-out Server Action (`signOut`) in `src/app/actions/auth.ts`
- [ ] T011 [US3] Implement Dashboard placeholder page at `src/app/dashboard/page.tsx` with user email display and Sign Out button
- [ ] T012 [US3] Implement routing/redirection landing logic in root page `src/app/page.tsx`
- [ ] T013 [US3] Implement Email confirmation callback route handler at `src/app/auth/callback/route.ts`

**Checkpoint**: Protected routes are locked, active user sessions can be terminated, and callback handler is operational.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: PWA meta configuration, styles verification, and manual validation.

- [ ] T014 Configure PWA manifest references and viewport/theme metadata in `src/app/layout.tsx`
- [ ] T015 Run validation checks following the verification flow in [quickstart.md](./quickstart.md)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup (T001) - Blocks all user stories.
- **User Stories (Phases 3-5)**: Depends on Foundational. Can run sequentially or in parallel.
- **Polish (Phase 6)**: Depends on all user stories being complete.

### Parallel Opportunities

- T003 and T004 can run in parallel.
- T007 (Register UI page) and T009 (Login UI page) can be styled/built in parallel.
- T011 and T012 can be implemented in parallel.
