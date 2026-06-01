'use client'

import React from 'react'
import { useLanguage } from '@/components/providers'
import { Loader2 } from 'lucide-react'

export default function DashboardLoading() {
  const { locale } = useLanguage()
  const loadingText = locale === 'vi' ? 'Đang tải dữ liệu...' : 'Loading data...'

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full animate-fade-in">
      <div className="relative flex items-center justify-center p-8 rounded-2xl bg-glass-bg border border-glass-border backdrop-blur-md shadow-card-shadow">
        <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 to-indigo-500/5 rounded-2xl pointer-events-none" />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <span className="text-sm font-semibold dark:text-slate-400 text-slate-500 tracking-wide animate-pulse">
            {loadingText}
          </span>
        </div>
      </div>
    </div>
  )
}
