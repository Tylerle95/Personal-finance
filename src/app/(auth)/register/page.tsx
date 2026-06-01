'use client'

import React, { useActionState } from 'react'
import Link from 'next/link'
import { signUp } from '@/app/actions/auth'
import { useLanguage } from '@/components/providers'
import { User, Mail, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import RippleButton from '@/components/ui/RippleButton'

const initialState = {
  error: null as string | null,
  success: false,
  message: null as string | null,
}

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState)
  const { t } = useLanguage()

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight dark:text-white text-slate-900">
          {t('registerTitle')}
        </h2>
        <p className="mt-2 text-sm dark:text-slate-400 text-slate-500 leading-relaxed">
          {t('registerSubtitle')}
        </p>
      </div>

      {state?.success ? (
        <div className="space-y-6 py-4 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5 animate-bounce">
            <CheckCircle className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold dark:text-white text-slate-900">{t('regSuccess')}</h3>
            <p className="text-sm dark:text-slate-400 text-slate-500 px-2 leading-relaxed">
              {state.message || t('regSuccessDesc')}
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex w-full justify-center items-center rounded-xl bg-linear-to-r from-violet-600 via-fuchsia-600 to-pink-500 px-4 py-3 text-sm font-bold text-white shadow-xl shadow-fuchsia-500/20 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-400 transition-all duration-250 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {t('signInNow')}
          </Link>
        </div>
      ) : (
        <form action={formAction} className="space-y-5">
          {state?.error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-250">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p className="font-medium">{state.error}</p>
            </div>
          )}

          {/* Full Name Input with Material Floating Label */}
          <div className="relative">
            <input
              id="full_name"
              name="full_name"
              type="text"
              autoComplete="name"
              required
              placeholder=" "
              className="peer block w-full rounded-xl border dark:border-slate-800/80 border-slate-200 dark:bg-slate-950/60 bg-white pt-6 pb-2 pl-10 pr-3 text-sm dark:text-white text-slate-900 outline-none transition-all duration-200 focus:border-fuchsia-500 dark:focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 placeholder-transparent shadow-xs"
            />
            <div className="pointer-events-none absolute top-4.5 left-3 flex items-center">
              <User className="h-4 w-4 text-slate-500 transition-colors duration-200 peer-focus:text-fuchsia-500" />
            </div>
            <label
              htmlFor="full_name"
              className="pointer-events-none absolute left-10 top-3 text-xs font-semibold text-slate-400 dark:text-slate-500 transition-all duration-250 
                         peer-placeholder-shown:text-sm peer-placeholder-shown:top-4.5 peer-placeholder-shown:font-normal
                         peer-focus:text-xs peer-focus:top-1.5 peer-focus:text-fuchsia-500 peer-focus:font-semibold
                         peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-fuchsia-500 peer-[&:not(:placeholder-shown)]:font-semibold"
            >
              {t('fullName')}
            </label>
          </div>

          {/* Email Input with Material Floating Label */}
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder=" "
              className="peer block w-full rounded-xl border dark:border-slate-800/80 border-slate-200 dark:bg-slate-950/60 bg-white pt-6 pb-2 pl-10 pr-3 text-sm dark:text-white text-slate-900 outline-none transition-all duration-200 focus:border-fuchsia-500 dark:focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 placeholder-transparent shadow-xs"
            />
            <div className="pointer-events-none absolute top-4.5 left-3 flex items-center">
              <Mail className="h-4 w-4 text-slate-500 transition-colors duration-200 peer-focus:text-fuchsia-500" />
            </div>
            <label
              htmlFor="email"
              className="pointer-events-none absolute left-10 top-3 text-xs font-semibold text-slate-400 dark:text-slate-500 transition-all duration-250 
                         peer-placeholder-shown:text-sm peer-placeholder-shown:top-4.5 peer-placeholder-shown:font-normal
                         peer-focus:text-xs peer-focus:top-1.5 peer-focus:text-fuchsia-500 peer-focus:font-semibold
                         peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-fuchsia-500 peer-[&:not(:placeholder-shown)]:font-semibold"
            >
              {t('email')}
            </label>
          </div>

          {/* Password Input with Material Floating Label */}
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder=" "
              className="peer block w-full rounded-xl border dark:border-slate-800/80 border-slate-200 dark:bg-slate-950/60 bg-white pt-6 pb-2 pl-10 pr-3 text-sm dark:text-white text-slate-900 outline-none transition-all duration-200 focus:border-fuchsia-500 dark:focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 placeholder-transparent shadow-xs"
            />
            <div className="pointer-events-none absolute top-4.5 left-3 flex items-center">
              <Lock className="h-4 w-4 text-slate-500 transition-colors duration-200 peer-focus:text-fuchsia-500" />
            </div>
            <label
              htmlFor="password"
              className="pointer-events-none absolute left-10 top-3 text-xs font-semibold text-slate-400 dark:text-slate-500 transition-all duration-250 
                         peer-placeholder-shown:text-sm peer-placeholder-shown:top-4.5 peer-placeholder-shown:font-normal
                         peer-focus:text-xs peer-focus:top-1.5 peer-focus:text-fuchsia-500 peer-focus:font-semibold
                         peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-fuchsia-500 peer-[&:not(:placeholder-shown)]:font-semibold"
            >
              {t('password')}
            </label>
          </div>

          {/* Premium Submit Button */}
          <RippleButton
            type="submit"
            disabled={isPending}
            className="relative flex w-full justify-center items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 via-fuchsia-600 to-pink-500 px-4 py-3 text-sm font-bold text-white shadow-xl shadow-fuchsia-500/20 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-250 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('loadingReg')}
              </>
            ) : (
              t('registerButton')
            )}
          </RippleButton>
        </form>
      )}

      {!state?.success && (
        <p className="mt-6 text-center text-sm dark:text-slate-400 text-slate-500">
          {t('hasAccount')}{' '}
          <Link
            href="/login"
            className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors duration-150"
          >
            {t('loginTitle')}
          </Link>
        </p>
      )}
    </>
  )
}

