'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

interface Props {
  allowedRoles: string[]
  redirectTo?: string
  children: React.ReactNode
}

export default function RoleGuard({ allowedRoles, redirectTo = '/auth/login', children }: Props) {
  const router = useRouter()
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--surface-1)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" style={{ borderWidth: '3px' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    if (typeof window !== 'undefined') {
      router.replace(`${redirectTo}?redirect=${window.location.pathname}`)
    }
    return null
  }

  if (!allowedRoles.includes(profile.role)) {
    const dest = profile.role === 'client' ? '/client-portal' : '/dashboard'
    router.replace(dest)
    return null
  }

  return <>{children}</>
}
