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
