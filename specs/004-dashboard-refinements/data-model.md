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
- `quantity` (NUMERIC)
- `unit_price` (NUMERIC)
- `currency` (VARCHAR, 'VND' or 'USD')
- `purchase_date` (DATE)
- `description` (TEXT)
- `created_at` / `updated_at` (TIMESTAMPTZ)
