'use client'

import React from 'react'
import { useTheme, useLanguage } from '@/components/providers'
import { Sun, Moon, Globe } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme, toggleTheme } = useTheme()
  const { locale, setLocale, t } = useLanguage()

  return (
    <div className="relative flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 transition-colors duration-300 bg-linear-to-br dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 from-slate-50 via-indigo-50/20 to-violet-100/30">
      
      {/* Upper Right Action Toolbar */}
      <div className="absolute top-6 right-6 flex items-center gap-3.5 z-50">
        {/* Language Switcher Button */}
        <button
          onClick={() => setLocale(locale === 'vi' ? 'en' : 'vi')}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-800 dark:text-slate-300 border-slate-200 bg-white/70 hover:bg-slate-50 text-slate-600 shadow-sm transition-all duration-200 active:scale-[0.96] cursor-pointer"
          title="Switch Language"
        >
          <Globe className="h-3.5 w-3.5 text-violet-500" />
          <span>{locale === 'vi' ? 'EN' : 'VI'}</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center p-2 rounded-full border dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-800 dark:text-yellow-400 border-slate-200 bg-white/70 hover:bg-slate-50 text-violet-600 shadow-sm transition-all duration-200 active:scale-[0.96] cursor-pointer"
          title="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
        {/* Decorative glass bulb/glow in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 dark:bg-violet-600/10 bg-violet-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-60 h-60 dark:bg-indigo-600/10 bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Logo and App Title */}
        <div className="flex justify-center items-center gap-2.5 mb-6 animate-fade-in-up">
          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="text-xl font-bold tracking-tight dark:text-white text-slate-900">
            {t('appName')}
          </span>
        </div>
      </div>

      {/* Main card viewport */}
      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up">
        <div className="backdrop-blur-xl dark:bg-slate-900/40 bg-white/80 border dark:border-slate-800/80 border-slate-200/80 rounded-2xl shadow-xl dark:shadow-2xl/10 shadow-slate-100 p-8 sm:px-10">
          {children}
        </div>
      </div>
    </div>
  )
}

