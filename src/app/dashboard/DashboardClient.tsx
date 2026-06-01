'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/providers'
import { Wallet, ArrowUpRight, ArrowDownRight, LayoutDashboard, Sparkles } from 'lucide-react'
import RippleButton from '@/components/ui/RippleButton'
import NetWorthSummary from '@/components/ui/NetWorthSummary'
import { NetWorthSummary as NetWorthSummaryType } from '@/lib/types/assets'

interface DashboardClientProps {
  user: {
    email?: string
    user_metadata?: {
      full_name?: string
    }
  }
  netWorthSummary: NetWorthSummaryType
}

export default function DashboardClient({ user, netWorthSummary }: DashboardClientProps) {
  const { t } = useLanguage()

  // Get full name from user metadata or fallback to email local part
  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || t('fullNamePlaceholder')

  return (
    <div className="animate-fade-in-up">
      
      {/* Welcome Section */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
            {t('welcome')}, {fullName}!
            <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse hidden sm:inline" />
          </h1>
          <p className="mt-1.5 text-sm dark:text-slate-400 text-slate-500">
            {t('overview')}
          </p>
        </div>
      </div>

      {/* Net Worth Widget */}
      <div className="mb-8">
        <NetWorthSummary summary={netWorthSummary} />
      </div>

      {/* Financial Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Total Balance */}
        <div className="relative overflow-hidden rounded-2xl bg-glass-bg border border-glass-border p-6 shadow-card-shadow hover:scale-[1.01] hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-lg transition-all duration-300 backdrop-blur-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold dark:text-slate-400 text-slate-500">{t('totalBalance')}</span>
            <div className="p-2.5 bg-violet-500/10 text-violet-500 dark:text-violet-400 rounded-xl">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-bold dark:text-white text-slate-900">0 ₫</div>
          <div className="mt-2 text-xs dark:text-slate-500 text-slate-400 font-medium">
            {t('lastUpdated')}
          </div>
        </div>

        {/* Card 2: Income Placeholder */}
        <div className="relative overflow-hidden rounded-2xl bg-glass-bg border border-glass-border p-6 shadow-card-shadow hover:scale-[1.01] hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg transition-all duration-300 backdrop-blur-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold dark:text-slate-400 text-slate-500">{t('monthlyIncome')}</span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-xl">
              <ArrowDownRight className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-bold dark:text-white text-slate-900">0 ₫</div>
          <div className="mt-2 text-xs dark:text-slate-500 text-slate-400 font-medium">
            {t('transactionCount', { count: 0 })}
          </div>
        </div>

        {/* Card 3: Expenses Placeholder */}
        <div className="relative overflow-hidden rounded-2xl bg-glass-bg border border-glass-border p-6 shadow-card-shadow hover:scale-[1.01] hover:-translate-y-1 hover:border-rose-500/40 hover:shadow-lg transition-all duration-300 backdrop-blur-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold dark:text-slate-400 text-slate-500">{t('monthlyExpense')}</span>
            <div className="p-2.5 bg-rose-500/10 text-rose-500 dark:text-rose-400 rounded-xl">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-bold dark:text-white text-slate-900">0 ₫</div>
          <div className="mt-2 text-xs dark:text-slate-500 text-slate-400 font-medium">
            {t('transactionCount', { count: 0 })}
          </div>
        </div>
      </div>

      {/* Empty State / Next steps placeholder */}
      <div className="border border-dashed dark:border-slate-800 border-slate-300 rounded-2xl p-12 text-center dark:bg-slate-900/20 bg-slate-50/40 backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl dark:bg-slate-900 bg-white dark:text-slate-400 text-slate-500 border dark:border-slate-800 border-slate-200 shadow-md mb-5">
          <LayoutDashboard className="h-6 w-6 text-violet-500" />
        </div>
        <h3 className="text-lg font-bold dark:text-white text-slate-900 mb-1.5">{t('noTransactions')}</h3>
        <p className="dark:text-slate-400 text-slate-500 text-sm max-w-md mx-auto mb-7 leading-relaxed">
          {t('dashboardEmptyStateDesc')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3.5">
          <RippleButton className="w-full sm:w-auto rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-600/15 hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer">
            {t('addTransaction')}
          </RippleButton>
          <Link href="/dashboard/assets" className="w-full sm:w-auto">
            <RippleButton className="w-full rounded-xl dark:bg-slate-900/60 bg-white hover:bg-slate-100 dark:hover:bg-slate-800 border dark:border-slate-800 border-slate-200 text-sm font-bold dark:text-slate-300 text-slate-700 px-5 py-2.5 shadow-sm transition-all duration-200 active:scale-[0.96] cursor-pointer">
              {t('manageCategories')}
            </RippleButton>
          </Link>
        </div>
      </div>
    </div>
  )
}
