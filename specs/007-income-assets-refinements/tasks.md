# Tasks: Asset and Income Dashboard Refinements

**Input**: Design documents from `/specs/007-income-assets-refinements/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure verification

- [x] T001 Verify local environment and current schema config

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T002 Add assets field to AllocationItem interface in src/lib/types/assets.ts
- [x] T003 Update getNetWorthSummary in src/lib/data/assets.ts to group assets within each category and populate the assets array

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Log Income to Wallet or Asset (Priority: P1) 🎯 MVP

**Goal**: Allow logging income to either a wallet or an asset account with automatic balance conversion for non-wallet assets.

**Independent Test**: Log a VND income transaction to a Crypto/Stock asset (e.g., BTC with a known unit price) in the Assets page modal and verify its quantity updates by `amount / unit price`.

### Implementation for User Story 1

- [x] T004 [US1] Update createTransaction server action in src/app/actions/transactions.ts to handle non-wallet assets
- [x] T005 [US1] Update deleteTransaction server action in src/app/actions/transactions.ts to revert non-wallet asset income balance correctly
- [x] T006 [US1] Update updateTransaction server action in src/app/actions/transactions.ts to handle non-wallet asset income balance changes
- [x] T007 [P] [US1] Update target account selection in src/app/dashboard/assets/AssetClient.tsx to group wallets and assets using optgroup tags

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - View Asset Quantities on Pie Chart Interaction (Priority: P2)

**Goal**: Click/select a slice in the net worth donut chart to show name & physical quantity details of assets in that category below the chart.

**Independent Test**: Click on the "Crypto" category segment on the dashboard chart and check that the detail card below displays "0.4 BTC" (or the exact asset holdings).

### Implementation for User Story 2

- [x] T008 [US2] Update src/components/ui/CircularAllocationChart.tsx to support toggling segment selection on click
- [x] T009 [P] [US2] Update src/components/ui/CircularAllocationChart.tsx to render a detailed card of asset names and quantities below the donut chart when selected

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Filter and Sort Assets & Balances (Priority: P2)

**Goal**: Filter the assets table by category and sort them by Ownership Date (Ngày sở hữu) or Total Value.

**Independent Test**: Filter by "Crypto" and sort by "Ngày sở hữu" (Ascending) in the Assets view toolbar, verifying that the displayed items are crypto-only and ordered by date.

### Implementation for User Story 3

- [x] T010 [US3] Add React state for filtering and sorting in src/app/dashboard/assets/AssetClient.tsx
- [x] T011 [P] [US3] Add a toolbar with category filter dropdown, sort field dropdown, and sort order toggle in src/app/dashboard/assets/AssetClient.tsx
- [x] T012 [US3] Filter and sort the accounts array client-side before rendering table rows in src/app/dashboard/assets/AssetClient.tsx

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T013 Run lint checks (npm run lint) and check for TypeScript errors
- [x] T014 Run build check (npm run build) to ensure no build compilation issues
- [x] T015 Validate features manually using specs/007-income-assets-refinements/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2)

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Models/UI within a story marked [P] can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories
