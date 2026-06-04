'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/actions/auth'
import { useTheme, useLanguage } from '@/components/providers'
import { Menu, LogOut, Wallet, LayoutDashboard, Sun, Moon, Globe, FolderKanban, Receipt, ArrowLeftRight, ChevronDown, ChevronRight } from 'lucide-react'
import RippleButton from '@/components/ui/RippleButton'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import { getHeaderRates } from '@/app/actions/assets'

interface DashboardLayoutClientProps {
  user: {
    email?: string
    user_metadata?: {
      full_name?: string
    }
  }
  children: React.ReactNode
}

export default function DashboardLayoutClient({ user, children }: DashboardLayoutClientProps) {
  const { theme, toggleTheme } = useTheme()
  const { locale, setLocale, t } = useLanguage()
  const pathname = usePathname()
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar_expanded')
      return saved !== null ? saved === 'true' : true
    }
    return true
  })
  const [mounted, setMounted] = useState<boolean>(false)
  const logoutFormRef = useRef<HTMLFormElement>(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [rates, setRates] = useState<{ btc: number | null; sjc: number | null }>({ btc: null, sjc: null })
  const [ratesLoading, setRatesLoading] = useState<boolean>(true)
  
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.startsWith('/dashboard/categories')
    }
    return false
  })
  const [currentTabType, setCurrentTabType] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      return params.get('type') || 'asset'
    }
    return 'asset'
  })

  // Sync state when pathname changes during render
  const [lastPathname, setLastPathname] = useState<string>('')
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    if (pathname.startsWith('/dashboard/categories')) {
      setIsCategoriesExpanded(true)
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        setCurrentTabType(params.get('type') || 'asset')
      }
    }
  }

  // Sync mount state
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Fetch rates
  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await getHeaderRates()
        setRates(res)
      } catch (err) {
        console.error('Failed to fetch header rates:', err)
      } finally {
        setRatesLoading(false)
      }
    }
    if (mounted) {
      fetchRates()
      const interval = setInterval(fetchRates, 60000)
      return () => clearInterval(interval)
    }
  }, [mounted])

  // Save changes to localStorage
  const handleToggleSidebar = () => {
    const nextState = !isSidebarExpanded
    setIsSidebarExpanded(nextState)
    localStorage.setItem('sidebar_expanded', String(nextState))
  }

  const handleToggleCategories = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isSidebarExpanded) {
      setIsSidebarExpanded(true)
      localStorage.setItem('sidebar_expanded', 'true')
      setIsCategoriesExpanded(true)
    } else {
      setIsCategoriesExpanded(!isCategoriesExpanded)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col relative transition-colors duration-300">
      
      {/* Decorative Glow backgrounds */}
      <div className="absolute top-0 right-1/4 w-96 h-96 dark:bg-indigo-600/8 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 dark:bg-violet-600/8 bg-violet-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <header className="border-b border-glass-border bg-glass-bg backdrop-blur-lg fixed top-0 inset-x-0 h-16 z-50 transition-colors duration-300 shadow-sm dark:shadow-none">
        <div className="h-full px-4 flex items-center justify-between">
          
          {/* Logo, Hamburger & Brand */}
          <div className="flex items-center gap-3">
            {/* Hamburger Button (hidden on mobile, as bottom nav is used) */}
            <RippleButton
              onClick={handleToggleSidebar}
              className="hidden sm:flex items-center justify-center p-2 rounded-lg border dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-800 border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all cursor-pointer"
              title="Toggle Menu"
            >
              <Menu className="h-5 w-5" />
            </RippleButton>

            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-linear-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-lg font-bold tracking-tight dark:text-white text-slate-900">
                {t('appName')}
              </span>
            </Link>

            {/* Live Ticker Badges */}
            <div className="hidden md:flex items-center gap-2 ml-4">
              {/* BTC Ticker */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/15" title="Giá BTC Live (USD)">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>BTC:</span>
                <span>
                  {rates.btc !== null 
                    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(rates.btc / 25000) 
                    : (ratesLoading ? '...' : 'N/A')}
                </span>
              </div>
              {/* SJC Ticker */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/15" title="Giá Vàng SJC Live (lượng)">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                <span>SJC:</span>
                <span>
                  {rates.sjc !== null 
                    ? `${(rates.sjc / 1000000).toFixed(1)}M ₫` 
                    : (ratesLoading ? '...' : 'N/A')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-3.5">
            {/* User Badge */}
            <span className="text-xs dark:text-slate-400 text-slate-500 dark:bg-slate-900/60 bg-slate-100 px-3 py-1.5 rounded-full border dark:border-slate-800/80 border-slate-200 hidden md:inline-block font-medium">
              {user.email}
            </span>

            {/* Language Toggle */}
            <RippleButton
              onClick={() => setLocale(locale === 'vi' ? 'en' : 'vi')}
              className="flex items-center justify-center p-2 rounded-lg border dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-800 border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200 active:scale-[0.96] cursor-pointer"
              title="Switch Language"
            >
              <Globe className="h-4 w-4 text-violet-500" />
            </RippleButton>

            {/* Theme Toggle */}
            <RippleButton
              onClick={toggleTheme}
              className="flex items-center justify-center p-2 rounded-lg border dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-800 border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200 active:scale-[0.96] cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-yellow-400" />
              ) : (
                <Moon className="h-4 w-4 text-violet-600" />
              )}
            </RippleButton>

            {/* Logout Form */}
            <form ref={logoutFormRef} action={signOut}>
              <RippleButton
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-2 text-xs font-semibold dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 dark:bg-slate-900/60 bg-slate-100 hover:bg-red-500/15 dark:hover:bg-red-500/15 border dark:border-slate-800 border-slate-200 px-3.5 py-2 rounded-lg transition-all duration-200 active:scale-[0.96] cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t('signOut')}</span>
              </RippleButton>
            </form>
          </div>
        </div>
      </header>

      {/* Main Layout Container (Sidebar + Content) */}
      <div className="flex flex-1 pt-16 relative">
        
        {/* Collapsible Sidebar (hidden on mobile) */}
        <aside
          className={`hidden sm:flex flex-col fixed left-0 top-16 bottom-0 z-40 bg-glass-bg border-r border-glass-border backdrop-blur-lg transition-all duration-300 ease-in-out ${
            mounted && !isSidebarExpanded ? 'w-[72px]' : 'w-60'
          }`}
        >
          <nav className="flex-1 py-4 px-3 flex flex-col gap-1.5">
            {/* Nav: Overview (Tổng quan) */}
            <Link
              href="/dashboard"
              className={`flex rounded-xl transition-all duration-200 active:scale-[0.98] ${
                mounted && !isSidebarExpanded
                  ? 'items-center justify-center p-3'
                  : 'items-center gap-3 px-4 py-3'
              } ${
                pathname === '/dashboard'
                  ? 'bg-violet-500/10 text-primary font-bold border border-violet-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-white border border-transparent'
              }`}
              title={mounted && !isSidebarExpanded ? t('navOverview') : undefined}
            >
              <LayoutDashboard className="h-5 w-5 shrink-0" />
              {(!mounted || isSidebarExpanded) && (
                <span className="text-sm font-semibold truncate">
                  {t('navOverview')}
                </span>
              )}
            </Link>

            {/* Nav: Assets (Tài sản & Số dư) */}
            <Link
              href="/dashboard/assets"
              className={`flex rounded-xl transition-all duration-200 active:scale-[0.98] ${
                mounted && !isSidebarExpanded
                  ? 'items-center justify-center p-3'
                  : 'items-center gap-3 px-4 py-3'
              } ${
                pathname.startsWith('/dashboard/assets')
                  ? 'bg-violet-500/10 text-primary font-bold border border-violet-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-white border border-transparent'
              }`}
              title={mounted && !isSidebarExpanded ? t('navAssets') : undefined}
            >
              <Wallet className="h-5 w-5 shrink-0" />
              {(!mounted || isSidebarExpanded) && (
                <span className="text-sm font-semibold truncate">
                  {t('navAssets')}
                </span>
              )}
            </Link>

            {/* Nav: Spending & Bills (Chi tiêu & Hóa đơn) */}
            <Link
              href="/dashboard/spending"
              className={`flex rounded-xl transition-all duration-200 active:scale-[0.98] ${
                mounted && !isSidebarExpanded
                  ? 'items-center justify-center p-3'
                  : 'items-center gap-3 px-4 py-3'
              } ${
                pathname.startsWith('/dashboard/spending')
                  ? 'bg-violet-500/10 text-primary font-bold border border-violet-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-white border border-transparent'
              }`}
              title={mounted && !isSidebarExpanded ? t('navSpending') : undefined}
            >
              <Receipt className="h-5 w-5 shrink-0" />
              {(!mounted || isSidebarExpanded) && (
                <span className="text-sm font-semibold truncate">
                  {t('navSpending')}
                </span>
              )}
            </Link>

            {/* Nav: Transaction History (Lịch sử giao dịch) */}
            <Link
              href="/dashboard/transactions"
              className={`flex rounded-xl transition-all duration-200 active:scale-[0.98] ${
                mounted && !isSidebarExpanded
                  ? 'items-center justify-center p-3'
                  : 'items-center gap-3 px-4 py-3'
              } ${
                pathname.startsWith('/dashboard/transactions')
                  ? 'bg-violet-500/10 text-primary font-bold border border-violet-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-white border border-transparent'
              }`}
              title={mounted && !isSidebarExpanded ? t('navTransactions') : undefined}
            >
              <ArrowLeftRight className="h-5 w-5 shrink-0" />
              {(!mounted || isSidebarExpanded) && (
                <span className="text-sm font-semibold truncate">
                  {t('navTransactions')}
                </span>
              )}
            </Link>

            {/* Nav: Categories (Danh mục của tôi) */}
            <button
              onClick={handleToggleCategories}
              className={`w-full flex rounded-xl transition-all duration-200 active:scale-[0.98] cursor-pointer text-left ${
                mounted && !isSidebarExpanded
                  ? 'items-center justify-center p-3'
                  : 'items-center justify-between px-4 py-3'
              } ${
                pathname.startsWith('/dashboard/categories')
                  ? 'bg-violet-500/10 text-primary font-bold border border-violet-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-white border border-transparent'
              }`}
              title={mounted && !isSidebarExpanded ? t('navCategories') : undefined}
            >
              <div className="flex items-center gap-3">
                <FolderKanban className="h-5 w-5 shrink-0" />
                {(!mounted || isSidebarExpanded) && (
                  <span className="text-sm font-semibold truncate">
                    {t('navCategories')}
                  </span>
                )}
              </div>
              {(!mounted || isSidebarExpanded) && (
                isCategoriesExpanded ? <ChevronDown className="h-4 w-4 text-slate-450" /> : <ChevronRight className="h-4 w-4 text-slate-450" />
              )}
            </button>

            {/* Collapsible Submenu list */}
            {(!mounted || isSidebarExpanded) && isCategoriesExpanded && (
              <div className="pl-3.5 flex flex-col gap-1 mt-0.5 animate-fade-in">
                <Link
                  href="/dashboard/categories?type=asset"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    pathname.startsWith('/dashboard/categories') && currentTabType === 'asset'
                      ? 'text-primary font-bold bg-violet-500/5 border border-violet-500/10'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-transparent'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    pathname.startsWith('/dashboard/categories') && currentTabType === 'asset' ? 'bg-violet-500' : 'bg-slate-400'
                  }`} />
                  Danh mục tài sản
                </Link>
                <Link
                  href="/dashboard/categories?type=spending"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    pathname.startsWith('/dashboard/categories') && currentTabType === 'spending'
                      ? 'text-primary font-bold bg-violet-500/5 border border-violet-500/10'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-transparent'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    pathname.startsWith('/dashboard/categories') && currentTabType === 'spending' ? 'bg-violet-500' : 'bg-slate-400'
                  }`} />
                  Danh mục chi tiêu
                </Link>
                <Link
                  href="/dashboard/categories?type=income"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    pathname.startsWith('/dashboard/categories') && currentTabType === 'income'
                      ? 'text-primary font-bold bg-violet-500/5 border border-violet-500/10'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-transparent'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    pathname.startsWith('/dashboard/categories') && currentTabType === 'income' ? 'bg-violet-500' : 'bg-slate-400'
                  }`} />
                  Danh mục thu nhập
                </Link>
              </div>
            )}
          </nav>
        </aside>

        {/* Content Panel Wrapper */}
        <main
          className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
            mounted && !isSidebarExpanded
              ? 'sm:pl-[72px]'
              : 'sm:pl-60'
          } pb-20 sm:pb-4`}
        >
          <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (visible only on mobile) */}
      <nav className="fixed bottom-0 inset-x-0 bg-glass-bg border-t border-glass-border backdrop-blur-lg z-50 sm:hidden shadow-lg animate-slide-up">
        <div className="flex justify-around items-center h-16">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all active:scale-[0.97] cursor-pointer ${
              pathname === '/dashboard'
                ? 'text-primary font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-foreground'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-[10px] tracking-wide">{t('navOverview')}</span>
          </Link>
          <Link
            href="/dashboard/assets"
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all active:scale-[0.97] cursor-pointer ${
              pathname.startsWith('/dashboard/assets')
                ? 'text-primary font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-foreground'
            }`}
          >
            <Wallet className="h-5 w-5" />
            <span className="text-[10px] tracking-wide">{t('navAssets')}</span>
          </Link>
          <Link
            href="/dashboard/spending"
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all active:scale-[0.97] cursor-pointer ${
              pathname.startsWith('/dashboard/spending')
                ? 'text-primary font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-foreground'
            }`}
          >
            <Receipt className="h-5 w-5" />
            <span className="text-[10px] tracking-wide">{t('navSpending')}</span>
          </Link>
          <Link
            href="/dashboard/transactions"
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all active:scale-[0.97] cursor-pointer ${
              pathname.startsWith('/dashboard/transactions')
                ? 'text-primary font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-foreground'
            }`}
          >
            <ArrowLeftRight className="h-5 w-5" />
            <span className="text-[10px] tracking-wide">{t('navTransactions')}</span>
          </Link>
          <Link
            href="/dashboard/categories"
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all active:scale-[0.97] cursor-pointer ${
              pathname.startsWith('/dashboard/categories')
                ? 'text-primary font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-foreground'
            }`}
          >
            <FolderKanban className="h-5 w-5" />
            <span className="text-[10px] tracking-wide">{t('navCategories')}</span>
          </Link>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
        onConfirm={() => {
          logoutFormRef.current?.requestSubmit()
        }}
        onClose={() => setShowLogoutModal(false)}
        isDanger={true}
      />
    </div>
  )
}
