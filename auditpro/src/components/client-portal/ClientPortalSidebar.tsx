'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Scale, LayoutDashboard, FolderOpen, MessageSquare, Receipt, CheckSquare, LogOut, HelpCircle, User } from 'lucide-react'
import { cn } from '@/utils'
import { FIRM } from '@/lib/data'
import { clearSession, getSessionFromCookies } from '@/lib/auth'

const nav = [
  { icon: LayoutDashboard, label: 'Overview', href: '/client-portal' },
  { icon: CheckSquare, label: 'Document Requests', href: '/client-portal/requests' },
  { icon: FolderOpen, label: 'My Documents', href: '/client-portal/documents' },
  { icon: MessageSquare, label: 'Messages', href: '/client-portal/messages', badge: 1 },
  { icon: Receipt, label: 'Invoices', href: '/client-portal/invoices' },
  { icon: HelpCircle, label: 'Help & Support', href: '/contact' },
]

export default function ClientPortalSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string; initials: string } | null>(null)

  useEffect(() => {
    const { user: u } = getSessionFromCookies()
    if (u) setUser({ name: u.name, email: u.email, initials: u.initials })
  }, [])

  const handleLogout = () => {
    clearSession()
    router.push('/auth/login')
  }

  return (
    <aside className="w-60 flex flex-col h-screen sticky top-0 border-r flex-shrink-0"
      style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'var(--brand-900)' }}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--brand-600)' }}>
          <Scale size={13} className="text-white" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-sm text-white truncate">{FIRM.name}</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Client Portal</div>
        </div>
      </div>

      {/* Client info */}
      {user && (
        <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: 'var(--gold-500)' }}>
              {user.initials}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">{user.name}</div>
              <div className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>{user.email}</div>
            </div>
          </div>
        </div>
      )}

      {/* Client role badge */}
      <div className="mx-3 mt-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ background: 'rgba(212,160,23,0.15)', color: 'var(--gold-400)' }}>
          <User size={11} />
          Client Access
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5 overflow-y-auto">
        {nav.map(item => {
          const active = pathname === item.href || (item.href !== '/client-portal' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative',
                active ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'
              )}>
              <item.icon size={17} className="flex-shrink-0" />
              {item.label}
              {item.badge && (
                <span className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: '#ef4444' }}>{item.badge}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t px-3 py-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-all text-white/60 hover:text-white hover:bg-white/5">
          <LogOut size={17} />Sign out
        </button>
      </div>
    </aside>
  )
}
