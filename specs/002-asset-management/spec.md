# Feature Specification: Asset & Account Management

**Feature Branch**: `002-asset-management`

**Created**: 2026-06-01

**Status**: Draft

**Input**: User description: "tạo loại tài sản > nó nên đi theo tài khoản, ví dụ như vàng, stock, crypto"

## Clarifications

### Session 2026-06-01
- Q: How does category management work? → A: Dedicated `AssetCategory` entity managed by user, linked to `AssetAccount`.
- Q: Accessing category management interface → A: Integrated button/tab on Assets screen (`/dashboard/assets`).
- Q: Initial seeding of categories for new users → A: Empty by default, user must create their first category.
- Q: Selection of color and icon properties for categories → A: Predefined palette of 8-12 colors and 10-15 finance icons.
- Q: Currency Selector & Multi-currency Support → A: Fixed Exchange Rate (Add currency selector VND/USD, convert USD to VND using a fixed rate of 25,000 VND).
- Q: Asset Form Fields for Cash/Bank Accounts vs. Investments → A: Dynamic Form Fields (Hide Quantity/Unit Price and show a single "Balance" field for cash/bank categories, setting unit_price = 1 and quantity = balance under the hood).
- Q: Status of Asset Transaction History (User Story 3) → A: Defer to Future Phase (User Story 3 is deferred to V2; users will update balances manually by editing asset accounts).
- Q: Removing "Tên tài sản" (Asset Name) Field → A: Optional Name (Make the field optional; if left blank, it defaults to the Category name).
- Q: Implementation of "Ngày mua" (Purchase Date) Field → A: Date-Only Field (Store as DATE in Postgres; UI features a date picker defaulting to the current date).






## User Scenarios & Testing *(mandatory)*

### User Story 1 - Asset Category & Account Creation (Priority: P1)

Users can create custom Asset Categories (e.g. named "Vàng SJC", "Crypto Altcoins", "Ngân hàng") by selecting a color and icon from a predefined list. Then, users can create and manage different accounts representing their assets belonging to those custom categories.

**Why this priority**: Core asset tracking capability. Users must be able to define their own categories and log holdings under them before any analysis or dashboard view can occur.

**Independent Test**:
1. Navigate to the Asset Accounts screen, click "Manage Categories", click "Add Category", enter name "Crypto Altcoins", select a color (e.g., Violet) and an icon (e.g., Coins), and save.
2. Click "Add Account", select category "Crypto Altcoins", enter details (Asset Name: "Ethereum", Quantity: 2.5, Current Unit Price: 85,000,000 VND), and verify it appears correctly in the assets list under the "Crypto Altcoins" category with a total value of 212,500,000 VND.

**Acceptance Scenarios**:

1. **Given** the user has created a category "Vàng", **When** they click "Add Account", select category "Vàng", enter name "SJC Gold", quantity "5", and current unit price "90,000,000 VND", **Then** the gold asset account is created successfully and displays in the list with a total valuation of 450,000,000 VND.
2. **Given** the user has an existing "Stock" category and a stock account for "FPT" under it, **When** they edit the unit price from "130,000 VND" to "140,000 VND", **Then** the total value of the FPT stock asset is updated to reflect the new valuation.

---

### User Story 2 - Net Worth Dashboard & Asset Allocation (Priority: P2)

Users see a visual summary of their total net worth and the distribution of their assets across different custom asset categories.

**Why this priority**: Provides the primary user value of net worth tracking, showing asset distribution based on user's own categories.

**Independent Test**: Create custom categories ("Cash", "Gold", "Crypto"), add multiple asset accounts of these categories, navigate to the main Dashboard, and verify that the Net Worth summary and the Asset Allocation chart match the sum of all active accounts grouped by their custom category.

**Acceptance Scenarios**:

1. **Given** the user has 10,000,000 VND in "Cash" category account and 90,000,000 VND in "Gold" category account, **When** they view the Dashboard, **Then** they see their Total Net Worth as 100,000,000 VND, with a chart showing 90% Gold and 10% Cash.

---

### User Story 3 - Asset Transaction History (Priority: P3 - DEFERRED)

> [!NOTE]
> This story is deferred to a future phase (V2) as resolved in clarifications.

Users can record buy/sell transactions on their asset accounts, which automatically adjusts the holdings quantity.

**Why this priority**: Automates the balance updates over time instead of requiring users to manually recalculate and edit the quantity.

**Independent Test**: Go to a specific asset account, add a "Buy" transaction for a certain quantity and price, and verify that the account's total quantity increases by that amount.

**Acceptance Scenarios**:

1. **Given** the user has a Stock account with 100 shares, **When** they record a "Sell" transaction of 30 shares, **Then** the stock account quantity automatically decreases to 70 shares.

---

### Edge Cases

- **Zero or Negative Quantity**: What happens if the user enters a quantity of 0 or negative for a new asset? The system must reject the submission and show a validation error.
- **Empty Category List**: When adding an asset account, if no category exists, the user must be prompted to create a category first before they can create a single asset account.
- **Price Fluctuation & Historical Logs**: How does the system handle asset value over time? For MVP, the current net worth is calculated using the latest entered unit price. Historical asset value tracking is out of scope for v1.
- **Decimal Precision**: Crypto assets (like Bitcoin) require up to 8 decimal places (e.g., 0.00234567 BTC). The system must support high-precision decimal quantities.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to manage (Create, Read, Update, Delete) custom Asset Categories (with Name, Color, and Icon).
- **FR-002**: System MUST provide a predefined palette of 8-12 colors and 10-15 finance icons for custom categories.
- **FR-003**: System MUST require each Asset Account to belong to a custom Asset Category.
- **FR-004**: System MUST allow users to input details for each asset: Name (optional, defaulting to Category name if blank), Category, Quantity, Unit Price, and Currency (VND or USD).
- **FR-005**: System MUST calculate and display the total value of each asset account (Quantity × Unit Price).
- **FR-006**: System MUST calculate and display the user's Total Net Worth (sum of all asset account values).
- **FR-007**: System MUST support high-precision decimal inputs for asset quantities (up to 8 decimal places).
- **FR-008**: System MUST show a breakdown visualization (e.g., pie chart or progress bars) representing asset allocation percentages grouped by custom categories.
- **FR-009**: For USD assets, the system MUST automatically convert the valuation to VND using a fixed exchange rate of 1 USD = 25,000 VND for display in the Net Worth calculation and charts.
- **FR-010**: System MUST dynamically adapt form fields in the Add/Edit Asset modal. If the category name matches cash/bank keywords (e.g., "Tiền mặt", "Ngân hàng", "Cash", "Bank", "Ví"), it MUST hide "Số lượng" and "Đơn giá" fields, display a single "Số dư / Giá trị" (Balance/Value) field, and store `unit_price = 1` and `quantity = [Balance]` in the database.
- **FR-011**: System MUST support a "Ngày mua / Ngày sở hữu" (Purchase Date) field for each asset. It MUST default to the current date in the UI and be stored as a `DATE` column in the database.

### Key Entities *(include if feature involves data)*

- **AssetCategory**: Represents a user'defined asset category.
  - Attributes: `id` (UUID), `user_id` (UUID), `name` (Text), `color` (Text - color code or name), `icon` (Text - icon name), `created_at` (Timestamp).
- **AssetAccount**: Represents an asset holding or account.
  - Attributes: `id` (UUID), `user_id` (UUID), `name` (Text), `category_id` (UUID, references `AssetCategory`), `quantity` (Numeric), `unit_price` (Numeric), `currency` (Text), `purchase_date` (Date), `created_at` (Timestamp).
- **AssetTransaction** (P3): Represents a log of buying/selling activity.
  - Attributes: `id` (UUID), `account_id` (UUID), `type` (Enum: Buy, Sell), `quantity` (Numeric), `price_per_unit` (Numeric), `transaction_date` (Timestamp).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a new category and an asset account in under 30 seconds.
- **SC-002**: The net worth dashboard page loads and renders the asset allocation chart in under 1 second.
- **SC-003**: Asset values are dynamically updated and recalculated in the UI immediately upon editing quantity or unit price.

## Assumptions

- Gold, stocks, and crypto prices are updated manually by the user (no live external API integration for automated asset price updates in MVP).
- The base display currency for Net Worth calculation is VND. USD assets are converted to VND using a fixed rate of 1 USD = 25,000 VND.

