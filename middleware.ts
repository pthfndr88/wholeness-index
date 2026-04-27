import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as any)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect coach routes
  if (request.nextUrl.pathname.startsWith('/coach')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()
    if (!profile || !['coach', 'org_admin', 'super_admin'].includes(profile.role)) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth'
      url.searchParams.set('error', 'insufficient_role')
      return NextResponse.redirect(url)
    }
  }

  // Protect platform route — use maybeSingle to handle multiple rows
  if (request.nextUrl.pathname.startsWith('/platform')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    const { data: accessRows } = await supabase
      .from('access')
      .select('id')
      .eq('user_id', user.id)
      .in('product_type', ['full_assessment', 'coaching_bundle'])
      .limit(1)
    if (!accessRows || accessRows.length === 0) {
      return NextResponse.redirect(new URL('/upgrade', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook).*)'],
}
