import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AssetCategory } from '@/lib/types/assets'
import CategoryClient from './CategoryClient'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all categories for this user at once
  const { data: categoriesData, error } = await supabase
    .from('asset_categories')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  if (error) {
    console.error('[CategoriesPage] error fetching categories:', error.message)
  }

  const categories = (categoriesData ?? []) as AssetCategory[]

  return <CategoryClient categories={categories} />
}
