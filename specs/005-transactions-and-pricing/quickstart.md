# Quickstart & Verification Guide

This guide helps you set up the environment and run manual verification tests for the new features.

## DB Setup
Apply the new transactions migration using Supabase CLI or execute the query inside Supabase SQL Editor:
```bash
npx supabase db push
```
Or execute SQL commands from [20260602000001_add_transactions_table.sql](file:///Users/tylerle/Documents/Me/Personal-finance/supabase/migrations/20260602000001_add_transactions_table.sql).

## Verification Checklist

### 1. Collapsible Submenu
1. Load `/dashboard`.
2. Find the "Danh mục của tôi" link in the sidebar.
3. Click it and verify that it expands to display:
   - "Danh mục tài sản"
   - "Danh mục chi tiêu"
4. Verify both items navigate successfully.

### 2. Expense Entries
1. Go to "Chi tiêu & Hóa đơn".
2. Create a new transaction. Ensure "Thu nhập" is not selectable.
3. Log an expense and check the wallet balance updates automatically.

### 3. Income Entries
1. Go to "Tài sản & Số dư".
2. Click "Nhập thu nhập".
3. Log an income and verify it updates the account balance.

### 4. Paginated Transactions
1. Go to "Lịch sử giao dịch".
2. Seed enough transactions to exceed 20 records.
3. Check the pagination triggers "Trước" and "Sau" options.
