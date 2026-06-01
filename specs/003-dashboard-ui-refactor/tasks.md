# Tasks: Dashboard & Project UI Refactoring

**Input**: Design documents from `/specs/003-dashboard-ui-refactor/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Manual visual validation (no automated UI tests requested in spec).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Contains exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initial safety checks and workspace verification

- [x] T001 Verify project running locally and check active styling setup in src/app/globals.css
- [x] T002 Inspect existing dashboard layout file structures in src/app/dashboard/DashboardClient.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core variables and theme styles that all user stories build upon

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Setup CSS custom variables for glassmorphism background and glass borders in src/app/globals.css
- [x] T004 Implement transition utility classes and custom keyframe animations in src/app/globals.css

**Checkpoint**: Foundation ready - user story styling can now begin

---

## Phase 3: User Story 1 - Premium Visual Polish & Modern Aesthetics (Priority: P1) 🎯 MVP

**Goal**: Deliver a highly polished dashboard visual look with glassmorphism, soft gradients, and modern dark mode styling.

**Independent Test**: Verify layout cards have rounded edges, backdrop filters, soft drop shadows, and high text contrast in both themes.

### Implementation for User Story 1

- [x] T005 [P] [US1] Apply glassmorphism styling, soft shadow tokens, and hover scale transitions to the asset card container in src/components/ui/AssetCard.tsx
- [x] T006 [P] [US1] Refactor asset card details and typography to match premium design principles in src/components/ui/AssetCard.tsx
- [x] T007 [P] [US1] Apply backdrop-blur, gradient background glows, and layout spacing adjustments to the main dashboard container in src/app/dashboard/DashboardClient.tsx
- [x] T008 [P] [US1] Enhance card grids with responsive auto-fit Tailwind utilities in src/app/dashboard/assets/AssetClient.tsx
- [x] T009 [P] [US1] Polish visual colors, charts, and legends alignment in src/components/ui/NetWorthSummary.tsx

**Checkpoint**: At this point, the application looks premium on desktop screens.

---

## Phase 4: User Story 2 - Mobile-First Responsive Navigation (Priority: P2)

**Goal**: Ensure mobile users can navigate screens easily using a bottom navigation bar.

**Independent Test**: Switch to mobile screen simulation (< 640px) and verify bottom nav appears and responds to route changes.

### Implementation for User Story 2

- [x] T010 [US2] Create and render a sticky bottom navigation bar component for mobile viewports in src/app/dashboard/DashboardClient.tsx
- [x] T011 [US2] Restructure the top header toolbar to hide standard nav links and display only the user profile icon/controls on mobile in src/app/dashboard/DashboardClient.tsx
- [x] T012 [US2] Add navigation active states and touch target padding (>= 48px area) to the mobile bottom navigation bar in src/app/dashboard/DashboardClient.tsx

**Checkpoint**: The app is now fully optimized for mobile navigation.

---

## Phase 5: User Story 3 - Interactive Feedback & Micro-Animations (Priority: P3)

**Goal**: Add interactive touch sheets, modal slide transitions, and click scale animations.

**Independent Test**: Open modals on mobile to check slide-up drawer sheets; tap buttons to verify scale-down click feedback.

### Implementation for User Story 3

- [x] T013 [US3] Add scale-down and ripple interactions to all dashboard form buttons and theme toggles in src/app/dashboard/DashboardClient.tsx
- [x] T014 [US3] Configure mobile modal form layouts to display as slide-up bottom sheets with proper viewport meta constraints in src/app/dashboard/assets/AssetClient.tsx
- [x] T015 [US3] Enhance backdrop fade-in transition overlays for modals in src/app/globals.css

**Checkpoint**: Interactive feedback feels tactile and professional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: General touch-ups, visual testing, and documentation

- [x] T016 Apply scrollbar-custom styling and container query classes across all dashboard lists in src/app/globals.css
- [x] T017 Verify light and dark mode contrasts across all screens by running local test browser flows
- [x] T018 Run the verification checklist and steps in specs/003-dashboard-ui-refactor/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational completion.
  - Can proceed sequentially (P1 → P2 → P3).
- **Polish (Phase 6)**: Depends on all user stories being complete.

---

## Parallel Opportunities

- Setup tasks T001 and T002 can be run in parallel.
- User Story 1 implementation tasks T005, T006, T007, T008, T009 are independent files and can be worked on in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup (T001-T002).
2. Complete Foundational styling (T003-T004).
3. Complete User Story 1 visual polish (T005-T009).
4. Validate desktop visuals.

### Incremental Delivery

1. Deliver Visual Polish (US1).
2. Deliver Mobile Navigation (US2).
3. Deliver Interactive Sheets and Animations (US3).
4. Deliver Final Polish & Scrollbars (Phase 6).
