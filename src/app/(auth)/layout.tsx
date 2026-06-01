import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Decorative glass bulb/glow in background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Personal Finance
          </span>
        </div>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="backdrop-blur-xl bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-2xl p-8 sm:px-10">
          {children}
        </div>
      </div>
    </div>
  )
}
