# Quickstart: Verifying Asset Categories & Management

This guide explains how to manually verify the custom category and asset management features locally.

## Prerequisite: Database Migration
Run the following SQL migration in your Supabase SQL Editor to clean and initialize the tables:

```sql
-- Drop old tables to avoid conflicts
DROP TABLE IF EXISTS public.asset_transactions;
DROP TABLE IF EXISTS public.asset_accounts;
DROP TABLE IF EXISTS public.asset_categories;

-- Recreate tables
CREATE TABLE public.asset_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, name)
);

CREATE TABLE public.asset_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.asset_categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    quantity NUMERIC NOT NULL DEFAULT 0,
    unit_price NUMERIC NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'VND',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.asset_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_accounts ENABLE ROW LEVEL SECURITY;

-- Select/Insert/Update/Delete policies for categories
CREATE POLICY "Users can manage their own categories" 
    ON public.asset_categories FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Select/Insert/Update/Delete policies for accounts
CREATE POLICY "Users can manage their own accounts" 
    ON public.asset_accounts FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```

## Manual Verification Scenarios

### Scenario 1: Category Management
1. Sign in to the application and navigate to `/dashboard/assets`.
2. Verify that a message states "Chưa có danh mục nào. Hãy tạo danh mục trước khi thêm tài sản."
3. Click **Quản lý danh mục** to open the category management dialog.
4. Add a new category:
   - Name: `Vàng miếng`
   - Color: Select Amber/Gold (`#d97706`)
   - Icon: Select `Coins`
5. Save and verify that the category appears in the categories list.
6. Delete or edit the category name to verify full CRUD.

### Scenario 2: Adding an Asset Account under a Custom Category
1. From `/dashboard/assets`, click **Thêm tài sản**.
2. Fill out the form:
   - Name: `SJC Gold`
   - Category: Select `Vàng miếng`
   - Quantity: `5`
   - Unit Price: `90,000,000`
3. Verify that the estimated total preview updates dynamically to `450,000,000 ₫`.
4. Click **Thêm tài sản** to save.
5. Verify that the asset card displays under `/dashboard/assets` with the custom `Coins` icon and the total value.

### Scenario 3: Dashboard Summary and Allocation Chart
1. Add another category: `Crypto Altcoins` with Blue color (`#2563eb`) and `Bitcoin` icon.
2. Add an asset account under `Crypto Altcoins`: Name `Ethereum`, quantity `2.5`, price `85,000,000`.
3. Go to the Main Dashboard (`/dashboard`).
4. Verify:
   - Total Net Worth is calculated as `662,500,000 ₫` (`450,000,000 + 212,500,000`).
   - The Allocation Chart displays 2 slices: `Vàng miếng` (approx. 67.9%) and `Crypto Altcoins` (approx. 32.1%).
