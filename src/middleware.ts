import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Auth is handled client-side via @supabase/supabase-js (localStorage sessions)
// and RoleGuard components. The middleware must not redirect based on cookie
// presence, because client-side auth stores sessions in localStorage, not cookies.

export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg).*)'],
}
