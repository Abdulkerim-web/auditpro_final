import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Role-based access control middleware.
// Supabase auth stores the session in cookies named sb-<project-ref>-auth-token.
// We only check for presence here; role-based routing is handled client-side
// by RoleGuard (which reads the profile from Supabase).

function hasSupabaseSession(request: NextRequest): boolean {
  const cookies = request.cookies.getAll()
  return cookies.some(c => c.name.includes('-auth-token') && c.value.length > 0)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasSession = hasSupabaseSession(request)

  // Public routes — always accessible
  const publicPaths = ['/', '/services', '/about', '/blog', '/contact', '/privacy', '/terms']
  const isPublic = publicPaths.some(p => pathname === p || pathname.startsWith('/blog/'))
  if (isPublic) return NextResponse.next()

  // Auth routes — redirect to dashboard if already logged in
  if (pathname.startsWith('/auth/')) {
    if (hasSession) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Dashboard + client-portal routes — require a session
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/client-portal')) {
    if (!hasSession) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg).*)'],
}
