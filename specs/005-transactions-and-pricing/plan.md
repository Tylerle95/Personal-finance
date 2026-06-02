# Implementation Plan: BTC/SJC Header Pricing & Transaction Management

**Branch**: `005-transactions-and-pricing` | **Date**: 2026-06-02 | **Spec**: [spec.md](file:///Users/tylerle/Documents/Me/Personal-finance/specs/005-transactions-and-pricing/spec.md)

## Summary
Implement real-time header pricing tickers for BTC and SJC Gold, collapsible submenu for Category Management on the Sidebar, separate income tracking into "Tài sản & Số dư" with custom income categories (`type = 'income'`), restrict "Chi tiêu & Hóa đơn" to expense-only entries, and support paginated transaction logs (max 20 per page).

## Technical Context

**Language/Version**: TypeScript / Next.js (App Router, React 19)

**Primary Dependencies**: Tailwind CSS, Lucide React, Supabase Client

**Storage**: PostgreSQL (via Supabase)

**Testing**: Manual E2E verification

**Target Platform**: Web (Responsive Desktop & Mobile)

**Project Type**: Next.js Web App

**Performance Goals**: 
- Price ticks fetched <300ms on header load.
- Paginated transaction records retrieved <150ms.

**Constraints**:
- Keep transactions page limited to 20 items per page.
- Do not allow income type transactions inside "Chi tiêu & Hóa đơn".

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No principle violations. The architecture follows Next.js client-server action separation and adheres to the established database schema designs.

## Project Structure

### Documentation (this feature)
```text
specs/005-transactions-and-pricing/
├── spec.md              # Feature specification
├── plan.md              # Implementation Plan (This file)
├── research.md          # Phase 0 Research
├── data-model.md        # Phase 1 Data Model & DB schemas
├── quickstart.md        # Phase 1 Setup & local verification guide
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code Modifications
```text
src/
├── app/
│   ├── actions/
│   │   ├── assets.ts          # Updated category validation & getHeaderRates
│   │   └── transactions.ts    # Enforce expense-only logic in spending context
│   ├── dashboard/
│   │   ├── DashboardLayoutClient.tsx  # Add collapsible sidebar submenu
│   │   ├── assets/
│   │   │   ├── page.tsx
│   │   │   └── AssetClient.tsx        # Add "Nhập thu nhập" form & "Danh mục tài sản" renaming
│   │   ├── categories/
│   │   │   ├── page.tsx
│   │   │   └── CategoryClient.tsx     # Add query-based tab switching for type = asset | spending | income
│   │   ├── spending/
│   │   │   ├── page.tsx
│   │   │   └── SpendingClient.tsx     # Rename to "Danh mục chi tiêu", disable income inputs
│   │   └── transactions/
│   │       ├── page.tsx               # Add server-side pagination (limit=20)
│   │       └── TransactionsClient.tsx # Add pagination controls (Trước/Sau)
├── lib/
│   ├── types/
│   │   └── assets.ts          # Update AssetCategory types for 'income'
│   └── data/
│       └── transactions.ts    # Paginated query helpers
```

**Structure Decision**: Fully integrated single-repo architecture. All client states and actions map cleanly to existing modules.
