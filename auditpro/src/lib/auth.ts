// Auth utilities — sets secure cookies for role-based routing
// In production: integrate with Supabase Auth JWT

export type UserRole = 'auditor' | 'client' | 'admin'

export interface SessionUser {
  id: string
  name: string
  email: string
  role: UserRole
  initials: string
}

// Demo users (replace with Supabase auth in production)
export const DEMO_USERS: Record<string, SessionUser & { password: string }> = {
  'beyan@beyanomer.et': {
    id: 'aud-001', name: 'Beyan Omer', email: 'beyan@beyanomer.et',
    role: 'auditor', initials: 'BO', password: 'audit2024'
  },
  'admin@beyanomer.et': {
    id: 'adm-001', name: 'Admin User', email: 'admin@beyanomer.et',
    role: 'admin', initials: 'AU', password: 'admin2024'
  },
  'client@ethiotrading.et': {
    id: 'cli-001', name: 'Abebe Girma', email: 'client@ethiotrading.et',
    role: 'client', initials: 'AG', password: 'client2024'
  },
  'hana@abyssiniahotels.et': {
    id: 'cli-002', name: 'Hana Tesfaye', email: 'hana@abyssiniahotels.et',
    role: 'client', initials: 'HT', password: 'client2024'
  },
}

export function setSession(user: SessionUser) {
  const maxAge = 60 * 60 * 8 // 8 hours
  const secure = process.env.NODE_ENV === 'production'
  document.cookie = `session_user=${encodeURIComponent(JSON.stringify({ id: user.id, name: user.name, email: user.email, initials: user.initials }))};path=/;max-age=${maxAge};samesite=strict${secure ? ';secure' : ''}`
  document.cookie = `session_role=${user.role};path=/;max-age=${maxAge};samesite=strict${secure ? ';secure' : ''}`
}

export function clearSession() {
  document.cookie = 'session_user=;path=/;max-age=0'
  document.cookie = 'session_role=;path=/;max-age=0'
}

export function getSessionFromCookies(): { user: SessionUser | null } {
  if (typeof document === 'undefined') return { user: null }
  const cookies = Object.fromEntries(document.cookie.split(';').map(c => c.trim().split('=').map(decodeURIComponent)))
  try {
    const userData = cookies['session_user'] ? JSON.parse(cookies['session_user']) : null
    const role = cookies['session_role'] as UserRole
    if (!userData || !role) return { user: null }
    return { user: { ...userData, role } }
  } catch { return { user: null } }
}
