import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Role-based access control middleware
// In production: verify Supabase JWT token and check role from DB
// For now: read role from session cookie set at login

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionRole = request.cookies.get('session_role')?.value
  const sessionUser = request.cookies.get('session_user')?.value

  // Public routes — always accessible
  const publicPaths = ['/', '/services', '/about', '/blog', '/contact', '/privacy', '/terms']
  const isPublic = publicPaths.some(p => pathname === p || pathname.startsWith('/blog/'))
  if (isPublic) return NextResponse.next()

  // Auth routes — redirect to dashboard if already logged in
  if (pathname.startsWith('/auth/')) {
    if (sessionUser && sessionRole) {
      const dest = sessionRole === 'client' ? '/client-portal' : '/dashboard'
      return NextResponse.redirect(new URL(dest, request.url))
    }
    return NextResponse.next()
  }

  // Dashboard routes — require auditor or admin role
  if (pathname.startsWith('/dashboard')) {
    if (!sessionUser) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (sessionRole === 'client') {
      // Clients cannot access auditor dashboard
      return NextResponse.redirect(new URL('/client-portal', request.url))
    }
    return NextResponse.next()
  }

  // Client portal routes — require client role
  if (pathname.startsWith('/client-portal')) {
    if (!sessionUser) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (sessionRole === 'auditor' || sessionRole === 'admin') {
      // Auditors get redirected to their dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg).*)'],
}
