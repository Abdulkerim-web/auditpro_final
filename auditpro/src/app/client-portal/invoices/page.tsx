'use client'
import { useState, useEffect } from 'react'
import { CreditCard, Download, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Clock } from 'lucide-react'
import { cn, STATUS_COLORS, formatCurrency, formatDate } from '@/utils'
import { useAuth } from '@/lib/auth-context'
import { fetchClientByProfileId, fetchInvoices } from '@/lib/db'
import type { Invoice } from '@/lib/supabase'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export default function ClientInvoicesPage() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    let mounted = true
    if (!profile?.id) return
    ;(async () => {
      try {
        const c = await fetchClientByProfileId(profile.id)
        if (!c) { setLoading(false); return }
        const i = await fetchInvoices({ clientId: c.id })
        if (mounted) setInvoices(i)
      } catch (err) {
        console.error('Client invoices load failed:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [profile?.id])

  const statusIcons: Record<string, any> = { paid: CheckCircle2, sent: Clock, overdue: AlertCircle, draft: Clock }

  if (loading) {
    return (
      <div className="flex flex-col flex-1">
        <DashboardHeader title="My Invoices" subtitle="Loading..." />
        <div className="flex-1 p-6 flex items-center justify-center" style={{ background: 'var(--surface-1)' }}>
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" style={{ borderWidth: '3px' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader title="My Invoices" subtitle="View and pay your audit invoices" />
      <div className="flex-1 p-6 overflow-y-auto" style={{ background: 'var(--surface-1)' }}>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Paid', value: formatCurrency(invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total_amount, 0)), color: 'var(--success)' },
            { label: 'Outstanding', value: formatCurrency(invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.total_amount, 0)), color: 'var(--brand-600)' },
            { label: 'Invoices Total', value: invoices.length, color: 'var(--text-primary)' },
          ].map(s => (
            <div key={s.label} className="card px-5 py-4">
              <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              <div className="text-xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
        {invoices.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>No invoices yet</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your invoices will appear here once issued.</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  )
}
