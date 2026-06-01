// Asset type definitions for the Asset & Account Management feature

export interface AssetCategory {
  id: string
  user_id: string
  name: string
  color: string // Hex code, e.g. '#7c3aed'
  icon: string  // Lucide icon name, e.g. 'Wallet'
  created_at: string
  updated_at: string
}

export interface AssetAccount {
  id: string
  user_id: string
  category_id: string
  name: string
  quantity: number
  unit_price: number
  currency: string
  description: string | null
  total_value: number // computed: quantity × unit_price
  created_at: string
  updated_at: string
  category?: AssetCategory // Joined relation
}

export interface AssetTransaction {
  id: string
  account_id: string
  user_id: string
  type: 'buy' | 'sell'
  quantity: number
  price_per_unit: number
  transaction_date: string
  notes: string | null
  created_at: string
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

