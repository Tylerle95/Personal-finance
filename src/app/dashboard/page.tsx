import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'
import { getUserAssetAccounts, getNetWorthSummary } from '@/lib/data/assets'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const accounts = await getUserAssetAccounts(user.id)
  const netWorthSummary = getNetWorthSummary(accounts)

  return <DashboardClient user={user} netWorthSummary={netWorthSummary} />
}
