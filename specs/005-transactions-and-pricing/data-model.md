# Data Model & Schema Details

This document outlines the database schema and TypeScript interfaces for the Transaction and Asset categories update.

## Database Entities

### 1. `public.asset_categories`
Stores the categorizations of assets, spending/expenses, and income.
```sql
ALTER TABLE public.asset_categories 
ADD COLUMN IF NOT EXISTS type VARCHAR(20) NOT NULL DEFAULT 'asset';
-- Valid type values: 'asset' | 'spending' | 'income'
```

### 2. `public.asset_transactions`
Stores transaction records linking back to accounts and categories.
```sql
CREATE TABLE IF NOT EXISTS public.asset_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES public.asset_accounts(id) ON DELETE CASCADE,
    source_account_id UUID REFERENCES public.asset_accounts(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL, -- 'income' | 'expense' | 'buy' | 'sell' | 'transfer'
    category_id UUID REFERENCES public.asset_categories(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    quantity NUMERIC NOT NULL DEFAULT 0,
    price_per_unit NUMERIC NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'VND',
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

## TypeScript Types

### `AssetCategory`
```typescript
export interface AssetCategory {
  id: string
  user_id: string
  name: string
  color: string
  icon: string
  type: 'asset' | 'spending' | 'income'
  created_at: string
  updated_at: string
}
```

### `AssetTransaction`
```typescript
export interface AssetTransaction {
  id: string
  user_id: string
  account_id: string
  source_account_id: string | null
  type: 'income' | 'expense' | 'buy' | 'sell' | 'transfer'
  category_id: string | null
  amount: number
  quantity: number
  price_per_unit: number
  currency: string
  transaction_date: string
  description: string | null
  created_at: string
  updated_at: string
}
```
