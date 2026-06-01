'use client'

import { AssetAccount } from '@/lib/types/assets'
import { Pencil, Trash2 } from 'lucide-react'
import * as Icons from 'lucide-react'

const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })

function formatQuantity(value: number): string {
  // Show up to 8 decimals for precise values (like crypto) but fallback to locale defaults
  return value.toLocaleString('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  })
}

interface AssetCardProps {
  account: AssetAccount
  onEdit: (account: AssetAccount) => void
  onDelete: (account: AssetAccount) => void
}

export default function AssetCard({ account, onEdit, onDelete }: AssetCardProps) {
  const category = account.category
  const categoryColor = category?.color || '#94a3b8'
  const categoryName = category?.name || 'Chưa phân loại'
  
  // Resolve Lucide icon component dynamically
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<React.ComponentProps<typeof Icons.Wallet>>>)[category?.icon || 'Wallet'] || Icons.Wallet

  return (
    <div className="asset-card">
      {/* Header */}
      <div className="asset-card__header">
        <div 
          className="asset-card__icon-wrap" 
          style={{ background: `${categoryColor}15` }}
        >
          <IconComponent className="h-5 w-5" style={{ color: categoryColor }} />
        </div>
        <div className="asset-card__title-wrap">
          <h3 className="asset-card__name">{account.name}</h3>
          <span 
            className="asset-card__type-badge text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5" 
            style={{ color: categoryColor, background: `${categoryColor}10` }}
          >
            {categoryName}
          </span>
        </div>
        {/* Actions */}
        <div className="asset-card__actions">
          <button
            className="asset-card__action-btn"
            onClick={() => onEdit(account)}
            aria-label={`Chỉnh sửa ${account.name}`}
            title="Chỉnh sửa"
          >
            <Pencil size={16} />
          </button>
          <button
            className="asset-card__action-btn asset-card__action-btn--danger"
            onClick={() => onDelete(account)}
            aria-label={`Xóa ${account.name}`}
            title="Xóa"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Description */}
      {account.description && (
        <p className="asset-card__description">{account.description}</p>
      )}

      {/* Price details */}
      <div className="asset-card__details">
        <div className="asset-card__detail-row">
          <span className="asset-card__detail-label">Số lượng</span>
          <span className="asset-card__detail-value">
            {formatQuantity(account.quantity)}
          </span>
        </div>
        <div className="asset-card__detail-row">
          <span className="asset-card__detail-label">Đơn giá</span>
          <span className="asset-card__detail-value">{VND.format(account.unit_price)}</span>
        </div>
      </div>

      {/* Total value */}
      <div className="asset-card__total">
        <span className="asset-card__total-label">Tổng giá trị</span>
        <span className="asset-card__total-value" style={{ color: categoryColor }}>
          {VND.format(account.total_value)}
        </span>
      </div>
    </div>
  )
}

