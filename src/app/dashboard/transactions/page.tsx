import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserTransactions, getUserTransactionsCount } from '@/lib/data/transactions'
import TransactionsClient from './TransactionsClient'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const resolvedParams = await searchParams
  const currentPage = Number(resolvedParams.page || '1')
  const limit = 20

  const [transactions, totalCount] = await Promise.all([
    getUserTransactions(user.id, currentPage, limit),
    getUserTransactionsCount(user.id),
  ])

  return (
    <TransactionsClient
      transactions={transactions}
      totalCount={totalCount}
      currentPage={currentPage}
      limit={limit}
    />
  )
}
