'use client'
import { useState } from 'react'
import { Plus, Play, Square, Clock, Calendar, CheckCircle2 } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { cn, formatDate } from '@/utils'

const DEMO_ENTRIES = [
  { id: '1', date: '2024-01-29', engagement: 'Statutory Audit FY2023', client: 'Ethio Trading PLC', description: 'Review of revenue recognition policies and trade receivables testing', hours: 3.5, is_billable: true },
  { id: '2', date: '2024-01-29', engagement: 'Internal Audit Q4 2023', client: 'Abyssinia Hotels Group', description: 'Finalising internal controls assessment report', hours: 2.0, is_billable: true },
  { id: '3', date: '2024-01-26', engagement: 'Statutory Audit FY2023', client: 'Ethio Trading PLC', description: 'Inventory count observation and cut-off testing', hours: 4.0, is_billable: true },
  { id: '4', date: '2024-01-26', engagement: 'Tax Compliance Review', client: 'Nile Construction Ltd', description: 'Initial planning meeting and document request list preparation', hours: 1.5, is_billable: true },
  { id: '5', date: '2024-01-25', engagement: 'Annual Compliance Review', client: 'East Africa Dev Fund', description: 'Draft management letter — finding 3 remediation section', hours: 2.5, is_billable: true },
  { id: '6', date: '2024-01-25', engagement: '', client: '', description: 'CPD training — IFRS 9 Financial Instruments update', hours: 3.0, is_billable: false },
]

const weekly = [
  { day: 'Mon', hours: 7.5 }, { day: 'Tue', hours: 6.0 }, { day: 'Wed', hours: 8.0 },
  { day: 'Thu', hours: 5.5 }, { day: 'Fri', hours: 4.0 }, { day: 'Sat', hours: 2.0 }, { day: 'Sun', hours: 0 },
]
const maxHours = 8

export default function TimeTrackerPage() {
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState('0:00:00')

  const totalThisWeek = weekly.reduce((s, d) => s + d.hours, 0)
  const billableThisWeek = DEMO_ENTRIES.filter(e => e.is_billable).reduce((s, e) => s + e.hours, 0)

  const grouped: Record<string, typeof DEMO_ENTRIES> = {}
  DEMO_ENTRIES.forEach(e => {
    if (!grouped[e.date]) grouped[e.date] = []
    grouped[e.date].push(e)
  })

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader title="Time Tracker" subtitle="Log and manage billable hours per engagement"
        action={{ label: 'Log Entry', onClick: () => {} }} />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Timer + entries */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Timer card */}
            <div className="card p-6 flex items-center gap-6">
              <div className="flex-1">
                <select className="input-field mb-3 text-sm">
                  <option>Statutory Audit FY2023 — Ethio Trading PLC</option>
                  <option>Internal Audit Q4 — Abyssinia Hotels Group</option>
                  <option>Tax Compliance — Nile Construction Ltd</option>
                </select>
                <input className="input-field text-sm" placeholder="What are you working on?" />
              </div>
              <div className="flex flex-col items-center gap-3 flex-shrink-0">
                <div className="text-3xl font-mono font-bold" style={{ color: 'var(--text-primary)' }}>{elapsed}</div>
                <button
                  onClick={() => setRunning(!running)}
                  className={cn('w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-md', running ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700')}>
                  {running ? <Square size={20} className="text-white fill-white" /> : <Play size={20} className="text-white fill-white" />}
                </button>
              </div>
            </div>

            {/* Entries grouped by date */}
            {Object.entries(grouped).map(([date, entries]) => (
              <div key={date} className="card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    {entries.reduce((s, e) => s + e.hours, 0).toFixed(1)}h
                  </span>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {entries.map(entry => (
                    <div key={entry.id} className="flex items-center gap-4 px-5 py-3.5">
                      <div className={cn('w-2 h-2 rounded-full flex-shrink-0', entry.is_billable ? 'bg-blue-500' : 'bg-gray-300')} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{entry.description}</p>
                        {entry.engagement && (
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {entry.engagement} · {entry.client}
                          </p>
                        )}
                      </div>
                      {!entry.is_billable && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                          Non-billable
                        </span>
                      )}
                      <span className="text-sm font-semibold flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
                        {entry.hours.toFixed(1)}h
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Weekly summary */}
          <div className="flex flex-col gap-5">
            <div className="card p-5">
              <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>This Week</h3>
              {/* Bar chart */}
              <div className="flex items-end gap-2 mb-4 h-24">
                {weekly.map(d => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full rounded-t-md transition-all relative flex-1 flex items-end">
                      <div className="w-full rounded-t-md"
                        style={{ height: `${(d.hours / maxHours) * 100}%`, background: d.day === 'Wed' ? 'var(--brand-500)' : 'var(--brand-100)', minHeight: d.hours > 0 ? '4px' : '0' }} />
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{d.day}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Total hours</span>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{totalThisWeek.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Billable</span>
                  <span className="font-semibold text-blue-600">{billableThisWeek.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Utilisation</span>
                  <span className="font-semibold text-green-600">{Math.round((billableThisWeek / totalThisWeek) * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="card p-5">
              <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>January Summary</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Total logged', value: '142.5h' },
                  { label: 'Billable', value: '128.0h', color: 'text-blue-600' },
                  { label: 'Target (160h)', value: '89%', color: 'text-green-600' },
                  { label: 'Revenue generated', value: 'ETB 48,000', color: 'text-emerald-600' },
                ].map(stat => (
                  <div key={stat.label} className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-secondary)' }}>{stat.label}</span>
                    <span className={cn('font-semibold', stat.color || '')} style={!stat.color ? { color: 'var(--text-primary)' } : undefined}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
