import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserAssetCategories } from '@/lib/data/assets'
import CategoryClient from './CategoryClient'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const categories = await getUserAssetCategories(user.id)

  return <CategoryClient categories={categories} />
}
