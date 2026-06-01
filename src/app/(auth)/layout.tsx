'use client'

import React from 'react'
import { useTheme, useLanguage } from '@/components/providers'
import { Sun, Moon, Globe } from 'lucide-react'
import RippleButton from '@/components/ui/RippleButton'

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
        <RippleButton
          onClick={() => setLocale(locale === 'vi' ? 'en' : 'vi')}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-800 dark:text-slate-300 border-slate-200 bg-white/70 hover:bg-slate-50 text-slate-600 shadow-sm transition-all duration-200 active:scale-[0.96] cursor-pointer"
          title="Switch Language"
        >
          <Globe className="h-3.5 w-3.5 text-violet-500" />
          <span>{locale === 'vi' ? 'EN' : 'VI'}</span>
        </RippleButton>

        {/* Theme Toggle Button */}
        <RippleButton
          onClick={toggleTheme}
          className="flex items-center justify-center p-2 rounded-full border dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-800 dark:text-yellow-400 border-slate-200 bg-white/70 hover:bg-slate-50 text-violet-600 shadow-sm transition-all duration-200 active:scale-[0.96] cursor-pointer"
          title="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </RippleButton>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
        {/* Decorative ambient glowing backdrops for premium premium high-contrast feel */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 dark:bg-fuchsia-500/15 bg-violet-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 dark:bg-violet-600/15 bg-indigo-500/8 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 dark:bg-pink-500/10 bg-fuchsia-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Logo and App Title */}
        <div className="flex justify-center items-center gap-3 mb-6 animate-fade-in-up">
          <div className="h-11 w-11 rounded-xl bg-linear-to-br from-violet-600 via-fuchsia-600 to-pink-500 flex items-center justify-center shadow-lg shadow-fuchsia-500/20 ring-1 ring-white/10">
            <span className="text-white font-black text-2xl tracking-tighter">F</span>
          </div>
          <span className="text-2xl font-black tracking-tight dark:text-white text-slate-900 bg-clip-text">
            {t('appName')}
          </span>
        </div>
      </div>

      {/* Main card viewport */}
      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up">
        <div className="backdrop-blur-2xl dark:bg-slate-900/60 bg-white/95 border dark:border-slate-800/80 border-slate-200/90 rounded-3xl shadow-2xl dark:shadow-fuchsia-500/5 shadow-violet-500/5 p-8 sm:px-10 ring-1 ring-black/5 dark:ring-white/5 relative overflow-hidden">
          {/* Subtle accent border top */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-linear-to-r from-violet-500 via-fuchsia-500 to-pink-500 opacity-60" />
          {children}
        </div>
      </div>
    </div>
  )
}

