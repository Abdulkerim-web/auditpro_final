'use client'
import { useState } from 'react'
import { Search, Plus, Calendar, Clock, TrendingUp, ChevronRight } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { cn, STATUS_COLORS, ENGAGEMENT_TYPE_LABELS, formatDate } from '@/utils'
import Link from 'next/link'

const DEMO_ENGAGEMENTS = [
  { id: '1', title: 'Statutory Audit FY2023', client: 'Ethio Trading PLC', type: 'statutory_audit', status: 'fieldwork', planned_start: '2024-01-10', planned_end: '2024-02-28', fee_amount: 45000, billable_hours: 68, budgeted_hours: 120, progress: 65 },
  { id: '2', title: 'Internal Audit Q4 2023', client: 'Abyssinia Hotels Group', type: 'internal_audit', status: 'review', planned_start: '2024-01-15', planned_end: '2024-02-15', fee_amount: 38000, billable_hours: 95, budgeted_hours: 100, progress: 82 },
  { id: '3', title: 'Tax Compliance Review 2023', client: 'Nile Construction Ltd', type: 'tax_audit', status: 'planning', planned_start: '2024-02-01', planned_end: '2024-03-15', fee_amount: 28000, billable_hours: 12, budgeted_hours: 80, progress: 20 },
  { id: '4', title: 'Annual Compliance Review', client: 'East Africa Dev Fund', type: 'compliance_review', status: 'reporting', planned_start: '2023-12-01', planned_end: '2024-02-10', fee_amount: 32000, billable_hours: 108, budgeted_hours: 110, progress: 91 },
  { id: '5', title: 'Agreed-Upon Procedures', client: 'Habesha Breweries', type: 'agreed_upon_procedures', status: 'completed', planned_start: '2023-11-01', planned_end: '2024-01-31', fee_amount: 18000, billable_hours: 45, budgeted_hours: 45, progress: 100 },
  { id: '6', title: 'Forensic Investigation Q3', client: 'Summit Bank SC', type: 'forensic_audit', status: 'planning', planned_start: '2024-02-15', planned_end: '2024-04-30', fee_amount: 85000, billable_hours: 0, budgeted_hours: 200, progress: 5 },
]

const STATUS_STEPS = ['planning', 'fieldwork', 'review', 'reporting', 'completed']

export default function EngagementsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = DEMO_ENGAGEMENTS.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.client.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || e.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader
        title="Engagements"
        subtitle={`${DEMO_ENGAGEMENTS.filter(e => e.status !== 'completed').length} active engagements`}
        action={{ label: 'New Engagement', onClick: () => {} }}
      />
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Summary bar */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {STATUS_STEPS.map(s => {
            const count = DEMO_ENGAGEMENTS.filter(e => e.status === s).length
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
                      {ENGAGEMENT_TYPE_LABELS[eng.type]}
                    </span>
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{eng.client}</p>

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
                      {eng.billable_hours}h / {eng.budgeted_hours}h logged
                    </span>
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <TrendingUp size={12} />
                      ETB {eng.fee_amount.toLocaleString()}
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
      </div>
    </div>
  )
}
