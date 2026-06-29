'use client'
import { useState } from 'react'
import { CheckCircle2, Circle, Upload, Download, AlertCircle } from 'lucide-react'
import { PBC_REQUESTS } from '@/lib/data'
import { formatDate, cn } from '@/utils'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export default function ClientRequestsPage() {
  const [items, setItems] = useState(PBC_REQUESTS.filter(p => p.engagement_id === 'eng-001'))
  const done = items.filter(i => i.done).length
  const pct = Math.round((done / items.length) * 100)

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader title="Document Requests" subtitle="Documents requested by your audit team" />
      <div className="flex-1 p-6 overflow-y-auto" style={{ background: 'var(--surface-1)' }}>
        {/* Progress */}
        <div className="card p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Statutory Audit FY2023 — PBC List</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{done} of {items.length} items completed</p>
            </div>
            <div className="text-3xl font-extrabold" style={{ color: pct === 100 ? 'var(--success)' : 'var(--brand-600)' }}>{pct}%</div>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: pct === 100 ? '#10b981' : 'var(--brand-500)' }} />
          </div>
          {items.some(i => !i.done && new Date(i.due) < new Date()) && (
            <div className="flex items-center gap-2 mt-3 text-sm" style={{ color: '#dc2626' }}>
              <AlertCircle size={14} />Some items are overdue — please upload as soon as possible
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div key={item.id} className={cn('card p-5 flex items-center gap-4 transition-all', !item.done && 'hover:shadow-md')}>
              <button onClick={() => setItems(prev => prev.map(i => i.id === item.id ? { ...i, done: !i.done } : i))}>
                {item.done ? <CheckCircle2 size={22} className="text-green-600 flex-shrink-0" /> : <Circle size={22} className="flex-shrink-0" style={{ color: 'var(--text-muted)' }} />}
              </button>
              <div className="flex-1">
                <p className={cn('font-medium', item.done && 'line-through')} style={{ color: item.done ? 'var(--text-muted)' : 'var(--text-primary)' }}>{item.title}</p>
                <p className="text-xs mt-0.5" style={{ color: new Date(item.due) < new Date() && !item.done ? '#dc2626' : 'var(--text-muted)' }}>Due: {formatDate(item.due)}</p>
              </div>
              {item.done ? (
                <button className="btn-secondary text-xs flex items-center gap-1.5 h-8 px-3"><Download size={12} />View</button>
              ) : (
                <button className="btn-primary text-xs flex items-center gap-1.5 h-8 px-3"><Upload size={12} />Upload</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
