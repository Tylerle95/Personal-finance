'use client'

import Link from 'next/link'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { NetWorthSummary as NetWorthSummaryType } from '@/lib/types/assets'
import AllocationChart from './AllocationChart'

const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })

interface NetWorthSummaryProps {
  summary: NetWorthSummaryType
}

export default function NetWorthSummary({ summary }: NetWorthSummaryProps) {
  return (
    <div className="networth-widget">
      <div className="networth-widget__header">
        <TrendingUp className="networth-widget__icon" size={20} />
        <span className="networth-widget__label">Tổng tài sản ròng</span>
      </div>

      <p className="networth-widget__value">{VND.format(summary.totalNetWorth)}</p>

      {summary.allocation.length > 0 && (
        <div className="networth-widget__chart">
          <AllocationChart allocation={summary.allocation} />
        </div>
      )}

      <Link href="/dashboard/assets" className="networth-widget__link">
        Xem chi tiết tài sản <ArrowRight size={14} />
      </Link>
    </div>
  )
}
