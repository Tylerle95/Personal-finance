import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserCategoriesByType } from '@/lib/data/assets'
import CategoryClient from './CategoryClient'

interface PageProps {
  searchParams: Promise<{ type?: string }>
}

export default async function CategoriesPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const resolvedParams = await searchParams
  const typeParam = resolvedParams.type
  const activeType = typeParam === 'spending' ? 'spending' : (typeParam === 'income' ? 'income' : 'asset')

  const categories = await getUserCategoriesByType(user.id, activeType)

  return <CategoryClient categories={categories} activeType={activeType} />
}
