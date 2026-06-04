# Quickstart Guide: Asset and Income Dashboard Refinements

This guide explains how to start the development server and verify the new dashboard, income routing, and assets filtering/sorting features.

## Prerequisites

Ensure you have your environment variables set up in `.env.local` for Supabase connection.

## Run Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

## Verification Steps

### 1. Route Income to Assets
1. Navigate to the **Tài sản & Số dư** page.
2. Click **Nhập thu nhập**.
3. In the **Tài khoản nhận / Ví** dropdown:
   - Verify that you can see both cash/bank wallets (grouped under "Ví & Tài khoản ngân hàng") and other asset accounts (grouped under "Tài sản khác").
4. Select a crypto or gold asset (e.g. "Bitcoin" or "SJC Gold").
5. Enter a transaction date, description, and an income amount (e.g. `2,500,000` VND).
6. Click **Lưu thu nhập**.
7. Verify:
   - The transaction is recorded in `Lịch sử giao dịch`.
   - The quantity of the target asset account is updated by `amount / unit_price` (e.g., if price is `2,500,000`, the quantity should increase by `1.0`).

### 2. View Asset Quantities in Pie Chart
1. Navigate to the main **Tổng quan** page.
2. Click on a category slice in the **Phân bổ tài sản** donut chart.
3. Verify:
   - A list appears directly below the chart listing all assets inside that category along with their physical quantities (e.g., `0.4 BTC`, `10 lượng SJC`).

### 3. Filter and Sort Assets table
1. Navigate to the **Tài sản & Số dư** page.
2. Verify:
   - A toolbar is present directly above the assets list table.
3. Select a category in the **Lọc danh mục** dropdown. Verify only items in that category are shown.
4. Select a field in the **Sắp xếp theo** dropdown (e.g. "Ngày sở hữu").
5. Toggle the sort order button (Ascending/Descending).
6. Verify:
   - The table items update instantly in the correct sorted order without page refresh.
