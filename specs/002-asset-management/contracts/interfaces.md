# Interface Contracts: Asset Categories & Accounts

## Server Actions (`src/app/actions/assets.ts`)

### 1. Categories Management

#### `createAssetCategory`
- **Arguments**:
  - `prevState`: `ActionResult`
  - `formData`: `FormData` (containing `name`, `color`, `icon`)
- **Return Type**: `Promise<ActionResult>`
- **Behavior**: Validates that name is not empty, color is within the predefined palette, and icon is within the predefined icon set. Inserts the row into `asset_categories` with `user_id = auth.uid()`. Revalidates paths `/dashboard/assets` and `/dashboard`.

#### `updateAssetCategory`
- **Arguments**:
  - `prevState`: `ActionResult`
  - `formData`: `FormData` (containing `id`, `name`, `color`, `icon`)
- **Return Type**: `Promise<ActionResult>`
- **Behavior**: Updates details of an existing category. Validates inputs. Revalidates paths `/dashboard/assets` and `/dashboard`.

#### `deleteAssetCategory`
- **Arguments**:
  - `prevState`: `ActionResult`
  - `formData`: `FormData` (containing `id`)
- **Return Type**: `Promise<ActionResult>`
- **Behavior**: Deletes the category. Revalidates paths `/dashboard/assets` and `/dashboard`.

---

### 2. Accounts Management

#### `createAssetAccount`
- **Arguments**:
  - `prevState`: `ActionResult`
  - `formData`: `FormData` (containing `name`, `category_id`, `quantity`, `unit_price`, `description`)
- **Return Type**: `Promise<ActionResult>`
- **Behavior**: Validates inputs. Inserts the row into `asset_accounts`. Revalidates paths.

#### `updateAssetAccount`
- **Arguments**:
  - `prevState`: `ActionResult`
  - `formData`: `FormData` (containing `id`, `name`, `category_id`, `quantity`, `unit_price`, `description`)
- **Return Type**: `Promise<ActionResult>`
- **Behavior**: Updates account details. Revalidates paths.

#### `deleteAssetAccount`
- **Arguments**:
  - `prevState`: `ActionResult`
  - `formData`: `FormData` (containing `id`)
- **Return Type**: `Promise<ActionResult>`
- **Behavior**: Deletes the account. Revalidates paths.

---

## Data Fetching API (`src/lib/data/assets.ts`)

### `getUserAssetCategories`
- **Signature**: `export async function getUserAssetCategories(): Promise<AssetCategory[]>`
- **Behavior**: Fetches all `asset_categories` for the currently logged in user.

### `getUserAssetAccounts`
- **Signature**: `export async function getUserAssetAccounts(): Promise<AssetAccount[]>`
- **Behavior**: Fetches all `asset_accounts` joined with their parent `asset_category` details.

### `getNetWorthSummary`
- **Signature**: `export async function getNetWorthSummary(): Promise<NetWorthSummary>`
- **Behavior**: Computes total net worth (sum of `quantity * unit_price` for all accounts) and lists allocation items grouped by custom `AssetCategory`.
