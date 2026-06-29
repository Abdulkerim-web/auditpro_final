'use client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Phone, Mail, Building2, Calendar, Tag, FileText, Briefcase, Receipt, MessageSquare, Edit3 } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { CLIENTS, ENGAGEMENTS, INVOICES, DOCUMENTS } from '@/lib/data'
import { cn, STATUS_COLORS, INDUSTRY_LABELS, ENGAGEMENT_TYPE_LABELS, formatCurrency, formatDate } from '@/utils'

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const client = CLIENTS.find(c => c.id === params.id)
  if (!client) notFound()

  const engagements = ENGAGEMENTS.filter(e => e.client_id === client.id)
  const invoices = INVOICES.filter(i => i.client_id === client.id)
  const documents = DOCUMENTS.filter(d => d.client_id === client.id)
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total_amount, 0)

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader
        title={client.company_name}
        subtitle={`${INDUSTRY_LABELS[client.industry]} · ${client.city}`}
        action={{ label: 'Edit Client', onClick: () => {} }}
      />
      <div className="flex-1 p-6 overflow-y-auto" style={{ background: 'var(--surface-1)' }}>
        <Link href="/dashboard/clients" className="inline-flex items-center gap-1.5 text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={14} />Back to Clients
        </Link>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Left: Client info */}
          <div className="flex flex-col gap-4">
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center text-white text-xl font-extrabold">{client.company_name[0]}</div>
                <div>
                  <h2 className="font-extrabold text-base" style={{ color: 'var(--text-primary)' }}>{client.company_name}</h2>
                  {client.trade_name && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>t/a {client.trade_name}</div>}
                  <span className={cn('badge ring-1 mt-1', STATUS_COLORS[client.status])}>{client.status}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  { icon: Mail, val: client.primary_contact_email, href: `mailto:${client.primary_contact_email}` },
                  { icon: Phone, val: client.primary_contact_phone, href: `tel:${client.primary_contact_phone?.replace(/\s/g,'')}` },
                  { icon: Building2, val: `${client.city}, ${client.country}` },
                  { icon: Calendar, val: `FY end: ${client.fiscal_year_end ? formatDate(client.fiscal_year_end) : 'N/A'}` },
                ].map((r, i) => r.val ? (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <r.icon size={14} className="flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                    {r.href ? <a href={r.href} className="hover:underline truncate" style={{ color: 'var(--brand-600)' }}>{r.val}</a> : <span style={{ color: 'var(--text-secondary)' }}>{r.val}</span>}
                  </div>
                ) : null)}
                {client.tin_number && (
                  <div className="flex items-center gap-2.5 text-sm"><FileText size={14} style={{ color: 'var(--text-muted)' }} /><span style={{ color: 'var(--text-secondary)' }}>TIN: {client.tin_number}</span></div>
                )}
              </div>
              {client.tags && client.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  {client.tags.map(t => <span key={t} className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>{t}</span>)}
                </div>
              )}
              {client.notes && <p className="text-xs mt-4 pt-4 border-t leading-relaxed" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>{client.notes}</p>}
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Engagements', value: engagements.length, color: 'var(--brand-600)' },
                { label: 'Invoices', value: invoices.length, color: '#7c3aed' },
                { label: 'Documents', value: documents.length, color: '#059669' },
              ].map(s => (
                <div key={s.label} className="card p-3 text-center">
                  <div className="text-xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="card p-4">
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Total Revenue (paid)</div>
              <div className="text-2xl font-extrabold" style={{ color: 'var(--success)' }}>{formatCurrency(totalRevenue)}</div>
            </div>

            {/* Quick actions */}
            <div className="flex flex-col gap-2">
              <Link href="/dashboard/messages" className="btn-secondary text-sm justify-center gap-2"><MessageSquare size={14} />Send Message</Link>
              <Link href="/dashboard/billing" className="btn-secondary text-sm justify-center gap-2"><Receipt size={14} />Create Invoice</Link>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Engagements */}
            <div className="card">
              <div className="px-5 pt-5 pb-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Engagements</h3>
                <Link href="/dashboard/engagements" className="text-xs font-semibold" style={{ color: 'var(--brand-600)' }}>View all →</Link>
              </div>
              {engagements.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No engagements yet</div>
              ) : engagements.map(eng => (
                <Link key={eng.id} href={`/dashboard/engagements/${eng.id}`}
                  className="flex items-center gap-4 px-5 py-4 border-b last:border-0 hover:bg-gray-50 transition-colors"
                  style={{ borderColor: 'var(--border)' }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{eng.title}</span>
                      <span className={cn('badge ring-1', STATUS_COLORS[eng.status])}>{eng.status}</span>
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{ENGAGEMENT_TYPE_LABELS[eng.type]} · {formatDate(eng.planned_start)} – {formatDate(eng.planned_end)}</div>
                    <div className="mt-2 w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                      <div className="h-full rounded-full" style={{ width: `${eng.progress}%`, background: eng.progress === 100 ? '#10b981' : '#2563eb' }} />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-extrabold text-sm" style={{ color: 'var(--text-primary)' }}>{eng.progress}%</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatCurrency(eng.fee_amount || 0)}</div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Invoices */}
            <div className="card">
              <div className="px-5 pt-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Invoices</h3>
              </div>
              {invoices.length === 0 ? (
                <div className="px-5 py-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No invoices yet</div>
              ) : (
                <table className="w-full">
                  <thead><tr className="border-b text-left" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
                    {['Invoice', 'Amount', 'Due', 'Status'].map(h => <th key={h} className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {invoices.map(inv => (
                      <tr key={inv.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                        <td className="px-5 py-3 text-sm font-mono font-medium" style={{ color: 'var(--brand-600)' }}>{inv.invoice_number}</td>
                        <td className="px-5 py-3 text-sm font-semibold">{formatCurrency(inv.total_amount)}</td>
                        <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{formatDate(inv.due_date)}</td>
                        <td className="px-5 py-3"><span className={cn('badge ring-1', STATUS_COLORS[inv.status])}>{inv.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
