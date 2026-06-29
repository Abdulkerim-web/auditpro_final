'use client'
import { FileText, Download, Eye, Clock, CheckCircle2, Edit3, Send } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { cn, STATUS_COLORS, formatDate } from '@/utils'

const REPORTS = [
  { id: '1', title: 'Independent Auditor Report — Ethio Trading PLC FY2023', client: 'Ethio Trading PLC', type: 'Statutory Audit Report', status: 'review', created: '2024-01-25', pages: 24 },
  { id: '2', title: 'Internal Audit Report — Abyssinia Hotels Q4 2023', client: 'Abyssinia Hotels Group', type: 'Internal Audit Report', status: 'completed', created: '2024-01-20', pages: 38 },
  { id: '3', title: 'Management Letter — East Africa Development Fund', client: 'East Africa Dev Fund', type: 'Management Letter', status: 'reporting', created: '2024-01-18', pages: 12 },
  { id: '4', title: 'Forensic Investigation Report — Summit Bank SC', client: 'Summit Bank SC', type: 'Forensic Report', status: 'draft', created: '2024-01-10', pages: 5 },
  { id: '5', title: 'Tax Compliance Report — Habesha Breweries 2023', client: 'Habesha Breweries', type: 'Tax Report', status: 'completed', created: '2023-12-15', pages: 18 },
]

const statusActions: Record<string, { label: string; icon: typeof Edit3; color: string }> = {
  draft: { label: 'Continue Editing', icon: Edit3, color: 'text-gray-600' },
  review: { label: 'Submit for Review', icon: Send, color: 'text-blue-600' },
  reporting: { label: 'Finalise Report', icon: CheckCircle2, color: 'text-amber-600' },
  completed: { label: 'Download PDF', icon: Download, color: 'text-green-600' },
}

export default function ReportsPage() {
  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader title="Reports" subtitle="Draft, review and finalise audit reports"
        action={{ label: 'New Report', onClick: () => {} }} />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Draft', count: REPORTS.filter(r => r.status === 'draft').length, color: 'text-gray-600', bg: 'bg-gray-50' },
            { label: 'In Review', count: REPORTS.filter(r => r.status === 'review').length, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Reporting', count: REPORTS.filter(r => r.status === 'reporting').length, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Completed', count: REPORTS.filter(r => r.status === 'completed').length, color: 'text-green-600', bg: 'bg-green-50' },
          ].map(s => (
            <div key={s.label} className={cn('card px-5 py-4 flex items-center justify-between', s.bg)}>
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
              <span className={cn('text-2xl font-bold', s.color)}>{s.count}</span>
            </div>
          ))}
        </div>

        {/* Reports list */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>All Reports</h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {REPORTS.map(report => {
              const action = statusActions[report.status]
              return (
                <div key={report.id} className="flex items-center gap-5 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--brand-50)' }}>
                    <FileText size={18} style={{ color: 'var(--brand-600)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{report.title}</h4>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{report.client}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>
                        {report.type}
                      </span>
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <Clock size={10} /> {formatDate(report.created)} · {report.pages}p
                      </span>
                    </div>
                  </div>
                  <span className={cn('badge ring-1', STATUS_COLORS[report.status])}>
                    {report.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Preview">
                      <Eye size={16} style={{ color: 'var(--text-muted)' }} />
                    </button>
                    <button className={cn('flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors', action.color)}
                      style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                      <action.icon size={13} /> {action.label}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
