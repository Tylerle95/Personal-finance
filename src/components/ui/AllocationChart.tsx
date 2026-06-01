'use client'

import { AllocationItem } from '@/lib/types/assets'
import * as Icons from 'lucide-react'

interface AllocationChartProps {
  allocation: AllocationItem[]
}

export default function AllocationChart({ allocation }: AllocationChartProps) {
  if (allocation.length === 0) return null

  return (
    <div className="allocation-chart">
      {/* Stacked bar */}
      <div className="allocation-bar" role="img" aria-label="Biểu đồ phân bổ tài sản">
        {allocation.map((item) => (
          <div
            key={item.category_id}
            className="allocation-bar__segment"
            style={{ width: `${item.percentage}%`, background: item.color }}
            title={`${item.label}: ${item.percentage}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <ul className="allocation-legend">
        {allocation.map((item) => {
          const IconComp = (Icons as any)[item.icon] || Icons.Wallet
          return (
            <li key={item.category_id} className="allocation-legend__item">
              <span
                className="allocation-legend__dot flex items-center justify-center"
                style={{ background: `${item.color}20`, width: '1.25rem', height: '1.25rem', borderRadius: '4px' }}
                aria-hidden="true"
              >
                <IconComp size={10} style={{ color: item.color }} />
              </span>
              <span className="allocation-legend__label ml-1">{item.label}</span>
              <span className="allocation-legend__pct">{item.percentage}%</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

