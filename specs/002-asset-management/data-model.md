# Data Model: Asset Categories & Accounts

## Database Schema (Supabase PostgreSQL)

### 1. `asset_categories` Table
Stores custom asset categories created by users.

```sql
CREATE TABLE IF NOT EXISTS public.asset_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) NOT NULL, -- Hex representation, e.g. '#7c3aed'
    icon VARCHAR(50) NOT NULL,  -- Lucide icon name, e.g. 'Wallet'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE public.asset_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own asset categories" 
    ON public.asset_categories FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own asset categories" 
    ON public.asset_categories FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own asset categories" 
    ON public.asset_categories FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own asset categories" 
    ON public.asset_categories FOR DELETE 
    USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE TRIGGER update_asset_categories_updated_at
    BEFORE UPDATE ON public.asset_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 2. `asset_accounts` Table
Updated to link with `asset_categories` instead of utilizing a static enum.

```sql
-- Migration/Update of existing asset_accounts table
-- Note: In Supabase, if the table exists, we drop the 'type' column and add 'category_id'.
-- For clean setup, we redefine it here:

CREATE TABLE IF NOT EXISTS public.asset_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.asset_categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    quantity NUMERIC NOT NULL DEFAULT 0,
    unit_price NUMERIC NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'VND',
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.asset_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own asset accounts" 
    ON public.asset_accounts FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own asset accounts" 
    ON public.asset_accounts FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own asset accounts" 
    ON public.asset_accounts FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own asset accounts" 
    ON public.asset_accounts FOR DELETE 
    USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE TRIGGER update_asset_accounts_updated_at
    BEFORE UPDATE ON public.asset_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Data Migration Plan
For local development, we will drop the old `asset_accounts` table if it exists, or run a migration script to:
1. Drop the `type` column.
2. Add `category_id` column referencing `asset_categories`.
Since it is in development/draft status and we are working on the branch, we can simply drop and recreate the tables to maintain clean relational integrity.
