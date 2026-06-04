// Asset type definitions for the Asset & Account Management feature

export interface AssetCategory {
  id: string
  user_id: string
  name: string
  color: string // Hex code, e.g. '#7c3aed'
  icon: string  // Lucide icon name, e.g. 'Wallet'
  type: 'asset' | 'spending'
  created_at: string
  updated_at: string
}

export interface AssetAccount {
  id: string
  user_id: string
  category_id: string
  name: string
  quantity: number
  purchase_unit_price: number
  unit_price: number
  ticker: string | null
  currency: string
  purchase_date: string
  description: string | null
  total_value: number // computed: quantity × unit_price
  created_at: string
  updated_at: string
  category?: AssetCategory // Joined relation
}

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
  account?: AssetAccount
  source_account?: AssetAccount
  category?: AssetCategory
}

export interface ActionResult {
  error: string | null
  success: boolean
  message: string | null
  data?: { id: string }
}

export interface AllocationItem {
  category_id: string
  label: string
  totalValue: number
  percentage: number
  color: string
  icon: string
  assets?: {
    name: string
    quantity: number
    ticker: string | null
    currency: string
    unit_price: number
  }[]
}

export interface NetWorthSummary {
  totalNetWorth: number
  allocation: AllocationItem[]
}

// Predefined palette for colors & icons to guarantee visual harmony
export const PREDEFINED_COLORS = [
  { name: 'Teal', hex: '#0d9488' },
  { name: 'Violet', hex: '#7c3aed' },
  { name: 'Gold', hex: '#d4af37' },
  { name: 'Amber', hex: '#d97706' },
  { name: 'Green', hex: '#16a34a' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Pink', hex: '#db2777' },
]

export const PREDEFINED_ICONS = [
  'Wallet',
  'Landmark',
  'Coins',
  'TrendingUp',
  'PiggyBank',
  'CreditCard',
  'Briefcase',
  'Gem',
  'Bitcoin',
  'DollarSign',
  'LineChart',
  'Percent',
]

