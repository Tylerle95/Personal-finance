# Feature Specification: Dashboard & UI UX Refinements

**Feature Branch**: `004-dashboard-refinements`

**Created**: 2026-06-02

**Status**: Draft

**Input**: User description:
1. chart > hãy đổi sang dạng tròn
2. Tài sản của tôi > đổi thành lịch sử giao dịch
3. lịch sử giao dịch nên thiết kế chuyển sang dạng row thay vì gird bởi vì sẽ có rất nhiều giao dịch
4. left menu > khi đóng > nên chỉ hiển thị icon không hiển thị text
5. left memu > nên có thêm phần danh mục của tôi (nó là phần quản lý danh mục)
6. các button như delete trong dự án cần phải có popup confirm, vui lòng cũng thêm ở button logout

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Collapsible Sidebar Navigation Enhancements (Priority: P1)

Users see an updated sidebar menu layout. The Collapsed (mini) mode is refined to only display icons (no text at all), providing a cleaner and more compact sidebar. Additionally, the sidebar navigation has an added menu item: "Danh mục của tôi" (My Categories) allowing direct category management.

**Why this priority**: Navigating between sections and category management is a fundamental feature of the application layout shell. Collapsing to only icons maximizes screen real estate for sub-pages.

**Independent Test**:
1. Open the application on a desktop screen.
2. Verify the sidebar has three navigation links: "Tổng quan" (Overview), "Lịch sử giao dịch" (Transaction History), and "Danh mục của tôi" (My Categories).
3. Click the Hamburger toggle button.
4. Verify the sidebar collapses smoothly. In collapsed mode, the text labels disappear completely, leaving only the icons (LayoutDashboard, Wallet, FolderKanban) centered in the narrow bar (~72px).
5. Hover over collapsed items to verify tooltips show the menu names.

**Acceptance Scenarios**:
1. **Given** the user toggles the sidebar to collapsed mode, **When** the sidebar transitions, **Then** all menu text labels fade out and only the icons remain visible and clickable.
2. **Given** the user clicks "Danh mục của tôi" in the left sidebar, **When** the route is activated, **Then** they are taken to the category management view where they can perform CRUD on categories.

---

### User Story 2 - Transaction History Row-Based Layout (Priority: P2)

The main asset holdings list is renamed to "Lịch sử giao dịch" (Transaction History). Instead of displaying holdings as cards in a grid, the system displays them in a clean, scrollable row-based table/list layout to accommodate a high volume of transactions/assets.

**Why this priority**: Scalability of the UI. A card grid is not practical when users have dozens or hundreds of holdings; a row-based layout allows for easier scanning, filtering, and sorting of transaction data.

**Independent Test**:
1. Navigate to the "Lịch sử giao dịch" screen.
2. Verify the page title is "Lịch sử giao dịch".
3. Verify that the asset accounts list is displayed as table rows.
4. Each row must display: Name, Category (with icon and colored dot), Date (Purchase/Transaction Date), Value/Balance (with USD/VND conversion), and action buttons (Edit, Delete).

**Acceptance Scenarios**:
1. **Given** the user has 15 asset accounts/transactions, **When** they load the transaction list page, **Then** they see a table layout where each account is a row with clear columns.
2. **Given** the transaction table, **When** the screen is resized to mobile, **Then** the row content adapts responsively (e.g. collapsing secondary columns into a details card or a simplified single-row layout).

---

### User Story 3 - Circular Asset Allocation Chart (Priority: P3)

On the dashboard overview page, the linear/stacked asset allocation bar is replaced with a premium, interactive circular (donut or pie) chart representing the percentage allocation of net worth across different custom categories.

**Why this priority**: Better visual breakdown. A circular allocation chart is the industry standard for net worth distribution, providing a more intuitive and visually appealing dashboard.

**Independent Test**:
1. Navigate to "Tổng quan" (Overview).
2. Verify that the net worth allocation is rendered as a circular/donut chart using category colors.
3. Verify hovering over slices displays tooltips with the category name and allocation percentage.

**Acceptance Scenarios**:
1. **Given** the user has holdings in "Cash" (10%) and "Gold" (90%), **When** they load the Dashboard, **Then** the allocation chart renders a circular breakdown matching these percentages.

---

### User Story 4 - Delete & Logout Confirmation Popups (Priority: P4)

All high-impact destructive or session-terminating actions in the application must require user confirmation. Clicking any "Delete" button (for assets, categories, etc.) or the "Logout" button triggers a beautiful, glassmorphic modal popup asking the user to confirm their action.

**Why this priority**: User error prevention. Destructive actions must not happen by accident, and confirmation modals protect the integrity of the user's data and session.

**Independent Test**:
1. Navigate to "Lịch sử giao dịch" or "Danh mục của tôi".
2. Click the "Xóa" (Delete) button next to an item.
3. Verify that a modal pops up asking "Bạn có chắc chắn muốn xóa...?". The action is only completed if the user clicks "Xác nhận".
4. Click the "Đăng xuất" (Logout) button in the header.
5. Verify that a confirmation modal appears with "Bạn có chắc chắn muốn đăng xuất?". Click "Xác nhận" to sign out.

**Acceptance Scenarios**:
1. **Given** the user clicks "Delete" on an asset row, **When** the modal displays, **Then** clicking "Hủy" closes the modal without deleting, and clicking "Xác nhận" deletes the asset.
2. **Given** the user clicks the Logout button, **When** they click "Hủy" on the popup, **Then** they remain logged in; if they click "Xác nhận", the session terminates and they are redirected to `/login`.

---

### Edge Cases

- **Empty Transaction Row Layout**: What happens when there are no transactions? The system shows a clean, responsive empty-state row placeholder with a prompt button to add a transaction.
- **Multiple Modal Overlays**: Ensure that if a confirmation modal is opened on top of another modal (e.g., deleting a category from within a category management dialog), the overlay stacking context (`z-index`) behaves correctly and background focus is trapped.
- **Donut Chart Zero Slices**: If total net worth is 0 or negative, the circular chart displays a placeholder gray circle with "No data" center text.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST rename the `/dashboard/assets` route title to "Lịch sử giao dịch" in both headers and navigation menus.
- **FR-002**: System MUST render the navigation items in the left sidebar as: "Tổng quan", "Lịch sử giao dịch", and "Danh mục của tôi".
- **FR-003**: In Collapsed sidebar mode (width = 72px), the left sidebar MUST only show the Lucide icons, completely hiding the text labels.
- **FR-004**: System MUST add a new page `/dashboard/categories` for "Danh mục của tôi" (My Categories) allowing users to manage categories on a separate page.
- **FR-005**: The asset holdings list page (previously "Tài sản của tôi") MUST be renamed to "Lịch sử giao dịch" and MUST render the data using a row-based table or list layout instead of a grid. The underlying data model remains the same (AssetAccount).
- **FR-006**: Each row in the transaction history MUST display: Asset/Category name, Category icon/color badge, Purchase Date, Quantity, Unit Price, Currency, Total Value, and action buttons (Edit, Delete).
- **FR-007**: The dashboard Net Worth summary allocation chart MUST be rendered as a circular/donut shape (using SVG or a lightweight charting library).
- **FR-008**: System MUST display a confirmation modal before performing any Delete operations (delete asset account, delete asset category).
- **FR-009**: System MUST display a confirmation modal when the user clicks the "Sign Out" / "Logout" button.
- **FR-010**: Confirmation modals MUST follow the glassmorphic design system: background blur filter, soft border, custom colors, and clear action button options ("Xác nhận" and "Hủy").

### Key Entities *(include if feature involves data)*

- No new database entities are introduced in this phase, as we continue to build upon the existing `AssetCategory` and `AssetAccount` entities. If full transaction history is chosen, a new `AssetTransaction` entity will be used.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can toggle sidebar collapse/expand smoothly under 200ms with no layout shifting or text bleeding.
- **SC-002**: Confirmation modals render immediately (< 50ms) upon clicking delete/logout.
- **SC-003**: The circular allocation chart renders correctly and smoothly on page load in under 200ms.
- **SC-004**: The transaction row-based table displays up to 50 items with zero performance lag or horizontal scrolling overflow.

---

## Assumptions

- We assume that the user's preference for transaction history rows is to replace the card grid entirely on the "/dashboard/assets" (now "/dashboard/transactions") page.
- We assume that the translation keys in localizations will be updated to match the renamed pages (e.g. "Tài sản của tôi" to "Lịch sử giao dịch").
- The circular chart can be implemented natively using SVG to keep the bundle size small and maintain consistent styles, or using the existing charting solution.
