'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CircleCheck as CheckCircle2, Circle, FileText, Download } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { cn, STATUS_COLORS, ENGAGEMENT_TYPE_LABELS, formatCurrency, formatDate } from '@/utils'
import { fetchEngagement, fetchMilestones, fetchDocuments, fetchPBCRequests, fetchMessagesByEngagement } from '@/lib/db'
import type { Engagement, Milestone, DocumentRow, PBCRequest, Message } from '@/lib/supabase'

const STATUS_STEPS = ['planning', 'fieldwork', 'review', 'reporting', 'completed']

export default function EngagementDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const [loading, setLoading] = useState(true)
  const [eng, setEng] = useState<Engagement | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [docs, setDocs] = useState<DocumentRow[]>([])
  const [pbcItems, setPbcItems] = useState<PBCRequest[]>([])
  const [msgs, setMsgs] = useState<Message[]>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [e, m, d, p, msg] = await Promise.all([
          fetchEngagement(id),
          fetchMilestones(id),
          fetchDocuments({ engagementId: id }),
          fetchPBCRequests(id),
          fetchMessagesByEngagement(id),
        ])
        if (!mounted) return
        setEng(e)
        setMilestones(m)
        setDocs(d)
        setPbcItems(p)
        setMsgs(msg)
      } catch (err) {
        console.error('Engagement detail load failed:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col flex-1">
        <DashboardHeader title="Engagement" subtitle="Loading..." />
        <div className="flex-1 p-6 flex items-center justify-center" style={{ background: 'var(--surface-1)' }}>
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" style={{ borderWidth: '3px' }} />
        </div>
      </div>
    )
  }

  if (!eng) {
    return (
      <div className="flex flex-col flex-1">
        <DashboardHeader title="Engagement not found" />
        <div className="flex-1 p-6 flex items-center justify-center" style={{ background: 'var(--surface-1)' }}>
          <Link href="/dashboard/engagements" className="text-sm" style={{ color: 'var(--brand-600)' }}>Back to Engagements</Link>
        </div>
      </div>
    )
  }

  const currentStep = STATUS_STEPS.indexOf(eng.status)

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader title={eng.title} subtitle={eng.client?.company_name} />
      <div className="flex-1 p-6 overflow-y-auto" style={{ background: 'var(--surface-1)' }}>
        <Link href="/dashboard/engagements" className="inline-flex items-center gap-1.5 text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={14} />Back to Engagements
        </Link>

        {/* Status pipeline */}
        <div className="card p-5 mb-5 animate-fade-in">
          <div className="flex items-center gap-0 mb-3">
            {STATUS_STEPS.map((step, i) => {
              const done = i <= currentStep
              const active = i === currentStep
              return (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className={cn('flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap', done ? 'text-blue-700' : 'text-gray-400')}>
                    <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all', active ? 'border-blue-600 bg-blue-600 text-white scale-110 pulse-ring' : done ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-400')}>
                      {done && !active ? <CheckCircle2 size={14} /> : i + 1}
                    </div>
                    <span className="hidden sm:inline capitalize">{step}</span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && <div className={cn('flex-1 h-0.5 mx-2', i < currentStep ? 'bg-blue-600' : 'bg-gray-200')} />}
                </div>
              )
            })}
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
              <span>Overall progress</span><span className="font-bold" style={{ color: 'var(--text-primary)' }}>{eng.progress}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${eng.progress}%`, background: eng.progress === 100 ? '#10b981' : 'var(--brand-500)' }} />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Left */}
          <div className="flex flex-col gap-4">
            <div className="card p-5">
              <h3 className="font-bold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>Engagement Details</h3>
              <div className="flex flex-col gap-3 text-sm">
                {[
                  { label: 'Client', value: eng.client?.company_name || '—' },
                  { label: 'Type', value: ENGAGEMENT_TYPE_LABELS[eng.type] || eng.type },
                  { label: 'Period', value: `${formatDate(eng.period_start)} – ${formatDate(eng.period_end)}` },
                  { label: 'Planned start', value: formatDate(eng.planned_start) },
                  { label: 'Deadline', value: formatDate(eng.planned_end) },
                  { label: 'Fee', value: formatCurrency(eng.fee_amount || 0) },
                  { label: 'Hours logged', value: `${eng.billable_hours}h / ${eng.budgeted_hours || 0}h` },
                ].map(r => (
                  <div key={r.label} className="flex justify-between gap-2">
                    <span className="flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                    <span className="font-medium text-right" style={{ color: 'var(--text-primary)' }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div className="card p-5">
              <h3 className="font-bold mb-3 text-sm" style={{ color: 'var(--text-primary)' }}>Milestones</h3>
              {milestones.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No milestones defined</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {milestones.map(m => (
                    <div key={m.id} className="flex items-start gap-2.5">
                      {m.is_completed ? <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" /> : <Circle size={16} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />}
                      <div>
                        <p className={cn('text-sm', m.is_completed && 'line-through')} style={{ color: m.is_completed ? 'var(--text-muted)' : 'var(--text-primary)' }}>{m.title}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(m.due_date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* PBC Requests */}
            {pbcItems.length > 0 && (
              <div className="card">
                <div className="px-5 pt-5 pb-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Document Requests (PBC)</h3>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{pbcItems.filter(p => p.is_completed).length}/{pbcItems.length} completed</span>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {pbcItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 px-5 py-3.5">
                      {item.is_completed ? <CheckCircle2 size={17} className="text-green-600 flex-shrink-0" /> : <Circle size={17} className="flex-shrink-0" style={{ color: 'var(--text-muted)' }} />}
                      <div className="flex-1">
                        <p className={cn('text-sm', item.is_completed && 'line-through')} style={{ color: item.is_completed ? 'var(--text-muted)' : 'var(--text-primary)' }}>{item.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Due: {formatDate(item.due_date)}</p>
                      </div>
                      {item.is_completed && <Download size={14} className="text-gray-400 cursor-pointer hover:text-gray-600" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            <div className="card">
              <div className="px-5 pt-5 pb-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Documents ({docs.length})</h3>
                <Link href="/dashboard/documents" className="text-xs font-semibold" style={{ color: 'var(--brand-600)' }}>View all</Link>
              </div>
              {docs.length === 0 ? <div className="px-5 py-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No documents yet</div> : docs.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 px-5 py-3.5 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--surface-2)' }}>
                    <FileText size={15} style={{ color: doc.file_type === 'pdf' ? '#ef4444' : '#059669' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{doc.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>By {doc.uploaded_by || 'Pending'} · {formatDate(doc.created_at)}</p>
                  </div>
                  <span className={cn('badge ring-1', STATUS_COLORS[doc.status])}>{doc.status}</span>
                </div>
              ))}
            </div>

            {/* Recent messages */}
            {msgs.length > 0 && (
              <div className="card">
                <div className="px-5 pt-5 pb-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Recent Messages</h3>
                  <Link href="/dashboard/messages" className="text-xs font-semibold" style={{ color: 'var(--brand-600)' }}>Open thread →</Link>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {msgs.slice(-3).map(msg => (
                    <div key={msg.id} className="px-5 py-3.5">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold">{(msg.sender_name || '?')[0]}</div>
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{msg.sender_name || 'Unknown'}</span>
                        {!msg.is_read && msg.sender_role === 'client' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                      </div>
                      <p className="text-xs leading-relaxed ml-8 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{msg.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
