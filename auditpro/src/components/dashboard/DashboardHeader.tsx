'use client'
import { useState, useEffect, useRef } from 'react'
import { Bell, Search, Plus, X, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { NOTIFICATIONS } from '@/lib/data'
import { formatRelativeTime, cn } from '@/utils'

interface Props { title: string; subtitle?: string; action?: { label: string; onClick: () => void } }

const typeIcons: Record<string, string> = {
  document_uploaded: '📄', message_received: '💬',
  invoice_overdue: '⚠️', deadline_approaching: '⏰',
}

export default function DashboardHeader({ title, subtitle, action }: Props) {
  const router = useRouter()
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs] = useState(NOTIFICATIONS)
  const [searchQuery, setSearchQuery] = useState('')
  const notifRef = useRef<HTMLDivElement>(null)
  const unread = notifs.filter(n => !n.read).length

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })))
  const markRead = (id: string) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x))

  return (
    <header className="h-16 border-b flex items-center justify-between px-6 flex-shrink-0 bg-white sticky top-0 z-10"
      style={{ borderColor: 'var(--border)' }}>
      <div>
        <h1 className="font-extrabold text-lg leading-tight" style={{ color: 'var(--text-primary)' }}>{title}</h1>
        {subtitle && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search anything..."
            className="input-field pl-9 h-9 w-52 text-sm"
            onKeyDown={e => { if (e.key === 'Enter' && searchQuery) { setSearchQuery('') } }}
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setNotifOpen(!notifOpen)}
            className={cn('relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors', notifOpen ? 'bg-blue-50' : 'hover:bg-gray-100')}>
            <Bell size={17} style={{ color: notifOpen ? 'var(--brand-600)' : 'var(--text-secondary)' }} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white pulse-ring"
                style={{ background: 'var(--brand-500)', fontSize: '10px' }}>{unread}</span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 card shadow-xl overflow-hidden z-50 animate-scale-in">
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</span>
                <div className="flex items-center gap-2">
                  {unread > 0 && <button onClick={markAllRead} className="text-xs font-medium" style={{ color: 'var(--brand-600)' }}>Mark all read</button>}
                  <button onClick={() => setNotifOpen(false)} className="p-1 rounded hover:bg-gray-100"><X size={13} /></button>
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y" style={{ borderColor: 'var(--border)' }}>
                {notifs.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No notifications</div>
                ) : notifs.map(n => (
                  <Link key={n.id} href={n.link}
                    onClick={() => { markRead(n.id); setNotifOpen(false) }}
                    className={cn('flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50 block', !n.read && 'bg-blue-50/60')}>
                    <span className="text-lg flex-shrink-0 mt-0.5">{typeIcons[n.type] || '🔔'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                      <p className="text-xs mt-0.5 leading-snug" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{formatRelativeTime(n.created_at)}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: 'var(--brand-500)' }} />}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:shadow-md transition-shadow">BO</div>

        {action && (
          <button onClick={action.onClick} className="btn-primary h-9 text-sm">
            <Plus size={14} />{action.label}
          </button>
        )}
      </div>
    </header>
  )
}
