# Research & Architecture Decisions: BTC/SJC Header Pricing & Transaction Management

## 1. Income Tracking & Balance Adjustments
- **Decision**: Integrate income input directly into "Tài sản & Số dư" (Assets & Balances) using a dedicated "Nhập thu nhập" action.
- **Rationale**: Keeps all cash inflows coupled with wallets/balances. It resolves the cognitive dissonance of having income entry inside "Chi tiêu & Hóa đơn" (which should focus strictly on outflows/bills).
- **Alternatives considered**:
  - *Option B (Simple income without categories)*: Rejected because users need to classify incomes (e.g., Salary, Gift) to construct accurate monthly reports.

## 2. Category Type Database Structure
- **Decision**: Expand `asset_categories.type` to support `'income'` value.
- **Rationale**: Since the database uses `VARCHAR(20)` for `type` without check constraints, we can dynamically insert `'income'` without requiring complex migrations or breaking schema constraints.
- **Alternatives considered**:
  - *Creating a separate table for income categories*: Rejected to keep the database layout simple and highly reuse the existing `AssetCategory` UI forms.

## 3. Sidebar Category Submenu Navigation
- **Decision**: Render a collapsible sub-nav block inside the sidebar Client component. Toggling "Danh mục của tôi" shows "Danh mục tài sản" and "Danh mục chi tiêu".
- **Rationale**: Cleanest UX that avoids cluttering the sidebar while providing direct access to specific category lists.
- **Alternatives considered**:
  - *Tabbed views on the categories page*: The page `/dashboard/categories` will still utilize query parameters (`?type=...`) to toggle between the views, but the submenu provides the physical entry points.
