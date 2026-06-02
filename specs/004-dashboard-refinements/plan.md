# Implementation Plan: Dashboard & UI UX Refinements

**Branch**: `004-dashboard-refinements` | **Date**: 2026-06-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-dashboard-refinements/spec.md`

## Summary
Refactor the application shell and dashboard views to improve data scalability and visual aesthetics. Specifically, this plan implements:
1. Collapsible sidebar menu that displays only centered icons (no text labels) in collapsed mode.
2. Separate `/dashboard/categories` route for managing custom asset categories.
3. Row-based table view for "Lịch sử giao dịch" (formerly "Tài sản của tôi") instead of card grids to handle high density of items.
4. Circular SVG donut chart representing asset allocation percentages.
5. Reusable glassmorphic confirmation modal for delete actions and the header logout action.

---

## Technical Context

- **Language/Version**: TypeScript, React 19, Next.js 16.2.6
- **Primary Dependencies**: Tailwind CSS v4, Lucide React
- **Storage**: PostgreSQL (via Supabase Client SDK)
- **Testing**: Manual verification of visual layout and client states following scenarios in [quickstart.md](./quickstart.md)
- **Target Platform**: Desktop (Chrome/Firefox/Safari) and responsive Mobile layout (< 640px)
- **Project Type**: Web Application
- **Performance Goals**: Transitions rendered at 60fps, page loads and updates executed under 200ms
- **Constraints**: Glassmorphic styling system (blur, borders, color harmony)

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Library-First**: N/A (Standard application layout update).
- **Simplicity**: Kept simple by utilizing native SVG elements for charting rather than importing bloated external chart packages.
- **TDD/Verification**: Fully testable through clear end-to-end interactive manual verification scenarios.

---

## Project Structure

### Documentation (this feature)

```text
specs/004-dashboard-refinements/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/
│   └── interfaces.md    # Component interface contracts
└── tasks.md             # Phase 2 output (to be generated)
```

### Source Code

```text
src/
├── app/
│   ├── actions/
│   │   └── auth.ts
│   └── dashboard/
│       ├── layout.tsx
│       ├── DashboardLayoutClient.tsx
│       ├── page.tsx
│       ├── DashboardClient.tsx
│       ├── assets/
│       │   └── AssetClient.tsx
│       └── categories/             # [NEW]
│           └── page.tsx            # [NEW]
│           └── CategoryClient.tsx  # [NEW]
├── components/
│   └── ui/
│       ├── AllocationChart.tsx     # [MODIFY]
│       ├── CircularAllocationChart.tsx # [NEW]
│       └── ConfirmationModal.tsx   # [NEW]
```

**Structure Decision**: Refactor layout and client components directly inside `src/app/dashboard` and create reusable UI elements in `src/components/ui/`.

---

## Proposed Changes

### 1. Reusable UI Components

#### [NEW] [ConfirmationModal.tsx](file:///Users/tylerle/Documents/Me/Personal-finance/src/components/ui/ConfirmationModal.tsx)
Create a reusable, premium glassmorphic modal overlay containing a title, details message, and "Xác nhận" / "Hủy" buttons. Shows loading state during server action pending states.

#### [NEW] [CircularAllocationChart.tsx](file:///Users/tylerle/Documents/Me/Personal-finance/src/components/ui/CircularAllocationChart.tsx)
Build a donut-style allocation chart using inline SVG `<circle>` elements with configurable `strokeDasharray` and `strokeDashoffset` dynamically calculated from category percentages. Features smooth hover transitions and custom tooltips showing names/values.

#### [MODIFY] [AllocationChart.tsx](file:///Users/tylerle/Documents/Me/Personal-finance/src/components/ui/AllocationChart.tsx)
Update the allocation chart wrapper to render the circular donut chart instead of the stacked-bar component.

---

### 2. Application Layout and Sidebar

#### [MODIFY] [DashboardLayoutClient.tsx](file:///Users/tylerle/Documents/Me/Personal-finance/src/app/dashboard/DashboardLayoutClient.tsx)
- Refactor the sidebar rendering: when `isSidebarExpanded` is false, hide the text `span` elements, shrink widths, and change flex direction/padding to only show centered menu icons.
- Add tooltips to menu icons in collapsed mode.
- Add "Danh mục của tôi" navigation link to `/dashboard/categories`.
- Wrap the Sign Out submission action with the new `ConfirmationModal` to prompt users before logging out.

---

### 3. Categories Management Route

#### [NEW] [page.tsx](file:///Users/tylerle/Documents/Me/Personal-finance/src/app/dashboard/categories/page.tsx)
Add the page server component fetching user categories from Supabase, then passing them to the Client Component.

#### [NEW] [CategoryClient.tsx](file:///Users/tylerle/Documents/Me/Personal-finance/src/app/dashboard/categories/CategoryClient.tsx)
Create the client-side UI displaying the categories list in a clean table or row layout and a glassmorphic sidebar/top form to add/edit categories. Deletes trigger the confirmation modal.

---

### 4. Transaction History Page (Renamed Assets)

#### [MODIFY] [AssetClient.tsx](file:///Users/tylerle/Documents/Me/Personal-finance/src/app/dashboard/assets/AssetClient.tsx)
- Rename the page heading from "Tài sản của tôi" to "Lịch sử giao dịch".
- Replace `<div className="assets-grid">` with an HTML `<table>` displaying asset holdings in clean rows with columns: Name, Category, Date, Value, Actions.
- Wrap deletion triggers with the `ConfirmationModal` before invoking the `deleteAssetAccount` Server Action.

---

## Verification Plan

### Manual Verification
Validate all interactive states following the verification flows in [quickstart.md](./quickstart.md):
- Desktop Collapsed/Expanded states for YouTube-style sidebar layout.
- Access `/dashboard/categories` route, CRUD categories, verify RLS policies work.
- Access `/dashboard/assets` (Transaction History), check row-based desktop & mobile responsiveness.
- Check Donut Chart render and hover tooltips on `/dashboard`.
- Verify Confirmation Modals trigger for delete operations and the logout button.
