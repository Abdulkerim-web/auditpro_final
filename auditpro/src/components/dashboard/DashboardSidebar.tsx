'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Scale, LayoutDashboard, Users, Briefcase, FolderOpen, MessageSquare, Clock, Receipt, ChartBar as BarChart3, BookOpen, Settings, LogOut, ChevronLeft, ChevronRight, Shield } from 'lucide-react'
import { cn, getInitials } from '@/utils'
import { FIRM, AUDITOR } from '@/lib/data'
import { useAuth } from '@/lib/auth-context'

const auditorNav = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Clients', href: '/dashboard/clients' },
  { icon: Briefcase, label: 'Engagements', href: '/dashboard/engagements' },
  { icon: FolderOpen, label: 'Documents', href: '/dashboard/documents' },
  { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages', badge: 2 },
  { icon: Clock, label: 'Time Tracker', href: '/dashboard/time' },
  { icon: Receipt, label: 'Billing', href: '/dashboard/billing', badge: 1 },
  { icon: BarChart3, label: 'Reports', href: '/dashboard/reports' },
  { icon: BookOpen, label: 'Blog', href: '/dashboard/blog' },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const { profile, signOut } = useAuth()
  const user = profile
    ? { name: profile.full_name, email: profile.email, initials: getInitials(profile.full_name) }
    : { name: AUDITOR.name, email: AUDITOR.email, initials: AUDITOR.initials }

  const handleLogout = async () => {
    await signOut()
    router.push('/auth/login')
  }

  return (
    <aside
      className={cn(
        'flex flex-col h-screen sticky top-0 border-r transition-all duration-300 flex-shrink-0 z-20',
        collapsed ? 'w-16' : 'w-60'
      )}
      style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 gradient-brand rounded-lg flex items-center justify-center flex-shrink-0">
              <Scale size={13} className="text-white" />
            </div>
            <span className="font-bold text-sm truncate" style={{ color: 'var(--brand-900)' }}>{FIRM.name}</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-7 h-7 gradient-brand rounded-lg flex items-center justify-center mx-auto">
            <Scale size={13} className="text-white" />
          </div>
        )}
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} className="p-1.5 rounded-lg hover:bg-gray-100 flex-shrink-0">
            <ChevronLeft size={15} style={{ color: 'var(--text-muted)' }} />
          </button>
        )}
      </div>

      {collapsed && (
        <button onClick={() => setCollapsed(false)}
          className="absolute -right-3 top-14 w-6 h-6 bg-white border rounded-full flex items-center justify-center shadow-sm z-10"
          style={{ borderColor: 'var(--border)' }}>
          <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />
        </button>
      )}

      {/* Role badge */}
      {!collapsed && (
        <div className="mx-3 mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
          <Shield size={11} />
          Auditor Dashboard
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 flex flex-col gap-0.5">
        {auditorNav.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all relative',
                collapsed && 'justify-center px-2',
                active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}>
              <item.icon size={17} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'var(--brand-500)' }}>{item.badge}</span>
              )}
              {collapsed && item.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: 'var(--brand-500)' }} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="border-t px-2.5 py-3 flex flex-col gap-0.5" style={{ borderColor: 'var(--border)' }}>
        {!collapsed && user && (
          <div className="flex items-center gap-2.5 px-2.5 py-2 mb-1 rounded-xl bg-gray-50">
            <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.initials}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</div>
              <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</div>
            </div>
          </div>
        )}
        <Link href="/dashboard/settings"
          className={cn('flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all text-gray-600 hover:bg-gray-100', collapsed && 'justify-center px-2')}>
          <Settings size={17} className="flex-shrink-0" />
          {!collapsed && 'Settings'}
        </Link>
        <button onClick={handleLogout}
          className={cn('flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all text-red-500 hover:bg-red-50 w-full', collapsed && 'justify-center px-2')}>
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </aside>
  )
}
