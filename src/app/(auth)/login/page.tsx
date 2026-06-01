'use client'

import React, { useActionState } from 'react'
import Link from 'next/link'
import { signIn } from '@/app/actions/auth'
import { useLanguage } from '@/components/providers'
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react'

const initialState = {
  error: null as string | null,
  success: false,
  message: null as string | null,
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, initialState)
  const { t } = useLanguage()

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight dark:text-white text-slate-900">
          {t('loginTitle')}
        </h2>
        <p className="mt-2 text-sm dark:text-slate-400 text-slate-500 leading-relaxed">
          {t('loginSubtitle')}
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        {state?.error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-250">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p className="font-medium">{state.error}</p>
          </div>
        )}

        {/* Email Input with Material Floating Label */}
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder=" "
            className="peer block w-full rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-slate-950/40 bg-white/40 pt-6 pb-2 pl-10 pr-3 text-sm dark:text-white text-slate-900 outline-none transition-all duration-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder-transparent"
          />
          <div className="pointer-events-none absolute top-4.5 left-3 flex items-center">
            <Mail className="h-4 w-4 text-slate-500 transition-colors duration-200 peer-focus:text-violet-500" />
          </div>
          <label
            htmlFor="email"
            className="pointer-events-none absolute left-10 top-3 text-xs font-semibold text-slate-400 dark:text-slate-500 transition-all duration-250 
                       peer-placeholder-shown:text-sm peer-placeholder-shown:top-4.5 peer-placeholder-shown:font-normal
                       peer-focus:text-xs peer-focus:top-1.5 peer-focus:text-violet-500 peer-focus:font-semibold
                       peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-violet-500 peer-[&:not(:placeholder-shown)]:font-semibold"
          >
            {t('email')}
          </label>
        </div>

        {/* Password Input with Material Floating Label */}
        <div className="space-y-2">
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder=" "
              className="peer block w-full rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-slate-950/40 bg-white/40 pt-6 pb-2 pl-10 pr-3 text-sm dark:text-white text-slate-900 outline-none transition-all duration-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder-transparent"
            />
            <div className="pointer-events-none absolute top-4.5 left-3 flex items-center">
              <Lock className="h-4 w-4 text-slate-500 transition-colors duration-200 peer-focus:text-violet-500" />
            </div>
            <label
              htmlFor="password"
              className="pointer-events-none absolute left-10 top-3 text-xs font-semibold text-slate-400 dark:text-slate-500 transition-all duration-250 
                         peer-placeholder-shown:text-sm peer-placeholder-shown:top-4.5 peer-placeholder-shown:font-normal
                         peer-focus:text-xs peer-focus:top-1.5 peer-focus:text-violet-500 peer-focus:font-semibold
                         peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-violet-500 peer-[&:not(:placeholder-shown)]:font-semibold"
            >
              {t('password')}
            </label>
          </div>
          
          <div className="flex justify-end px-1">
            <a
              href="#"
              className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors duration-150"
            >
              {t('forgotPassword')}
            </a>
          </div>
        </div>

        {/* Premium Action Button */}
        <button
          type="submit"
          disabled={isPending}
          className="relative flex w-full justify-center items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/25 hover:from-violet-500 hover:to-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('loadingAuth')}
            </>
          ) : (
            t('loginButton')
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm dark:text-slate-400 text-slate-500">
        {t('noAccount')}{' '}
        <Link
          href="/register"
          className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors duration-150"
        >
          {t('signUpFree')}
        </Link>
      </p>
    </>
  )
}

