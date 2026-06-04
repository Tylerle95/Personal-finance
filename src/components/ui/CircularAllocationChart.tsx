'use client'

import React, { useState } from 'react'
import { AllocationItem } from '@/lib/types/assets'
import * as Icons from 'lucide-react'

interface CircularAllocationChartProps {
  allocation: AllocationItem[]
}

const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })

export default function CircularAllocationChart({ allocation }: CircularAllocationChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [clickedIndex, setClickedIndex] = useState<number | null>(null)

  if (allocation.length === 0) return null

  // Calculate sum of totalValue for the center fallback text
  const totalVal = allocation.reduce((sum, item) => sum + item.totalValue, 0)

  // Circle geometry parameters
  const radius = 50
  const strokeWidth = 14
  const circumference = 2 * Math.PI * radius // ~314.16

  // Cumulative offset calculator
  let accumulatedPercentage = 0

  const activeIndex = hoveredIndex !== null ? hoveredIndex : clickedIndex
  const activeItem = activeIndex !== null ? allocation[activeIndex] : null

  const handleSelect = (index: number) => {
    setClickedIndex(clickedIndex === index ? null : index)
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-4 w-full">
        {/* SVG Donut Chart */}
        <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 120 120"
            className="transform -rotate-90"
          >
            {/* Base empty/background track circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="transparent"
              stroke="var(--color-glass-border, rgba(255,255,255,0.08))"
              strokeWidth={strokeWidth}
            />

            {/* Render segments */}
            {allocation.map((item, index) => {
              const percentage = item.percentage
              const strokeLength = (percentage / 100) * circumference
              const strokeOffset = -((accumulatedPercentage / 100) * circumference)
              accumulatedPercentage += percentage

              const isSelected = activeIndex === index

              return (
                <circle
                  key={item.category_id}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isSelected ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={`${strokeLength} ${circumference}`}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer origin-center hover:opacity-95"
                  style={{
                    transformOrigin: '60px 60px',
                    // Minor gap between segments for modern spacing
                    strokeDasharray: percentage === 100 ? `${strokeLength} ${circumference}` : `${strokeLength - 1.5} ${circumference}`,
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleSelect(index)}
                />
              )
            })}
          </svg>

          {/* Center content (HTML positioned overlay) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold max-w-[120px] truncate">
              {activeItem ? activeItem.label : 'Tổng tài sản'}
            </span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-0.5 truncate max-w-[140px]">
              {activeItem ? VND.format(activeItem.totalValue) : VND.format(totalVal)}
            </span>
            <span className="text-[10px] text-violet-500 font-semibold mt-0.5">
              {activeItem ? `${activeItem.percentage}%` : '100%'}
            </span>
          </div>
        </div>

        {/* Legend list */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 w-full max-w-xs">
          {allocation.map((item, index) => {
            const IconComp = (Icons as unknown as Record<string, React.ComponentType<React.ComponentProps<typeof Icons.Wallet>>>)[item.icon] || Icons.Wallet
            const isSelected = activeIndex === index
            return (
              <li
                key={item.category_id}
                className={`flex items-center justify-between p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-violet-500/30 bg-violet-500/5 dark:bg-violet-500/10'
                    : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/30'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleSelect(index)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${item.color}15` }}
                  >
                    <IconComp size={13} style={{ color: item.color }} />
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 pl-3">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {VND.format(item.totalValue)}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 min-w-[28px] text-right">
                    {item.percentage}%
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Details Card */}
      {activeItem && activeItem.assets && activeItem.assets.length > 0 && (
        <div className="mt-2 p-4 rounded-2xl border border-glass-border bg-glass-bg/60 backdrop-blur-md shadow-card-shadow w-full max-w-md transition-all duration-300">
          <div className="flex items-center gap-2 border-b border-glass-border/60 pb-2 mb-3">
            <span
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ backgroundColor: `${activeItem.color}15` }}
            >
              {(() => {
                const IconComp = (Icons as unknown as Record<string, React.ComponentType<React.ComponentProps<typeof Icons.Wallet>>>)[activeItem.icon] || Icons.Wallet
                return <IconComp size={12} style={{ color: activeItem.color }} />
              })()}
            </span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Chi tiết tài sản: {activeItem.label}
            </h4>
          </div>
          <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-custom">
            {activeItem.assets.map((asset, i) => {
              const isCash = /tiền mặt|ngân hàng|cash|bank|ví/i.test(activeItem.label)


              return (
                <div key={i} className="flex justify-between items-center text-xs border-b border-glass-border/30 pb-1.5 last:border-b-0 last:pb-0">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{asset.name}</span>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {isCash ? (
                        asset.currency === 'USD'
                          ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(asset.quantity)
                          : VND.format(asset.quantity)
                      ) : (
                        <>
                          {asset.quantity.toLocaleString('vi-VN', { maximumFractionDigits: 8 })} {asset.ticker || ''}
                        </>
                      )}
                    </span>
                    {!isCash && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {asset.currency === 'USD' ? (
                          <>
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(asset.quantity * asset.unit_price)}
                            <span className="text-[9px] text-slate-400/80 block">
                              ≈ {VND.format(asset.quantity * asset.unit_price * 25000)}
                            </span>
                          </>
                        ) : (
                          VND.format(asset.quantity * asset.unit_price)
                        )}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
