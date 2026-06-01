# Research: Custom Asset Categories & Management

## Decisions & Rationale

### 1. Database Schema for Custom Categories
- **Decision**: Create a new Table `asset_categories` in Supabase PostgreSQL.
- **Schema**:
  - `id` (UUID, PK, default `gen_random_uuid()`)
  - `user_id` (UUID, References `auth.users(id)` ON DELETE CASCADE, NOT NULL)
  - `name` (VARCHAR(100), NOT NULL)
  - `color` (VARCHAR(7), NOT NULL) - Hex color code (e.g. `#7c3aed`)
  - `icon` (VARCHAR(50), NOT NULL) - Lucide icon name or emoji representation
  - `created_at` (TIMESTAMP WITH TIME ZONE, default `timezone('utc'::text, now())`, NOT NULL)
  - `updated_at` (TIMESTAMP WITH TIME ZONE, default `timezone('utc'::text, now())`, NOT NULL)
- **RLS Policy**: Row-Level Security enabled. Users can only select/insert/update/delete rows where `user_id = auth.uid()`.
- **Foreign Key on Accounts**: The existing `asset_accounts` table's `type` field (which was an enum) will be replaced by (or migrated to) `category_id` (UUID, references `asset_categories(id)` ON DELETE CASCADE, NOT NULL).

### 2. Category Color Palette & Icon Options
- **Decision**: Define a static constant array in `src/lib/types/assets.ts` for predefined color palette options and lucide icon names.
- **Predefined Colors**:
  - Teal: `#0d9488`
  - Violet: `#7c3aed`
  - Amber: `#d97706`
  - Green: `#16a34a`
  - Blue: `#2563eb`
  - Rose: `#e11d48`
  - Indigo: `#4f46e5`
  - Pink: `#db2777`
- **Predefined Icons**:
  - `Wallet`, `Landmark`, `Coins`, `TrendingUp`, `PiggyBank`, `CreditCard`, `Briefcase`, `Gem`, `Bitcoin`, `DollarSign`, `LineChart`, `Percent`.

### 3. Server Actions & Interface Contracts
- **Decision**: Create new server actions in `src/app/actions/assets.ts` to manage categories:
  - `createAssetCategory(prevState, formData)`
  - `updateAssetCategory(prevState, formData)`
  - `deleteAssetCategory(prevState, formData)`
- Update existing asset account actions to require `category_id` instead of `type`.

### 4. UI Access & Management flow
- **Decision**: A Modal/Section within the `/dashboard/assets` screen that displays when the user clicks "Manage Categories". This screen will let the user add, edit, or delete categories. When creating or editing an asset, a select dropdown will fetch and show user's custom categories. If the category list is empty, display a clear CTA to create a category first.

## Alternatives Considered

### Alternative A: Inline Tagging (No Category Table)
- **Description**: Category is just a text field on `AssetAccount`.
- **Why Rejected**: Hard to group, maintain color/icon consistency, or display an allocation chart since every account might have slightly different category spellings (e.g. "Crypto" vs "crypto").

### Alternative B: Default Seed Data in Database Triggers
- **Description**: Seed default categories on user sign-up via Supabase trigger.
- **Why Rejected**: The user explicitly requested to start empty with no default categories, forcing the user to create their first category.
