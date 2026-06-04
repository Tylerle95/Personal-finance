# Feature Specification: Asset and Income Dashboard Refinements

**Feature Branch**: `007-income-assets-refinements`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "1. có tính năng input thu nhập > cho phép chỉ định ví hoặc tài sản nào đó vào thu nhập
2. ở phần tổng quan thiết kế giúp mình khi bấm trên chart tròn có thể hiển thị thêm số lượng của tài sản: ví dụ 0.4, ...
3. Tài sản & Số dư cho phép filter thêm danh mục, sort Ngày sở hữu"

## Clarifications

### Session 2026-06-04
- Q: How should the system handle the amount input and adjust the asset's quantity when income is logged directly into a non-wallet asset? → A: User inputs amount in fiat; system calculates quantity as `amount / current_price`.
- Q: Nên hiển thị chi tiết số lượng tài sản ở vị trí nào khi bấm chọn phân đoạn biểu đồ tròn? → A: Hiển thị danh sách chi tiết tên tài sản và số lượng ở bên dưới biểu đồ khi chọn phân đoạn.
- Q: Nên đặt các nút chọn Bộ lọc danh mục và Sắp xếp ở vị trí nào trên giao diện? → A: Tạo một thanh công cụ (toolbar) mới ngay phía trên bảng danh sách tài sản.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Log Income to Wallet or Asset (Priority: P1)

As a user, I want to log my income and select which wallet (cash/bank) or specific asset (e.g. stock, crypto, gold) receives this income, so that my accounts stay updated automatically.

**Why this priority**: Core requirement allowing users to route incoming funds directly to assets or wallets, ensuring accurate tracking of net worth.

**Independent Test**: Can be tested by opening the "Nhập thu nhập" modal, choosing an asset (e.g., Bitcoin) instead of a wallet, entering an income amount, and verifying that the asset's quantity and total value increase correctly.

**Acceptance Scenarios**:

1. **Given** the user is on the Assets page and opens the "Nhập thu nhập" modal, **When** they open the "Tài khoản nhận / Ví" dropdown, **Then** they see both wallets and other assets listed and grouped.
2. **Given** the user logs income of 10,000,000 VND to a Gold asset with a current unit price of 2,500,000 VND, **When** the transaction is saved, **Then** the Gold asset quantity increases by 4 units and the transaction is recorded under that asset.

---

### User Story 2 - View Asset Quantities on Pie Chart Interaction (Priority: P2)

As a user, I want to click or select a slice in the net worth donut chart to view the quantities of assets in that category, so that I can see my physical holdings (e.g., 0.4 BTC) alongside their fiat value.

**Why this priority**: Improves usability by displaying asset physical metrics (quantities) directly in the high-level chart view.

**Independent Test**: Can be fully tested by clicking on the "Crypto" slice of the net worth chart on the dashboard and verifying that the details area displays "0.4 BTC" (or the exact holdings).

**Acceptance Scenarios**:

1. **Given** a user is viewing the net worth donut chart, **When** they click on a category segment, **Then** a detail panel or center overlay displays the specific assets and their quantities (e.g., "0.4 BTC", "10 lượng SJC").

---

### User Story 3 - Filter and Sort Assets & Balances (Priority: P2)

As a user, I want to filter my assets list by category and sort them by Ownership Date (Ngày sở hữu) or Total Value, so that I can easily analyze my holdings.

**Why this priority**: Essential for portfolio organization and historical analysis when the number of assets grows.

**Independent Test**: Can be tested by selecting a category filter (e.g. "Crypto") on the assets table, sorting by "Ngày sở hữu" (Ascending), and verifying the correct items are displayed in date order.

**Acceptance Scenarios**:

1. **Given** a user has multiple assets in different categories, **When** they choose a category filter, **Then** only assets belonging to that category are shown.
2. **Given** a list of assets, **When** they sort by "Ngày sở hữu" (descending), **Then** the assets purchased most recently appear at the top.

---

### Edge Cases

- **Converting income to asset quantity**: When income in fiat (VND/USD) is routed to a non-fiat asset (e.g. gold, crypto), how is the quantity addition calculated?
  - *Default behavior*: The quantity is calculated as `amount / unit_price` (using the asset's current price).
- **Unit price is zero**: If an asset's unit price is zero or not set, routing income directly to it should fall back to quantity = 1 and price = amount, or throw an error.
  - *Default behavior*: If `unit_price` is 0, the system displays an error asking the user to update the asset price first.
- **Empty Filter state**: When a category filter has no matching assets, a clear empty state must be shown in the table.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The income logging modal MUST allow selecting either a wallet or an asset as the target account.
- **FR-002**: Non-wallet assets MUST calculate quantity adjustments when receiving income: `new_quantity = current_quantity + (income_amount / asset_unit_price)`.
- **FR-003**: The net worth donut chart segment click interaction MUST display a list of assets and their quantities in a detailed list directly below the chart.
- **FR-004**: The Assets & Balances table MUST include a toolbar directly above the table with a category filter dropdown, a sort field dropdown, and a sort order toggle button.
- **FR-005**: The Assets & Balances table MUST support sorting by "Ngày sở hữu" (purchase_date) in both ascending and descending order.
- **FR-006**: The sorting mechanism MUST support fallback fields like total value and name.

### Key Entities *(include if feature involves data)*

- **AssetCategory**: Represents the category of the asset (e.g. Wallet, Stock, Crypto).
- **AssetAccount**: Represents a specific wallet or asset holding with a quantity and unit price.
- **AssetTransaction**: Represents a financial event (e.g., income transaction linked to an AssetAccount).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can filter and sort the assets table instantly in under 100ms.
- **SC-002**: Asset quantities are displayed on the donut chart segment select interaction.
- **SC-003**: Logging income to an asset correctly updates the quantity and total value in a single atomic database operation.

## Assumptions

- Currency conversion between USD and VND uses a fixed exchange rate of 25,000 VND/USD for calculations.
- Asset quantities are displayed with up to 8 decimal places for crypto assets, and standard formatting for others.
