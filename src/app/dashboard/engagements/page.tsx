'use client'
import { useState, useEffect } from 'react'
import { Search, Plus, Calendar, Clock, TrendingUp, ChevronRight } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { cn, STATUS_COLORS, ENGAGEMENT_TYPE_LABELS, formatDate } from '@/utils'
import Link from 'next/link'
import { fetchEngagements } from '@/lib/db'
import type { Engagement } from '@/lib/supabase'

const STATUS_STEPS = ['planning', 'fieldwork', 'review', 'reporting', 'completed']

export default function EngagementsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [engagements, setEngagements] = useState<Engagement[]>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const e = await fetchEngagements()
        if (mounted) setEngagements(e)
      } catch (err) {
        console.error('Engagements load failed:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = engagements.filter(e => {
    const s = search.toLowerCase()
    const matchSearch = e.title.toLowerCase().includes(s) ||
      (e.client?.company_name || '').toLowerCase().includes(s)
    const matchStatus = statusFilter === 'all' || e.status === statusFilter
    return matchSearch && matchStatus
  })

  const activeCount = engagements.filter(e => e.status !== 'completed').length

  if (loading) {
    return (
      <div className="flex flex-col flex-1">
        <DashboardHeader title="Engagements" subtitle="Loading..." />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" style={{ borderWidth: '3px' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader
        title="Engagements"
        subtitle={`${activeCount} active engagements`}
        action={{ label: 'New Engagement', onClick: () => {} }}
      />
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Summary bar */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {STATUS_STEPS.map(s => {
            const count = engagements.filter(e => e.status === s).length
            return (
              <button key={s} onClick={() => setStatusFilter(s === statusFilter ? 'all' : s)}
                className={cn('card px-4 py-3 text-center cursor-pointer transition-all border-2',
                  statusFilter === s ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-200')}>
                <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{count}</div>
                <div className="text-xs capitalize mt-0.5" style={{ color: 'var(--text-muted)' }}>{s}</div>
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="relative max-w-sm mb-5">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input type="search" placeholder="Search engagements or clients..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 h-10" />
        </div>

        {/* Engagement cards */}
        <div className="flex flex-col gap-3">
          {filtered.map(eng => (
            <div key={eng.id} className="card card-hover p-5">
              <div className="flex items-start gap-4">
                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{eng.title}</h3>
                    <span className={cn('badge ring-1', STATUS_COLORS[eng.status])}>{eng.status}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>
                      {ENGAGEMENT_TYPE_LABELS[eng.type] || eng.type}
                    </span>
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{eng.client?.company_name || 'Unknown client'}</p>

                  {/* Progress pipeline */}
                  <div className="flex items-center gap-0 mb-4">
                    {STATUS_STEPS.map((step, i) => {
                      const idx = STATUS_STEPS.indexOf(eng.status)
                      const done = i <= idx
                      return (
                        <div key={step} className="flex items-center flex-1 last:flex-none">
                          <div className={cn(
                            'h-1.5 flex-1 rounded-full transition-all',
                            i === 0 ? 'rounded-l-full' : '',
                            i === STATUS_STEPS.length - 1 ? 'rounded-r-full flex-none w-1.5' : '',
                            done ? 'bg-blue-500' : 'bg-gray-200'
                          )} />
                        </div>
                      )
                    })}
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-5">
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Calendar size={12} />
                      {formatDate(eng.planned_start)} – {formatDate(eng.planned_end)}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Clock size={12} />
                      {eng.billable_hours}h / {eng.budgeted_hours || 0}h logged
                    </span>
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <TrendingUp size={12} />
                      ETB {(eng.fee_amount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="relative w-14 h-14">
                    <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--surface-2)" strokeWidth="2.5" />
                      <circle cx="18" cy="18" r="15.9" fill="none"
                        stroke={eng.progress === 100 ? '#10b981' : '#2563eb'} strokeWidth="2.5"
                        strokeDasharray={`${eng.progress} 100`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                      style={{ color: 'var(--text-primary)' }}>
                      {eng.progress}%
                    </span>
                  </div>
                </div>

                <Link href={`/dashboard/engagements/${eng.id}`}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0">
                  <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>No engagements found</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
