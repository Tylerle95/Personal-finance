# Feature Specification: BTC/SJC Header Pricing & Transaction Management

**Feature Branch**: `005-transactions-and-pricing`

**Created**: 2026-06-02

**Status**: Draft

**Input**: User description:
1. hiển thị giá BTC, SJC trên header bên cạnh Personal Finance
2. nhập hóa đơn: điện, nước, internet,... thu chi > có cột giao dịch từ ví/nguồn tiền nào > khi giao dịch nên trừ vào nguồn tiền đó > có left menu item cho giao dịch chi tiêu > hiển thị trong lịch sử giao dịch
3. thêm tài sản có thể cho phép chuyển từ tài sản nào (ví dụ mua USD, bitcoin từ tiền mặt hoặc ví)
4. trang Lịch sử giao dịch dạng paging load tối đa 20 giao dịch hiển thị

---

## Clarifications

### Session 2026-06-02
- Q: How should spending categories (e.g., electricity, water, internet) be managed and stored in the system? → A: Option A - Reusing `asset_categories` with a `type` column (values: `'asset' | 'spending'`) to support full custom CRUD for spending categories (colors, icons).
- Q: How should editing or deleting a transaction affect the wallet balance? → A: Option A - Automatically adjust (revert & apply). Deleting a transaction reverts the balance modification. Editing a transaction corrects the balance by reverting the old amount and applying the new amount.
- Q: What currency units and labels should be used to display the live BTC and SJC prices in the top header? → A: Option A - Mixed Standard. BTC in USD (e.g., `BTC: $67.4k`) and SJC in VND/lượng (e.g., `SJC: 89.5M ₫`).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Header Live Price Tickers (Priority: P1)

Users see live market price tickers for BTC (Bitcoin) and SJC (Gold) displayed in the application's top header right next to the "Personal Finance" brand name. The prices are fetched on page load and update automatically without blocking the UI.

**Why this priority**: Highly visible addition that gives users immediate market context.
**Independent Test**:
1. Open the application.
2. Verify that in the header, next to the "Personal Finance" text, there are two ticker badges: "BTC" and "SJC".
3. BTC is displayed in USD (e.g. `BTC: $67,450`) and SJC is displayed in VND per lượng (e.g. `SJC: 89.5M ₫`).
4. Verify that hovering over these badges shows the last sync time.

**Acceptance Scenarios**:
1. **Given** the user navigates to any page in the dashboard, **When** the header mounts, **Then** the live prices are fetched from the server and displayed with a subtle fade-in animation.
2. **Given** the live price api fails or rate-limits, **When** retrieving prices, **Then** the header displays the last cached prices or a grey fallback indicator without crashing the page.

---

### User Story 2 - Spending & Bill Entry with Wallet Integration (Priority: P1)

Users can input bill payments (electricity, water, internet) or regular income/expense transactions. Each transaction must specify a source wallet/account (e.g. Cash, bank account). Saving an expense automatically deducts from the balance of that source wallet, while saving an income adds to it. A new left menu item "Giao dịch chi tiêu" (Spending & Bills) leads to this log.

**Why this priority**: Essential core functionality for daily finance tracking. It integrates the static asset balances with active cash-flow logging.
**Independent Test**:
1. Navigate to the new sidebar item "Giao dịch chi tiêu".
2. Click "Nhập hóa đơn / Giao dịch".
3. Fill the form: Select Type = "Chi" (Expense), Category = "Điện" (Electricity), Wallet/Source = "Ví Tiền mặt" (which has 2,000,000 ₫ balance), Amount = 500,000 ₫.
4. Save and verify that:
   - A new transaction row appears in the spending list.
   - The balance of "Ví Tiền mặt" in "Tài sản & Số dư" is automatically updated to 1,500,000 ₫.

**Acceptance Scenarios**:
1. **Given** the user enters an expense transaction, **When** they select a source wallet, **Then** the source wallet balance is reduced by the transaction amount upon saving.
2. **Given** the user logs an income transaction, **When** they select a destination wallet, **Then** the wallet balance increases by the transaction amount upon saving.

---

### User Story 3 - Funding Assets from a Wallet (Priority: P2)

When adding or buying an investment asset (e.g. purchasing USD or Bitcoin), the user can choose which cash wallet/source account funded the purchase. The total cost of the investment is automatically deducted from that source wallet's balance.

**Why this priority**: Solves the problem of asset additions appearing "out of thin air" and keeps cash balances synchronized when purchasing assets.
**Independent Test**:
1. Navigate to the asset list and click "Thêm tài sản".
2. Fill: Category = "Crypto", Name = "Bitcoin", Ticker = "BTC", Quantity = 0.1, Purchase Price = 1,600,000,000 ₫.
3. In the "Nguồn thanh toán" (Payment Source) dropdown, select "Ví Ngân hàng" (which has 300,000,000 ₫ balance).
4. Save and verify that:
   - The new Bitcoin asset is added (0.1 BTC).
   - The "Ví Ngân hàng" balance is reduced by 160,000,000 ₫ (0.1 × 1.6B ₫), updating its balance to 140,000,000 ₫.
   - A 'buy' transaction is recorded in the transaction history.

**Acceptance Scenarios**:
1. **Given** the user buys an asset in USD (e.g. 100 USD at 25,000 rate) using a VND wallet, **When** the transaction is processed, **Then** the wallet balance is deducted by the converted VND value (2,500,000 ₫).

---

### User Story 4 - Paginated Transaction History (Priority: P2)

The transaction history page shows a list of all transactions (bills, income, asset buys/sells) in a unified list with pagination. It displays a maximum of 20 items per page to ensure fast load times.

**Why this priority**: Prevents slow queries and layout lag when the user accumulates hundreds or thousands of transactions over time.
**Independent Test**:
1. Open the "Lịch sử giao dịch" page.
2. Verify that all transactions are displayed as rows in a unified table.
3. If there are more than 20 transactions, verify that pagination controls (Trước/Sau or Page numbers) appear at the bottom.
4. Click "Sau" (Next) and verify that the next 20 items load quickly under 150ms.

**Acceptance Scenarios**:
1. **Given** the user has 45 transactions, **When** they load the page, **Then** they see items 1-20, and pagination links show "Trang 1/3" with "Trước" disabled and "Sau" enabled.

---

### Edge Cases

- **Insufficient Balance**: What happens if the user records an expense or asset purchase that exceeds the current balance of the selected wallet?
  - *Default behavior*: Allow the balance to go negative (as cash flow logs might be entered out of chronological order), but show a warning highlight on the wallet asset account.
- **Deleting/Editing Transactions**: If a bill or transfer transaction is edited or deleted, the wallet balance must be adjusted/reverted accordingly to prevent data discrepancies.
- **Asset/Wallet Deletion**: If a wallet is deleted, the transactions associated with it should either be soft-deleted or remain as logs with an "Unknown Source" label.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST fetch and display live market prices for BTC (in USD) and SJC Gold (in VND/lượng) in the top header using a client-side polling or server action endpoint.
- **FR-002**: System MUST add a database table `public.asset_transactions` to record all transactions (incomes, expenses, buys, sells, transfers) with relationships to `public.asset_accounts`.
- **FR-003**: System MUST introduce a sidebar navigation item "Giao dịch chi tiêu" pointing to `/dashboard/spending` where users can manage bill logs and expenses.
- **FR-004**: When creating a spending transaction (type = 'expense' or 'income'), the user MUST select a wallet/account from `public.asset_accounts` of cash/bank categories.
- **FR-005**: Saving an expense/income transaction MUST atomically update the selected wallet's `quantity` (balance) in the database.
- **FR-006**: When creating an asset account, the user MUST be allowed to choose a source account/wallet from the dropdown list.
- **FR-007**: Saving a funded asset account MUST automatically deduct the purchase amount (converted to wallet currency if needed) from the source account balance and create a matching 'buy' transaction log.
- **FR-008**: System MUST display a unified, paginated transaction history table at `/dashboard/transactions` (labeled "Lịch sử giao dịch" in menu) that loads a maximum of 20 transactions per page.
- **FR-009**: System MUST reuse the `asset_categories` table by adding a `type` column (values: `'asset' | 'spending'`) to support separate dynamic categories for assets and spending, with default type being `'asset'`.
- **FR-010**: System MUST automatically adjust the associated wallet's balance when a transaction is edited or deleted (reverting the old amount and applying the new amount).
- **FR-011**: System MUST display the BTC price in USD (e.g., `BTC: $67.4k` or `BTC: $67,450`) and the SJC price in VND per lượng (e.g., `SJC: 89.5M ₫` or `SJC: 89.5 Tr`).

### Key Entities

- **AssetTransaction**: Represents an individual log of money in/out or asset transfers.
  - Attributes: `id` (UUID), `user_id` (UUID), `account_id` (UUID - the wallet or the asset account), `source_account_id` (UUID - optional source wallet for transfers), `type` ('income' | 'expense' | 'buy' | 'sell' | 'transfer'), `category` (VARCHAR - e.g. 'electricity', 'water', 'food'), `amount` (Numeric - value in transaction currency), `quantity` (Numeric - asset units, if applicable), `price_per_unit` (Numeric - if applicable), `currency` (VARCHAR - e.g. 'VND', 'USD'), `transaction_date` (Date), `description` (Text), `created_at` (Timestamp).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Live tickers fetch and display within 300ms of header mount and poll every 60 seconds.
- **SC-002**: Transaction operations (inserting, updating, deleting) must update target wallet balances atomically and complete database operations under 100ms.
- **SC-003**: The transaction history page loads 20 records and page transition takes under 150ms.
- **SC-004**: Pagination state is preserved in the URL query parameters (e.g. `/dashboard/transactions?page=2`) so reloading the page retains the current view.

---

## Assumptions

- We assume the conversion rate between USD and VND is fixed at 25,000 VND/USD for simple balance deductions unless a live ticker is active.
- We assume that the user's existing asset accounts with cash/bank categories have positive balances to fund purchases, but the system will allow negative balances with warning labels.
