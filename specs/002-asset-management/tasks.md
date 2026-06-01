# Tasks: Asset & Account Management (with Custom Categories)

**Input**: Design documents from `specs/002-asset-management/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required), [data-model.md](./data-model.md), [contracts/interfaces.md](./contracts/interfaces.md)

**Tests**: Tests are manually verified using [quickstart.md](./quickstart.md).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Configure custom CSS styles or utility definitions for category colors and swatches in `src/app/globals.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Setup database schema by running migrations for `asset_categories` and `asset_accounts` defined in `specs/002-asset-management/data-model.md` inside Supabase SQL Editor

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Asset Category & Account Creation (Priority: P1) 🎯 MVP

**Goal**: Users can manage custom asset categories (name, color, icon) and create accounts linked to these categories.

**Independent Test**: Navigate to `/dashboard/assets`, click "Manage Categories" and add "Vàng miếng" with Amber color and Coins icon. Then add an account "SJC Gold" under it and verify it appears with the total value.

### Implementation for User Story 1

- [x] T003 [P] [US1] Define updated Type definitions for `AssetCategory`, `AssetAccount` and predefined colors/icons list in `src/lib/types/assets.ts`
- [x] T004 [US1] Implement data fetches `getUserAssetCategories` and `getUserAssetAccounts` in `src/lib/data/assets.ts`
- [x] T005 [US1] Implement category CRUD Server Actions (`createAssetCategory`, `updateAssetCategory`, `deleteAssetCategory`) in `src/app/actions/assets.ts`
- [x] T006 [US1] Modify existing account Server Actions (`createAssetAccount`, `updateAssetAccount`, `deleteAssetAccount`) to support dynamic categories in `src/app/actions/assets.ts`
- [x] T007 [P] [US1] Update `AssetCard` to render using category color and icon in `src/components/ui/AssetCard.tsx`
- [x] T008 [US1] Update the page server component for `/dashboard/assets` in `src/app/dashboard/assets/page.tsx` to retrieve custom categories and accounts
- [x] T009 [US1] Refactor `AssetClient` component in `src/app/dashboard/assets/AssetClient.tsx` to support the category management dialog (with color/icon palette grids) and linking accounts to custom categories

**Checkpoint**: User Story 1 is fully functional. Users can perform complete CRUD on categories and accounts.

---

## Phase 4: User Story 2 - Net Worth Dashboard & Asset Allocation (Priority: P2)

**Goal**: Main dashboard displays total net worth and dynamic allocation chart grouped by user's custom categories.

**Independent Test**: Create custom categories and accounts, go to `/dashboard`, and verify the net worth sum and allocation percentage in the chart.

### Implementation for User Story 2

- [x] T010 [US2] Update net worth summary logic `getNetWorthSummary` to calculate allocation percentages grouped by custom categories in `src/lib/data/assets.ts`
- [x] T011 [US2] Update dashboard server page to inject updated net worth summary in `src/app/dashboard/page.tsx`
- [x] T012 [P] [US2] Modify `AllocationChart` component to draw chart sections using category hex colors in `src/components/ui/AllocationChart.tsx`
- [x] T013 [US2] Adjust `DashboardClient` in `src/app/dashboard/DashboardClient.tsx` to handle dynamic category data and display group totals in `src/app/dashboard/DashboardClient.tsx`

**Checkpoint**: User Story 2 is functional. Dashboard correctly calculates net worth and shows allocation slices for custom categories.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, cleanup, and validation

- [ ] T014 Run manual verification scenarios defined in `specs/002-asset-management/quickstart.md` to ensure the entire flow is working without errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1) must be implemented first because User Story 2 (P2) displays the accounts created in US1.
- **Polish (Final Phase)**: Depends on all user stories being complete

### Parallel Opportunities

- T003 and T007 in US1 can be worked on in parallel.
- T012 in US2 can be modified in parallel with backend changes.
