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

### 4. Transaction History Page (Renamed Assets) & Live Price Synchronization

#### [NEW] [market-prices.ts](file:///Users/tylerle/Documents/Me/Personal-finance/src/lib/services/market-prices.ts)
Create a server-side service `src/lib/services/market-prices.ts` to fetch live prices:
- **Gold**: Call `https://www.vang.today/api/prices` and match SJC/DOJI prices.
- **Crypto**: Call Binance public price API `https://api.binance.com/api/v3/ticker/price?symbol=${ticker}USDT`, converting USD to VND at 25,000 exchange rate.
- **Stocks**: Fetch stock codes from public VNDirect/TCBS boards.

#### [MODIFY] [AssetClient.tsx](file:///Users/tylerle/Documents/Me/Personal-finance/src/app/dashboard/assets/AssetClient.tsx)
- Rename the page heading from "Tài sản của tôi" to "Lịch sử giao dịch".
- Replace `<div className="assets-grid">` with an HTML `<table>` displaying asset holdings in clean rows with columns: Tài sản, Danh mục, Ngày sở hữu, Số lượng, Giá mua, Giá hiện tại, Lời/Lỗ, Tổng giá trị, Thao tác.
- Hide "Giá hiện tại" input in creation/edit forms and add an optional **"Mã Ticker"** (`ticker`) input field (e.g. `BTC`, `HPG`, `SJC`) for investment categories.
- Add a **"Đồng bộ giá"** (Sync Prices) button on the desktop layout that triggers price synchronization.
- Calculate Profit/Loss dynamically: `(unit_price - purchase_unit_price) * quantity` along with percentage `((unit_price - purchase_unit_price) / purchase_unit_price) * 100` and apply green/red styling contextually (grey/disabled for cash assets).
- Wrap deletion triggers with the `ConfirmationModal` before invoking the `deleteAssetAccount` Server Action.

#### [MODIFY] [assets.ts](file:///Users/tylerle/Documents/Me/Personal-finance/src/app/actions/assets.ts)
- Modify `createAssetAccount` to read `purchase_unit_price` and `ticker` from `formData`, validate them, set initial `unit_price` (either fetched from live API or defaulted), and insert them into the database.
- Modify `updateAssetAccount` to support updating `purchase_unit_price` and `ticker`.
- Add a new server action `syncAssetPrices` that finds all accounts with a `ticker`, fetches their latest prices using `market-prices.ts`, updates the database `unit_price` values, and triggers page revalidation.

#### [MODIFY] [assets.ts](file:///Users/tylerle/Documents/Me/Personal-finance/src/lib/types/assets.ts)
- Add `purchase_unit_price: number` and `ticker: string | null` to the `AssetAccount` interface definition.

---

### 5. Database Schema Migration

#### [MODIFY] [Database Migration (PostgreSQL)](file:///Users/tylerle/Documents/Me/Personal-finance/specs/004-dashboard-refinements/data-model.md)
Add SQL migration query to insert `purchase_unit_price` and `ticker` columns in `asset_accounts` table:
```sql
ALTER TABLE public.asset_accounts 
ADD COLUMN IF NOT EXISTS purchase_unit_price NUMERIC NOT NULL DEFAULT 0;

ALTER TABLE public.asset_accounts 
ADD COLUMN IF NOT EXISTS ticker VARCHAR(20);

-- Populate existing rows where purchase_unit_price is default/unset
UPDATE public.asset_accounts 
SET purchase_unit_price = unit_price 
WHERE purchase_unit_price = 0;
```

---

## Verification Plan

### Manual Verification
Validate all interactive states following the verification flows in [quickstart.md](./quickstart.md):
- Desktop Collapsed/Expanded states for YouTube-style sidebar layout.
- Access `/dashboard/categories` route, CRUD categories, verify RLS policies work.
- Access `/dashboard/assets` (Transaction History), check row-based desktop & mobile responsiveness.
- Verify creating investment assets with tickers (e.g. `BTC`, `HPG`, `SJC`) automatically fetches and stores their current market price.
- Click "Đồng bộ giá" button, verify prices sync and Profit/Loss values recalculate dynamically.
- Verify Profit/Loss indicators are color-coded (green for positive, red for negative, neutral/disabled for cash).
- Check Donut Chart render and hover tooltips on `/dashboard`.
- Verify Confirmation Modals trigger for delete operations and the logout button.
