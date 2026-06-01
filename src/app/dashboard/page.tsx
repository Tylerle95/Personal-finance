import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import { LogOut, LayoutDashboard, Wallet, ArrowUpRight, ArrowDownRight, Award } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get full name from user metadata or fallback to email local part
  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Khách'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Glow backgrounds */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Personal Finance
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800 hidden sm:inline-block">
              {user.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-lg transition-all duration-200"
              >
                <LogOut className="h-3.5 w-3.5" />
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Chào mừng trở lại, {fullName}!
          </h1>
          <p className="mt-1 text-slate-400">
            Dưới đây là tổng quan tài chính cá nhân của bạn ngày hôm nay.
          </p>
        </div>

        {/* Financial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Total Balance */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 p-6 shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-400">Tổng số dư</span>
              <div className="p-2 bg-violet-500/10 text-violet-400 rounded-lg">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">0 ₫</div>
            <div className="mt-1.5 text-xs text-slate-500">
              Cập nhật gần nhất: vừa xong
            </div>
          </div>

          {/* Card 2: Income Placeholder */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 p-6 shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-400">Thu nhập tháng này</span>
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <ArrowDownRight className="h-5 w-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">0 ₫</div>
            <div className="mt-1.5 text-xs text-slate-500">
              0 giao dịch
            </div>
          </div>

          {/* Card 3: Expenses Placeholder */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 p-6 shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-400">Chi tiêu tháng này</span>
              <div className="p-2 bg-red-500/10 text-red-400 rounded-lg">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">0 ₫</div>
            <div className="mt-1.5 text-xs text-slate-500">
              0 giao dịch
            </div>
          </div>
        </div>

        {/* Empty State / Next steps placeholder */}
        <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center bg-slate-950/40">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-slate-500 border border-slate-800 mb-4">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-white mb-1">Chưa có dữ liệu giao dịch</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
            Tài khoản của bạn đã được kết nối an toàn với Supabase Auth. Hãy bắt đầu quản lý danh mục và tạo giao dịch đầu tiên.
          </p>
          <div className="flex justify-center gap-3">
            <button className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/15 hover:from-violet-500 hover:to-indigo-500 transition-all duration-200">
              Thêm giao dịch mới
            </button>
            <button className="rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sm font-semibold text-slate-300 px-4 py-2 transition-all duration-200">
              Quản lý danh mục
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
