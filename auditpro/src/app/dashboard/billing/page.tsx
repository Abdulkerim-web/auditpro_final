'use client'
import { useState, useEffect } from 'react'
import { Download, Send, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Clock, Circle as XCircle } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { cn, STATUS_COLORS, formatCurrency, formatDate } from '@/utils'
import { fetchInvoices } from '@/lib/db'
import type { Invoice } from '@/lib/supabase'

const statusIcons: Record<string, React.ReactNode> = {
  paid: <CheckCircle size={14} className="text-emerald-600" />,
  sent: <Send size={14} className="text-blue-600" />,
  overdue: <AlertCircle size={14} className="text-red-600" />,
  draft: <Clock size={14} className="text-gray-500" />,
  cancelled: <XCircle size={14} className="text-gray-500" />,
}

export default function BillingPage() {
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const i = await fetchInvoices()
        if (mounted) setInvoices(i)
      } catch (err) {
        console.error('Invoices load failed:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = filter === 'all' ? invoices : invoices.filter(i => i.status === filter)

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total_amount, 0)
  const totalPending = invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.total_amount, 0)
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total_amount, 0)

  if (loading) {
    return (
      <div className="flex flex-col flex-1">
        <DashboardHeader title="Billing & Invoices" subtitle="Loading..." />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" style={{ borderWidth: '3px' }} />
        </div>
      </div>
    )
  }

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
              {filtered.map(inv => (
                <tr key={inv.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                  style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-mono font-medium" style={{ color: 'var(--brand-600)' }}>
                      {inv.invoice_number}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{inv.client?.company_name || '—'}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{inv.engagement?.title || '—'}</span>
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
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No invoices found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
