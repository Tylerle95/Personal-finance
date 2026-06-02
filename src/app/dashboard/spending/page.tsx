import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserAssetAccounts, getUserSpendingCategories } from '@/lib/data/assets'
import { getUserSpendingTransactions } from '@/lib/data/transactions'
import SpendingClient from './SpendingClient'

export default async function SpendingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [allAccounts, spendingCategories, spendingTransactions] = await Promise.all([
    getUserAssetAccounts(user.id),
    getUserSpendingCategories(user.id),
    getUserSpendingTransactions(user.id),
  ])

  // Filter accounts that represent cash, banks, or wallets (sources of spending)
  const walletAccounts = allAccounts.filter((acc) => {
    const catName = acc.category?.name || ''
    return /tiền mặt|ngân hàng|cash|bank|ví/i.test(catName)
  })

  return (
    <SpendingClient
      walletAccounts={walletAccounts}
      spendingCategories={spendingCategories}
      initialTransactions={spendingTransactions}
    />
  )
}
