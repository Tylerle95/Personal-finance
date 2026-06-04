# Data Model: Auto-Format Amount Inputs

This feature does not alter the database schema. All data continues to map to the existing tables in Supabase:

## Existing Entities & Mapped Fields

### 1. `asset_accounts`
- **`quantity`** (Numeric/Float): Stores the cash account balances/starting values, or the unit quantity of non-cash assets.
  - Cash Category: User enters formatted cash value (e.g. `33.000.000`), which is cleaned to `33000000` and saved as `quantity`.
  - Non-Cash Category: User enters quantity (e.g. `0.5` BTC), which is submitted directly as a number.
- **`purchase_unit_price`** (Numeric/Float): Stores the unit purchase price of non-cash assets.
  - User enters unit price (e.g. `1,250.5` USD), which is cleaned to `1250.5` and saved as `purchase_unit_price`.

### 2. `asset_transactions`
- **`amount`** (Numeric/Float): Stores the value of a transaction.
  - Spendings / Incomes: User enters amount (e.g. `100.000`), which is cleaned to `100000` and saved as `amount`.

## Validation Rules
- **VND Currency**: Reject non-integer input (e.g. strip decimal points).
- **USD Currency**: Limit to a single decimal separator (e.g. keep first dot, discard subsequent dots).
- **Non-Negative**: Value must be `>= 0` (handled by both the client inputs and database constraints).
