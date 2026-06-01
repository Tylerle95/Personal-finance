import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Redirect to dashboard by default if no 'next' is specified
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Check if next URL starts with '/' (relative redirect) for safety
      const isLocalRedirect = next.startsWith('/')
      const redirectUrl = isLocalRedirect ? `${origin}${next}` : `${origin}/dashboard`
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Redirect to login page on authentication error
  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`)
}
