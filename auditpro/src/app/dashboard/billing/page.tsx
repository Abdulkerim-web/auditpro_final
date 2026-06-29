'use client'
import { useState } from 'react'
import { Search, Plus, Download, Send, CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { cn, STATUS_COLORS, formatCurrency, formatDate } from '@/utils'

const DEMO_INVOICES = [
  { id: '1', invoice_number: 'INV-2024-0021', client: 'Ethio Trading PLC', amount: 45000, tax_amount: 6750, total_amount: 51750, currency: 'ETB', status: 'sent', issue_date: '2024-01-20', due_date: '2024-02-20', engagement: 'Statutory Audit FY2023' },
  { id: '2', invoice_number: 'INV-2024-0020', client: 'Abyssinia Hotels Group', amount: 38000, tax_amount: 5700, total_amount: 43700, currency: 'ETB', status: 'paid', issue_date: '2024-01-10', due_date: '2024-02-10', paid_date: '2024-01-28', engagement: 'Internal Audit Q4' },
  { id: '3', invoice_number: 'INV-2024-0019', client: 'East Africa Dev Fund', amount: 32000, tax_amount: 4800, total_amount: 36800, currency: 'ETB', status: 'overdue', issue_date: '2023-12-15', due_date: '2024-01-15', engagement: 'Compliance Review' },
  { id: '4', invoice_number: 'INV-2024-0018', client: 'Nile Construction Ltd', amount: 28000, tax_amount: 4200, total_amount: 32200, currency: 'ETB', status: 'draft', issue_date: '2024-01-25', due_date: '2024-02-25', engagement: 'Tax Audit 2023' },
  { id: '5', invoice_number: 'INV-2023-0017', client: 'Habesha Breweries', amount: 55000, tax_amount: 8250, total_amount: 63250, currency: 'ETB', status: 'paid', issue_date: '2023-12-01', due_date: '2023-12-31', paid_date: '2023-12-29', engagement: 'Statutory Audit FY2023' },
]

const statusIcons: Record<string, React.ReactNode> = {
  paid: <CheckCircle size={14} className="text-emerald-600" />,
  sent: <Send size={14} className="text-blue-600" />,
  overdue: <AlertCircle size={14} className="text-red-600" />,
  draft: <Clock size={14} className="text-gray-500" />,
  cancelled: <XCircle size={14} className="text-gray-500" />,
}

export default function BillingPage() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? DEMO_INVOICES : DEMO_INVOICES.filter(i => i.status === filter)

  const totalPaid = DEMO_INVOICES.filter(i => i.status === 'paid').reduce((s, i) => s + i.total_amount, 0)
  const totalPending = DEMO_INVOICES.filter(i => i.status === 'sent').reduce((s, i) => s + i.total_amount, 0)
  const totalOverdue = DEMO_INVOICES.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total_amount, 0)

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader title="Billing & Invoices" subtitle="Manage your client invoices and track payments"
        action={{ label: 'New Invoice', onClick: () => {} }} />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card px-5 py-4">
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Collected (YTD)</div>
            <div className="text-xl font-bold" style={{ color: 'var(--success)' }}>{formatCurrency(totalPaid)}</div>
          </div>
          <div className="card px-5 py-4">
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Outstanding</div>
            <div className="text-xl font-bold" style={{ color: 'var(--brand-600)' }}>{formatCurrency(totalPending)}</div>
          </div>
          <div className="card px-5 py-4">
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Overdue</div>
            <div className="text-xl font-bold" style={{ color: 'var(--danger)' }}>{formatCurrency(totalOverdue)}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-5">
          {['all', 'draft', 'sent', 'paid', 'overdue'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={cn('px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all border',
                filter === s ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              )}>
              {s}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
                {['Invoice #', 'Client', 'Engagement', 'Amount (ETB)', 'Issue Date', 'Due Date', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv, i) => (
                <tr key={inv.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                  style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-mono font-medium" style={{ color: 'var(--brand-600)' }}>
                      {inv.invoice_number}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{inv.client}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{inv.engagement}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {inv.total_amount.toLocaleString()}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>incl. VAT {inv.tax_amount.toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {formatDate(inv.issue_date)}
                  </td>
                  <td className="px-4 py-3.5 text-sm" style={{ color: inv.status === 'overdue' ? 'var(--danger)' : 'var(--text-secondary)' }}>
                    {formatDate(inv.due_date)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn('badge ring-1 flex items-center gap-1.5 w-fit', STATUS_COLORS[inv.status])}>
                      {statusIcons[inv.status]} {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded hover:bg-gray-100 transition-colors" title="Download PDF">
                        <Download size={14} style={{ color: 'var(--text-muted)' }} />
                      </button>
                      {inv.status === 'draft' && (
                        <button className="p-1.5 rounded hover:bg-blue-50 transition-colors" title="Send invoice">
                          <Send size={14} className="text-blue-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
