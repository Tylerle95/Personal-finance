# Quickstart: Verifying Dashboard & UI UX Refinements

This guide explains how to manually verify the dashboard refinements, table view, collapsible sidebar, separate categories page, and confirmation popup modals.

## Pre-requisites
Make sure you are on the `004-dashboard-refinements` branch and the local development server is running (`npm run dev`).

## Manual Verification Scenarios

### Scenario 1: YouTube-Style Collapsible Sidebar
1. Log in and land on `/dashboard`.
2. Resize your browser to desktop width (e.g. > 1024px).
3. Observe the sidebar displays in **Expanded** mode (showing both icons and full text labels).
4. Verify the menu has three items: "Tổng quan", "Lịch sử giao dịch" (previously "Tài sản của tôi"), and "Danh mục của tôi".
5. Click the **Hamburger Menu** icon next to the logo in the top header.
6. Verify the sidebar collapses smoothly to **Collapsed** mode.
7. Verify that in Collapsed mode, all text labels are completely hidden (only the icons remain centered and visible).
8. Hover over each icon in collapsed mode to verify that browser tooltips show their respective names.

### Scenario 2: Separate Categories Management Route
1. Click the **"Danh mục của tôi"** sidebar menu item.
2. Verify that the URL changes to `/dashboard/categories` and a dedicated full-screen Category Management page is displayed.
3. Perform CRUD actions on categories (add new category, edit name, change color/icon) and verify they are persisted successfully.
4. Verify that delete icons triggers a Confirmation Modal.

### Scenario 3: Transaction History Row-Based Layout & Profit/Loss Tracking
1. Click the **"Lịch sử giao dịch"** sidebar menu item.
2. Verify that the page header says "Lịch sử giao dịch".
3. Check the list of assets/accounts. It must be rendered as rows in a table (or stackable row list on smaller viewports) rather than a grid of cards.
4. Verify columns: Tên tài sản, Danh mục, Ngày sở hữu, Số lượng, Giá mua, Giá hiện tại, Lời/Lỗ, Tổng giá trị, Thao tác.
5. Verify that Profit/Loss displays:
   - Positive/Profit: Green text color, prefixed with `+`, showing the absolute value difference and the percentage. E.g., `+100.000 ₫ (+5.2%)`.
   - Negative/Loss: Red text color, prefixed with `-`, showing the absolute value difference and the percentage. E.g., `-50.000 ₫ (-2.5%)`.
   - Cash/Bank assets: Displays as `-` with neutral slate-500 coloring, as cash holdings do not track investment profit/loss.
6. Hover over a row to check the styling feedback (slight background transition, clear action buttons).
7. Click **"Thêm tài sản"** button. If selecting an investment category (e.g. Vàng, Stocks, Crypto), verify the form displays both **"Đơn giá mua"** and **"Mã tài sản / Ticker"** input fields (while "Đơn giá hiện tại" is hidden and fetched automatically). If selecting cash/bank (e.g. Tiền mặt, Ngân hàng), verify the form only displays a single **"Số dư / Giá trị"** input field.
8. Add a new investment with a valid ticker (e.g., `HPG` for stocks, `BTC` for crypto, or `SJC` for gold) and verify that the current price and profit/loss are fetched and calculated automatically.
9. Verify that a **"Đồng bộ giá"** (Sync Prices) button exists on the top of the table which updates all prices and recalculates value and profit/loss dynamically on click.
10. Click **Edit** (Pencil icon) on an asset, update either the Purchase Price or Ticker, and verify that current prices and profit/loss are updated correctly.

### Scenario 4: Circular Asset Allocation Chart
1. Click the **"Tổng quan"** sidebar menu item.
2. Verify that the Net Worth summary card renders a circular/donut-shaped allocation chart instead of a horizontal progress bar.
3. Verify that the chart segments are drawn with the correct hex colors matching the category allocations.
4. Verify that hovering over segments reveals tooltips indicating category name and percentage allocation.

### Scenario 5: Delete & Logout Confirmation Modals
1. On `/dashboard/categories` or `/dashboard/assets` (renamed to `/dashboard/transactions`), click the **Delete** button next to any item.
2. Verify that a custom glassmorphic confirmation popup modal displays, asking: "Bạn có chắc chắn muốn xóa...?".
3. Click **Hủy** (Cancel) and verify the item is NOT deleted and the modal closes.
4. Click **Delete** again, then click **Xác nhận** (Confirm), and verify the item is successfully deleted.
5. In the top global header, click the **Đăng xuất** (Sign Out) button.
6. Verify that a custom confirmation popup modal displays, asking: "Bạn có chắc chắn muốn đăng xuất?".
7. Click **Hủy** (Cancel) and verify you remain logged in.
8. Click the button again, then click **Xác nhận** (Confirm), and verify you are signed out and redirected to `/login`.
