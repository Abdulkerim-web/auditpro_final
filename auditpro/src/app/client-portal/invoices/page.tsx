'use client'
import { CreditCard, Download, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { INVOICES } from '@/lib/data'
import { cn, STATUS_COLORS, formatCurrency, formatDate } from '@/utils'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export default function ClientInvoicesPage() {
  const invoices = INVOICES.filter(i => i.client_id === 'cli-001')
  const statusIcons: Record<string,any> = { paid: CheckCircle2, sent: Clock, overdue: AlertCircle, draft: Clock }

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader title="My Invoices" subtitle="View and pay your audit invoices" />
      <div className="flex-1 p-6 overflow-y-auto" style={{ background: 'var(--surface-1)' }}>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Paid', value: formatCurrency(invoices.filter(i=>i.status==='paid').reduce((s,i)=>s+i.total_amount,0)), color: 'var(--success)' },
            { label: 'Outstanding', value: formatCurrency(invoices.filter(i=>i.status==='sent').reduce((s,i)=>s+i.total_amount,0)), color: 'var(--brand-600)' },
            { label: 'Invoices Total', value: invoices.length, color: 'var(--text-primary)' },
          ].map(s => (
            <div key={s.label} className="card px-5 py-4">
              <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              <div className="text-xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {invoices.map(inv => {
            const Icon = statusIcons[inv.status] || Clock
            return (
              <div key={inv.id} className="card p-5 float-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-mono text-sm font-semibold mb-0.5" style={{ color: 'var(--brand-600)' }}>{inv.invoice_number}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Issued {formatDate(inv.issue_date)} · Due {formatDate(inv.due_date)}</div>
                  </div>
                  <span className={cn('badge ring-1 flex items-center gap-1.5', STATUS_COLORS[inv.status])}>
                    <Icon size={11} />{inv.status}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(inv.total_amount)}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>incl. VAT {formatCurrency(inv.tax_amount)}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-secondary text-xs flex items-center gap-1.5 h-8 px-3"><Download size={13} />PDF</button>
                    {(inv.status === 'sent' || inv.status === 'overdue') && (
                      <button className="btn-primary text-xs flex items-center gap-1.5 h-8 px-3"><CreditCard size={13} />Pay Now</button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
