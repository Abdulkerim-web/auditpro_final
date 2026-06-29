'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSessionFromCookies } from '@/lib/auth'

interface Props {
  allowedRoles: string[]
  redirectTo?: string
  children: React.ReactNode
}

export default function RoleGuard({ allowedRoles, redirectTo = '/auth/login', children }: Props) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const { user } = getSessionFromCookies()
    if (!user) { router.replace(`${redirectTo}?redirect=${window.location.pathname}`); return }
    if (!allowedRoles.includes(user.role)) {
      const dest = user.role === 'client' ? '/client-portal' : '/dashboard'
      router.replace(dest); return
    }
    setAllowed(true)
    setChecking(false)
  }, [])

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--surface-1)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" style={{ borderWidth: '3px' }} />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Verifying access...</p>
      </div>
    </div>
  )

  return allowed ? <>{children}</> : null
}
