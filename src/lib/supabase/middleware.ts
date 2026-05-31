import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect /(main) routes
  const isProtectedPath = ['/dashboard', '/create', '/projects', '/coach', '/voice-dna', '/release-kit', '/admin'].some(
    (path) => request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if logged in and trying to access login/onboarding
  const isAuthPath = ['/login', '/onboarding'].includes(request.nextUrl.pathname)
  if (isAuthPath && user) {
    // Check if onboarding is completed
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single()

    if (request.nextUrl.pathname === '/login') {
      const url = request.nextUrl.clone()
      url.pathname = profile?.onboarding_completed ? '/dashboard' : '/onboarding'
      return NextResponse.redirect(url)
    }

    if (request.nextUrl.pathname === '/onboarding' && profile?.onboarding_completed) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
