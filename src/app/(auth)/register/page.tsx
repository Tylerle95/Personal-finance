'use client'

import React, { useActionState } from 'react'
import Link from 'next/link'
import { signUp } from '@/app/actions/auth'
import { User, Mail, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

const initialState = {
  error: null as string | null,
  success: false,
  message: null as string | null,
}

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState)

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Đăng ký tài khoản
        </h2>
        <p className="mt-1.5 text-sm text-slate-400">
          Tạo tài khoản mới để bắt đầu thiết lập tài chính thông minh
        </p>
      </div>

      {state?.success ? (
        <div className="space-y-6 py-4 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white">Đăng ký thành công!</h3>
            <p className="text-sm text-slate-400 px-2 leading-relaxed">
              {state.message || 'Tài khoản của bạn đã được khởi tạo.'}
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex w-full justify-center items-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 hover:from-violet-500 hover:to-indigo-500 transition-all duration-200"
          >
            Đăng nhập ngay
          </Link>
        </div>
      ) : (
        <form action={formAction} className="space-y-5">
          {state?.error && (
            <div className="flex items-center gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3.5 text-sm text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{state.error}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="full_name"
              className="text-xs font-medium uppercase tracking-wider text-slate-400"
            >
              Họ và Tên
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-4 w-4 text-slate-500" />
              </div>
              <input
                id="full_name"
                name="full_name"
                type="text"
                autoComplete="name"
                required
                className="block w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                placeholder="Nguyễn Văn A"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium uppercase tracking-wider text-slate-400"
            >
              Địa chỉ Email
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-4 w-4 text-slate-500" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium uppercase tracking-wider text-slate-400"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-4 w-4 text-slate-500" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="relative flex w-full justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 hover:from-violet-500 hover:to-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang đăng ký...
              </>
            ) : (
              'Đăng ký tài khoản'
            )}
          </button>
        </form>
      )}

      {!state?.success && (
        <p className="mt-6 text-center text-sm text-slate-400">
          Đã có tài khoản?{' '}
          <Link
            href="/login"
            className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
          >
            Đăng nhập
          </Link>
        </p>
      )}
    </>
  )
}
