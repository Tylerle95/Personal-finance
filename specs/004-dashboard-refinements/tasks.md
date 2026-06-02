# Tasks: Dashboard & UI UX Refinements

**Input**: Design documents from `specs/004-dashboard-refinements/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required), [data-model.md](./data-model.md), [contracts/interfaces.md](./contracts/interfaces.md)

**Tests**: Manual verification using scenarios defined in [quickstart.md](./quickstart.md)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project environment check and localization setup

- [x] T001 Update translation keys `navAssets` (to "Lịch sử giao dịch" / "Transaction History") and add `navCategories` (to "Danh mục của tôi" / "My Categories") in `src/components/providers.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core UI components that other user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Create reusable confirmation popup modal `src/components/ui/ConfirmationModal.tsx` following glassmorphic styling constraints
- [x] T003 [P] Create reusable circular/donut chart component `src/components/ui/CircularAllocationChart.tsx` using native SVG with hover animations and tooltips
- [x] T016 Setup database schema migration to add `purchase_unit_price` and `ticker` columns to `asset_accounts` table
- [x] T017 [P] Update interface definition of `AssetAccount` in `src/lib/types/assets.ts` to include `purchase_unit_price` and `ticker`
- [x] T018 Create the server-side price fetching service in `src/lib/services/market-prices.ts`
- [x] T019 Update Server Actions `createAssetAccount` and `updateAssetAccount` and add `syncAssetPrices` in `src/app/actions/assets.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Collapsible Sidebar Navigation (Priority: P1)

**Goal**: Collapsed sidebar only shows icons (no text labels) on desktop. Sidebar has "Danh mục của tôi" link.

**Independent Test**: Navigate to `/dashboard`, click hamburger toggle, check that text labels hide and only icons center. Verify "Danh mục của tôi" link is present.

### Implementation for User Story 1

- [x] T004 [US1] Refactor `src/app/dashboard/DashboardLayoutClient.tsx` to hide text labels completely and center icons in collapsed mode. Add HTML tooltips to menu item icons.
- [x] T005 [US1] Add "Danh mục của tôi" link with the `FolderKanban` icon to both the sidebar and mobile bottom navigation in `src/app/dashboard/DashboardLayoutClient.tsx`

**Checkpoint**: User Story 1 is functional. The collapsible sidebar behavior works correctly on both desktop and mobile navigation layouts.

---

## Phase 4: User Story 2 - Categories Management Route (Priority: P2)

**Goal**: Dedicated `/dashboard/categories` route for category management.

**Independent Test**: Access `/dashboard/categories`, CRUD categories, check RLS policies, ensure delete triggers the confirmation modal.

### Implementation for User Story 2

- [x] T006 [P] [US2] Create the category page route server file `src/app/dashboard/categories/page.tsx` retrieving user categories from Supabase
- [x] T007 [US2] Create Client Component `src/app/dashboard/categories/CategoryClient.tsx` representing the full-screen category management table list and creation/editing form. Integrate `ConfirmationModal` on delete buttons.

**Checkpoint**: User Story 2 is functional. Users can access a separate view for full category CRUD.

---

## Phase 5: User Story 3 - Transaction History Row-Based Layout (Priority: P3)

**Goal**: Rename asset list screen to "Lịch sử giao dịch" and display accounts in rows.

**Independent Test**: Access `/dashboard/assets`, verify the header title is "Lịch sử giao dịch", and the accounts are rendered in a clean table row format.

### Implementation for User Story 3

- [x] T008 [US3] Refactor title elements and headers in `src/app/dashboard/assets/AssetClient.tsx` from "Tài sản của tôi" to "Lịch sử giao dịch"
- [x] T009 [US3] Refactor `src/app/dashboard/assets/AssetClient.tsx` to display the accounts as rows in an HTML `<table>` (collapsing responsively on mobile) instead of a card grid. Integrate `ConfirmationModal` on asset delete actions.
- [x] T020 [US3] Add `ticker` and `purchase_unit_price` input fields in creation/edit forms inside `src/app/dashboard/assets/AssetClient.tsx` (only for investment categories, hiding `unit_price`)
- [x] T021 [US3] Add a "Đồng bộ giá" (Sync Prices) button to `AssetClient.tsx` that triggers the `syncAssetPrices` Server Action
- [x] T022 [US3] Update transaction table rendering in `AssetClient.tsx` to display separate columns for quantity, purchase price, current price, and color-coded profit/loss calculation

**Checkpoint**: User Story 3 is functional. The asset accounts list is renamed, displayed in rows, and supports profit/loss tracking.

---

## Phase 6: User Story 4 - Circular Asset Allocation Chart (Priority: P4)

**Goal**: Replace stacked bar allocation chart with the circular donut chart on the dashboard.

**Independent Test**: Go to `/dashboard`, check that the allocation chart displays as a donut with percentage slices.

### Implementation for User Story 4

- [x] T010 [P] [US4] Update `src/components/ui/AllocationChart.tsx` to render the newly created `CircularAllocationChart` component instead of `allocation-bar`
- [x] T011 [US4] Refactor tooltip styles and legend alignment in `src/components/ui/CircularAllocationChart.tsx` to align neatly with the dashboard overview layout

**Checkpoint**: User Story 4 is functional. Dashboard correctly displays the donut allocation chart.

---

## Phase 7: User Story 5 - Delete & Logout Confirmation Modals (Priority: P5)

**Goal**: Deletes and Logout buttons trigger the confirmation modal dialog.

**Independent Test**: Click Logout or Delete, check that the glassmorphic modal blocks the UI and waits for user confirmation.

### Implementation for User Story 5

- [x] T012 [US5] Integrate `ConfirmationModal` with the Logout button in the header of `src/app/dashboard/DashboardLayoutClient.tsx` to prompt users before triggering the `signOut` Action
- [x] T013 [P] [US5] Verify that all delete operations in `src/app/dashboard/assets/AssetClient.tsx` and `src/app/dashboard/categories/CategoryClient.tsx` correctly prompt the user through the modal

**Checkpoint**: User Story 5 is functional. All confirmation modal flows are complete.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and styling adjustments

- [x] T014 Run validation scenarios in [quickstart.md](./quickstart.md) to check overall user experience
- [x] T015 Verify glassmorphic designs (borders, dark mode contrast, responsiveness) match premium UI UX guidelines
- [x] T023 Run verification scenarios in `quickstart.md` to test the ticker creation, edit, sync button, and Profit/Loss styling

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Can start after Foundational (Phase 2)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2)
- **User Story 4 (P4)**: Depends on US1/US3 data model names, but can be developed in parallel
- **User Story 5 (P5)**: Integrates modals into layouts/views developed in US1, US2, and US3.

### Parallel Opportunities

- T006 (Categories page server file) and T007 (Category Client page UI) can be developed in parallel once foundational elements are done.
- T010 (AllocationChart container) and T011 (legend refinements) can be developed in parallel once circular chart template is ready.

---

## Parallel Example: User Story 2

```bash
# Developer A builds the page routing server loader:
Task: "Create the category page route server file src/app/dashboard/categories/page.tsx"

# Developer B builds the Client-side Category management interface:
Task: "Create Client Component src/app/dashboard/categories/CategoryClient.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Collapsible sidebar & link structure)
4. Complete Phase 4: User Story 2 (Dedicated categories page CRUD)
5. **STOP and VALIDATE**: Verify collapsible sidebar and category CRUD page
6. Progressively implement row views, circular charts, and confirmation modals
