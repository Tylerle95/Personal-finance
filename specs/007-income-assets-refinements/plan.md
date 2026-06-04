# Implementation Plan: Asset and Income Dashboard Refinements

**Branch**: `007-income-assets-refinements` | **Date**: 2026-06-04 | **Spec**: [specs/007-income-assets-refinements/spec.md](file:///Users/tylerle/Documents/Me/Personal-finance/specs/007-income-assets-refinements/spec.md)

## Summary

This plan outlines the technical approach to routing income to non-wallet assets (converting fiat amount to asset quantity based on unit price), showing physical asset quantities upon selecting segments in the donut chart, and implementing search filtering and date-based sorting for assets.

## Technical Context

- **Language/Version**: TypeScript / Next.js 14+ (App Router)
- **Primary Dependencies**: React 19, Lucide Icons, Supabase SSR client
- **Storage**: Supabase (PostgreSQL)
- **Testing**: Manual Verification / Playwright (optional)
- **Target Platform**: Web Browsers (Chrome, Safari, Firefox)
- **Project Type**: Next.js Web application
- **Performance Goals**: Instant client-side sorting & filtering (<50ms)
- **Constraints**: Maintain transaction history integrity and atomic database balance operations.

## Constitution Check

*GATE: Passes all design principles. All data calculations and updates are performed atomically and accurately. No complex external libraries are added.*

## Project Structure

### Documentation (this feature)

```text
specs/007-income-assets-refinements/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Design decisions and alternatives
├── data-model.md        # DB tables and columns description
└── quickstart.md        # Setup & manual testing instructions
```

### Source Code

```text
src/
├── app/
│   ├── actions/
│   │   └── transactions.ts   # Create, Update, Delete Transaction actions
│   └── dashboard/
│       └── assets/
│           └── AssetClient.tsx # Assets List and Add Income Modal
├── components/
│   └── ui/
│       ├── CircularAllocationChart.tsx # Net Worth Donut Chart
│       └── AllocationChart.tsx         # Chart wrapper
└── lib/
    ├── data/
    │   └── assets.ts         # Net Worth aggregation logic
    └── types/
        └── assets.ts         # Type declarations (AllocationItem)
```

## Proposed Changes

---

### Component: Data Layer & Aggregation

#### [MODIFY] [assets.ts](file:///Users/tylerle/Documents/Me/Personal-finance/src/lib/types/assets.ts)
- Add `assets` array to `AllocationItem` interface:
  ```typescript
  export interface AllocationItem {
    category_id: string
    label: string
    totalValue: number
    percentage: number
    color: string
    icon: string
    assets?: {
      name: string
      quantity: number
      ticker: string | null
      currency: string
    }[]
  }
  ```

#### [MODIFY] [assets.ts](file:///Users/tylerle/Documents/Me/Personal-finance/src/lib/data/assets.ts)
- Update `getNetWorthSummary()` to group assets inside each category and attach the list to the resulting `AllocationItem` array.

---

### Component: Transaction Server Actions

#### [MODIFY] [transactions.ts](file:///Users/tylerle/Documents/Me/Personal-finance/src/app/actions/transactions.ts)
- **`createTransaction`**:
  - Fetch target account details (including its category).
  - If the target account is a non-wallet asset:
    - Validate `unit_price > 0` (otherwise throw an error).
    - Calculate `quantity_change = amount / unit_price`.
    - Set `quantity = quantity_change` and `price_per_unit = unit_price` in the transaction insertion.
    - Adjust asset account balance by adding `quantity_change` directly to the asset's `quantity`.
- **`deleteTransaction`**:
  - Revert balance adjustment:
    - If the transaction type is `'income'`:
      - If target account is a non-wallet asset, deduct `tx.quantity` from asset `quantity`.
      - If target account is a wallet, deduct `tx.amount` from wallet balance (using existing cash logic).
- **`updateTransaction`**:
  - Correctly calculate difference and apply similar wallet/asset logic for balance updates.

---

### Component: Assets Dashboard Interface

#### [MODIFY] [AssetClient.tsx](file:///Users/tylerle/Documents/Me/Personal-finance/src/app/dashboard/assets/AssetClient.tsx)
- **Income Modal (`modalMode === 'income'`)**:
  - Populate the dropdown with both wallets and other asset accounts.
  - Group them using `<optgroup label="Ví & Tài khoản ngân hàng">` and `<optgroup label="Tài sản khác">`.
- **Assets Table Toolbar**:
  - Implement a modern toolbar directly above the assets list table.
  - Add category filter dropdown (`Lọc danh mục`).
  - Add sort field dropdown (`Sắp xếp theo`) containing "Ngày sở hữu", "Tổng giá trị", and "Tên tài sản".
  - Add sort order toggle button (Ascending/Descending).
- **Client-Side Filtering and Sorting**:
  - Perform `.filter()` and `.sort()` on `accounts` in React state before rendering table rows.

---

### Component: Donut Chart Visualization

#### [MODIFY] [CircularAllocationChart.tsx](file:///Users/tylerle/Documents/Me/Personal-finance/src/components/ui/CircularAllocationChart.tsx)
- Enable clicking on slices to toggle/lock segment selection.
- If a segment is selected, render a clean card below the chart:
  - Display heading: `"Chi tiết tài sản: [Category Name]"`
  - List all assets in that category with their quantities (e.g. `0.4 BTC`, `10 lượng SJC`) and fiat values.

## Verification Plan

### Automated Tests
- Run `npm run lint` to ensure typescript and eslint compliance.
- Run `npm run build` to verify no compilation errors.

### Manual Verification
- Log income to a wallet and verify cash quantity updates.
- Log income to an asset (e.g., Bitcoin) and verify physical quantity increases based on unit price.
- Verify pie chart displays names and quantities below it when clicking segments.
- Verify filtering and sorting by ownership date works dynamically.
