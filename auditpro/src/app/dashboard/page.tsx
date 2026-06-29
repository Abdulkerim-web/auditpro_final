'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, Briefcase, DollarSign, Clock, TrendingUp, ArrowUpRight, TriangleAlert as AlertTriangle, Calendar } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { cn, formatCurrency, formatDate, STATUS_COLORS } from '@/utils'
import { REVENUE_CHART } from '@/lib/data'
import { useAuth } from '@/lib/auth-context'
import { fetchClients, fetchEngagements, fetchInvoices, fetchTimeEntries, fetchNotifications } from '@/lib/db'
import type { Client, Engagement, Invoice, TimeEntry, Notification } from '@/lib/supabase'

const ENG_TYPE_COLORS: Record<string, string> = {
  statutory_audit: '#2563eb',
  internal_audit: '#7c3aed',
  tax_audit: '#d97706',
  compliance_review: '#059669',
  agreed_upon_procedures: '#dc2626',
  forensic_audit: '#db2777',
}

const ENG_TYPE_LABELS: Record<string, string> = {
  statutory_audit: 'Statutory',
  internal_audit: 'Internal',
  tax_audit: 'Tax',
  compliance_review: 'Compliance',
  agreed_upon_procedures: 'AUP',
  forensic_audit: 'Forensic',
}

const tasks = [
  { text: 'Review Ethio Trading FY2023 trial balance', priority: 'high', due: 'Today', link: '/dashboard/engagements' },
  { text: 'Sign off Abyssinia Hotels audit report', priority: 'high', due: 'Tomorrow', link: '/dashboard/engagements' },
  { text: 'Upload Nile Construction engagement letter', priority: 'medium', due: 'Feb 5', link: '/dashboard/engagements' },
  { text: 'Follow up overdue invoices', priority: 'medium', due: 'Feb 7', link: '/dashboard/billing' },
  { text: 'Review ERCA filing — compliance due', priority: 'low', due: 'Feb 12', link: '/dashboard/reports' },
]

export default function DashboardPage() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [engagements, setEngagements] = useState<Engagement[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [c, e, i, t] = await Promise.all([
          fetchClients(),
          fetchEngagements(),
          fetchInvoices(),
          fetchTimeEntries(),
        ])
        if (!mounted) return
        setClients(c)
        setEngagements(e)
        setInvoices(i)
        setTimeEntries(t)
        if (profile?.id) {
          try {
            const n = await fetchNotifications(profile.id)
            if (mounted) setNotifications(n)
          } catch { /* notifications optional */ }
        }
      } catch (err) {
        console.error('Dashboard load failed:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [profile?.id])

  const activeClients = clients.filter(c => c.status === 'active').length
  const openEngagements = engagements.filter(e => e.status !== 'completed').length
  const revenueYTD = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total_amount, 0)
  const billableHours = timeEntries.filter(t => t.is_billable).reduce((s, t) => s + t.hours, 0)
  const overdueInvoices = invoices.filter(i => i.status === 'overdue')
  const unreadNotifs = notifications.filter(n => !n.is_read).length

  const stats = [
    { icon: Users, label: 'Active Clients', value: activeClients, sub: `${clients.length} total`, color: '#2563eb', bg: '#eff6ff', href: '/dashboard/clients' },
    { icon: Briefcase, label: 'Open Engagements', value: openEngagements, sub: `${engagements.length} total`, color: '#7c3aed', bg: '#f5f3ff', href: '/dashboard/engagements' },
    { icon: DollarSign, label: 'Revenue YTD', value: formatCurrency(revenueYTD), sub: `${invoices.filter(i => i.status === 'paid').length} paid`, color: '#059669', bg: '#ecfdf5', href: '/dashboard/billing' },
    { icon: Clock, label: 'Billable Hours', value: `${billableHours.toFixed(1)}h`, sub: `${timeEntries.length} entries`, color: '#d97706', bg: '#fffbeb', href: '/dashboard/time' },
  ]

  const activeEngs = engagements.filter(e => e.status !== 'completed')

  // Derive engagement mix from real data
  const typeCounts: Record<string, number> = {}
  engagements.forEach(e => { typeCounts[e.type] = (typeCounts[e.type] || 0) + 1 })
  const totalEngs = engagements.length || 1
  const engMix = Object.entries(typeCounts).map(([type, count]) => ({
    name: ENG_TYPE_LABELS[type] || type,
    value: Math.round((count / totalEngs) * 100),
    color: ENG_TYPE_COLORS[type] || '#64748b',
  }))

  if (loading) {
    return (
      <div className="flex flex-col flex-1">
        <DashboardHeader title="Dashboard" subtitle="Loading..." />
        <div className="flex-1 p-6 flex items-center justify-center" style={{ background: 'var(--surface-1)' }}>
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" style={{ borderWidth: '3px' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader title="Dashboard" subtitle={`Welcome back, ${profile?.full_name?.split(' ')[0] || 'Beyan'} — ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}`} />

      <div className="flex-1 p-6 overflow-y-auto" style={{ background: 'var(--surface-1)' }}>
        {/* Alert banner */}
        {overdueInvoices.length > 0 && (
          <Link href="/dashboard/billing" className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5 text-sm font-medium transition-all hover:shadow-md animate-fade-in"
            style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
            <AlertTriangle size={16} className="flex-shrink-0" />
            {overdueInvoices.length} invoice{overdueInvoices.length > 1 ? 's' : ''} overdue — click to review
            <ArrowUpRight size={14} className="ml-auto" />
          </Link>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <Link key={s.label} href={s.href}
              className="stat-card float-card flex flex-col gap-3 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                  <s.icon size={21} style={{ color: s.color }} />
                </div>
                <ArrowUpRight size={15} style={{ color: 'var(--text-muted)' }} />
              </div>
              <div>
                <div className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{s.value}</div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
                <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: s.color }}>
                  <TrendingUp size={10} />{s.sub}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5 mb-5">
          {/* Revenue chart */}
          <div className="card p-5 lg:col-span-2 animate-fade-in delay-200">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Revenue vs Target</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Fiscal year 2023/24 · ETB</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full inline-block" style={{ background: 'var(--brand-500)' }} />Actual</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full inline-block" style={{ background: '#cbd5e1' }} />Target</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={REVENUE_CHART} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid var(--border)', borderRadius: '10px', fontSize: 12 }}
                  formatter={(v: any) => [`ETB ${Number(v).toLocaleString()}`, '']} />
                <Area type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Engagement mix */}
          <div className="card p-5 animate-fade-in delay-300">
            <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Engagement Mix</h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>By type — all time</p>
            {engMix.length > 0 ? (
              <>
                <div className="flex justify-center mb-3">
                  <PieChart width={150} height={150}>
                    <Pie data={engMix} cx={75} cy={75} innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                      {engMix.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </div>
                <div className="flex flex-col gap-2">
                  {engMix.map(e => (
                    <div key={e.name} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                        <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: e.color }} />{e.name}
                      </span>
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{e.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>No engagements yet</p>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Active engagements */}
          <div className="card lg:col-span-2 animate-fade-in delay-300">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Active Engagements</h3>
              <Link href="/dashboard/engagements" className="text-xs font-semibold hover:underline" style={{ color: 'var(--brand-600)' }}>View all →</Link>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {activeEngs.length === 0 ? (
                <p className="px-5 py-8 text-sm text-center" style={{ color: 'var(--text-muted)' }}>No active engagements</p>
              ) : activeEngs.map(eng => (
                <Link key={eng.id} href={`/dashboard/engagements/${eng.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                  <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {(eng.client?.company_name || '?')[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{eng.client?.company_name || 'Unknown'}</span>
                      <span className={cn('badge ring-1', STATUS_COLORS[eng.status])}>{eng.status}</span>
                    </div>
                    <div className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>{eng.title} · Due {formatDate(eng.planned_end)}</div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${eng.progress}%`, background: eng.progress === 100 ? '#10b981' : '#2563eb' }} />
                    </div>
                  </div>
                  <span className="text-sm font-extrabold flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{eng.progress}%</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="card animate-fade-in delay-400">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Priority Tasks</h3>
              <span className="badge ring-1" style={{ background: 'var(--brand-50)', color: 'var(--brand-600)' }}>{tasks.filter(t => t.priority === 'high').length} urgent</span>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {tasks.map((t, i) => (
                <Link key={i} href={t.link} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className={cn('w-2 h-2 rounded-full mt-2 flex-shrink-0',
                    t.priority === 'high' ? 'bg-red-500' : t.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>{t.text}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}><Calendar size={10} className="inline mr-1" />Due: {t.due}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
