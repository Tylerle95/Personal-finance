-- Add type column to public.asset_categories
ALTER TABLE public.asset_categories 
ADD COLUMN IF NOT EXISTS type VARCHAR(20) NOT NULL DEFAULT 'asset';

-- Create public.asset_transactions table
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

-- Trigger to update updated_at timestamp automatically
CREATE OR REPLACE TRIGGER update_asset_transactions_updated_at
    BEFORE UPDATE ON public.asset_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.asset_transactions ENABLE ROW LEVEL SECURITY;

-- Security Policies for public.asset_transactions
CREATE POLICY "Users can manage their own transactions" ON public.asset_transactions
    FOR ALL USING (auth.uid() = user_id);
