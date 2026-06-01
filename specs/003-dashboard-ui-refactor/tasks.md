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

## Phase 1: Completed Tasks (Previous Iterations)

- [x] T001 Verify project running locally and check active styling setup in src/app/globals.css
- [x] T002 Inspect existing dashboard layout file structures in src/app/dashboard/DashboardClient.tsx
- [x] T003 Setup CSS custom variables for glassmorphism background and glass borders in src/app/globals.css
- [x] T004 Implement transition utility classes and custom keyframe animations in src/app/globals.css
- [x] T005 Apply glassmorphism styling, soft shadow tokens, and hover scale transitions to the asset card container in src/components/ui/AssetCard.tsx
- [x] T006 Refactor asset card details and typography to match premium design principles in src/components/ui/AssetCard.tsx
- [x] T007 Apply backdrop-blur, gradient background glows, and layout spacing adjustments to the main dashboard container in src/app/dashboard/DashboardClient.tsx
- [x] T008 Enhance card grids with responsive auto-fit Tailwind utilities in src/app/dashboard/assets/AssetClient.tsx
- [x] T009 Polish visual colors, charts, and legends alignment in src/components/ui/NetWorthSummary.tsx
- [x] T010 Create and render a sticky bottom navigation bar component for mobile viewports in src/app/dashboard/DashboardClient.tsx
- [x] T011 Restructure the top header toolbar to hide standard nav links and display only the user profile icon/controls on mobile in src/app/dashboard/DashboardClient.tsx
- [x] T012 Add navigation active states and touch target padding (>= 48px area) to the mobile bottom navigation bar in src/app/dashboard/DashboardClient.tsx
- [x] T013 Add scale-down and ripple interactions to all dashboard form buttons and theme toggles in src/app/dashboard/DashboardClient.tsx
- [x] T014 Configure mobile modal form layouts to display as slide-up bottom sheets with proper viewport meta constraints in src/app/dashboard/assets/AssetClient.tsx
- [x] T015 Enhance backdrop fade-in transition overlays for modals in src/app/globals.css
- [x] T016 Apply scrollbar-custom styling and container query classes across all dashboard lists in src/app/globals.css
- [x] T017 Verify light and dark mode contrasts across all screens by running local test browser flows
- [x] T018 Run the verification checklist and steps in specs/003-dashboard-ui-refactor/quickstart.md

---

## Phase 2: YouTube-Style Layout & Global Navigation (Current Iteration)

**Purpose**: Build the unified layout shell, static header, and YouTube collapsible sidebar.

- [x] T019 [NEW] Create Server Layout file in [src/app/dashboard/layout.tsx](file:///Users/tylerle/Documents/Me/Personal-finance/src/app/dashboard/layout.tsx) to verify authentication and fetch user data.
- [x] T020 [NEW] Implement Client Layout component in [src/app/dashboard/DashboardLayoutClient.tsx](file:///Users/tylerle/Documents/Me/Personal-finance/src/app/dashboard/DashboardLayoutClient.tsx) to manage sidebar toggle state, global header, YouTube-style sidebar links, and mobile bottom navigation.
- [x] T021 [MODIFY] Update [src/app/dashboard/DashboardClient.tsx](file:///Users/tylerle/Documents/Me/Personal-finance/src/app/dashboard/DashboardClient.tsx) to remove duplicate `<header>` and mobile `<nav>` elements, adapting it to sit cleanly within the shared layout.
- [x] T022 [MODIFY] Clean up [src/app/dashboard/assets/AssetClient.tsx](file:///Users/tylerle/Documents/Me/Personal-finance/src/app/dashboard/assets/AssetClient.tsx) styles to align with the new layout margins and prevent double headers/nav.
- [x] T023 [MODIFY] Enhance transition effects and styling rules in [src/app/globals.css](file:///Users/tylerle/Documents/Me/Personal-finance/src/app/globals.css) for smooth sidebar width transition.
- [x] T024 Perform manual verification: test toggles, theme, language, and responsive flow.
