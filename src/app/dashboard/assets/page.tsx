import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserAssetAccounts, getUserAssetCategories, getUserCategoriesByType } from '@/lib/data/assets'
import AssetClient from './AssetClient'

export default async function AssetsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [accounts, categories, incomeCategories] = await Promise.all([
    getUserAssetAccounts(user.id),
    getUserAssetCategories(user.id),
    getUserCategoriesByType(user.id, 'income'),
  ])

  return (
    <AssetClient 
      accounts={accounts} 
      categories={categories} 
      incomeCategories={incomeCategories} 
    />
  )
}

