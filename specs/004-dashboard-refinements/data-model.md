# Data Model: Dashboard & UI UX Refinements

No new database tables are introduced for this feature. We continue to leverage the existing `asset_categories` and `asset_accounts` tables.

## Existing Schema Reference

### 1. `asset_categories` Table
Stores custom asset categories.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key referencing `auth.users`)
- `name` (VARCHAR)
- `color` (VARCHAR, Hex color)
- `icon` (VARCHAR, Lucide icon name)
- `created_at` / `updated_at` (TIMESTAMPTZ)

### 2. `asset_accounts` Table
Stores holdings under categories.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key referencing `auth.users`)
- `category_id` (UUID, Foreign Key referencing `asset_categories`)
- `name` (VARCHAR)
- `ticker` (VARCHAR(20)) - Optional ticker symbol for public assets (e.g., 'BTC', 'SSI', 'SJC')
- `quantity` (NUMERIC)
- `purchase_unit_price` (NUMERIC) - Unit price at which the asset was purchased
- `unit_price` (NUMERIC) - Current unit price of the asset
- `currency` (VARCHAR, 'VND' or 'USD')
- `purchase_date` (DATE)
- `description` (TEXT)
- `created_at` / `updated_at` (TIMESTAMPTZ)

## SQL Schema Migration

Run the following SQL migration on the Supabase PostgreSQL database:

```sql
-- Add purchase_unit_price column to public.asset_accounts
ALTER TABLE public.asset_accounts 
ADD COLUMN IF NOT EXISTS purchase_unit_price NUMERIC NOT NULL DEFAULT 0;

-- Add ticker column to public.asset_accounts
ALTER TABLE public.asset_accounts 
ADD COLUMN IF NOT EXISTS ticker VARCHAR(20);

-- Populate existing rows where purchase_unit_price is default/unset
UPDATE public.asset_accounts 
SET purchase_unit_price = unit_price 
WHERE purchase_unit_price = 0;
```
