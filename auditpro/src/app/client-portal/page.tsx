'use client'
import { useEffect, useState } from 'react'
import { CheckCircle2, Upload, Bell, AlertCircle, ArrowRight, Download, MessageSquare, FileText, CreditCard, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { cn, formatDate, formatCurrency } from '@/utils'
import { ENGAGEMENTS, CLIENTS, PBC_REQUESTS, MESSAGES, INVOICES } from '@/lib/data'
import { getSessionFromCookies } from '@/lib/auth'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

const STATUS_STEPS = ['planning', 'fieldwork', 'review', 'reporting', 'completed']

export default function ClientPortalPage() {
  const [userName, setUserName] = useState('Abebe')
  const [notifOpen, setNotifOpen] = useState(false)

  useEffect(() => {
    const { user } = getSessionFromCookies()
    if (user) setUserName(user.name.split(' ')[0])
  }, [])

  // Simulated client data
  const client = CLIENTS[0]
  const engagement = { ...ENGAGEMENTS[0], client: CLIENTS[0] }
  const pbcItems = PBC_REQUESTS.filter(p => p.engagement_id === 'eng-001')
  const msgs = MESSAGES.filter(m => m.client_id === 'cli-001')
  const invoices = INVOICES.filter(i => i.client_id === 'cli-001')
  const unreadMsgs = msgs.filter(m => !m.read && m.sender_role === 'auditor').length
  const pendingInvoice = invoices.find(i => i.status === 'sent' || i.status === 'overdue')
  const pbcDone = pbcItems.filter(p => p.done).length
  const pbcPct = Math.round((pbcDone / pbcItems.length) * 100)
  const currentStep = STATUS_STEPS.indexOf(engagement.status)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col flex-1">
      {/* Custom header */}
      <header className="h-16 border-b flex items-center justify-between px-6 bg-white flex-shrink-0 sticky top-0 z-10"
        style={{ borderColor: 'var(--border)' }}>
        <div>
          <h1 className="font-extrabold text-lg leading-tight" style={{ color: 'var(--text-primary)' }}>
            {greeting}, {userName} 👋
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100">
              <Bell size={17} style={{ color: 'var(--text-secondary)' }} />
              {(unreadMsgs > 0 || pendingInvoice) && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white pulse-ring"
                  style={{ background: '#ef4444', fontSize: '10px' }}>
                  {unreadMsgs + (pendingInvoice ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'var(--gold-500)' }}>
            {userName[0]}
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 overflow-y-auto" style={{ background: 'var(--surface-1)' }}>

        {/* Overdue alert */}
        {pendingInvoice?.status === 'overdue' && (
          <Link href="/client-portal/invoices"
            className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5 text-sm font-medium animate-fade-in"
            style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
            <AlertCircle size={16} className="flex-shrink-0" />
            Invoice {pendingInvoice.invoice_number} is overdue — {formatCurrency(pendingInvoice.total_amount)}
            <ArrowRight size={14} className="ml-auto" />
          </Link>
        )}

        {/* Audit stage tracker */}
        <div className="card p-6 mb-5 animate-fade-in relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-full opacity-5 gradient-brand" style={{ borderRadius: '50% 0 0 50%' }} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-extrabold text-base" style={{ color: 'var(--text-primary)' }}>{engagement.title}</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Period: {formatDate(engagement.period_start)} – {formatDate(engagement.period_end)}
                </p>
              </div>
              <span className="badge ring-1 bg-violet-50 text-violet-700 ring-violet-600/20 capitalize">
                {engagement.status}
              </span>
            </div>

            {/* Stage steps */}
            <div className="flex items-center gap-0 mb-5 overflow-x-auto">
              {STATUS_STEPS.map((step, i) => {
                const done = i < currentStep
                const active = i === currentStep
                return (
                  <div key={step} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center gap-1">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all',
                        active ? 'border-blue-600 bg-blue-600 text-white scale-110 pulse-ring'
                          : done ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-gray-300 bg-white text-gray-400'
                      )}>
                        {done ? <CheckCircle2 size={14} /> : i + 1}
                      </div>
                      <span className={cn('text-xs font-medium capitalize hidden sm:block', active ? 'text-blue-700' : done ? 'text-blue-600' : 'text-gray-400')}>
                        {step}
                      </span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={cn('w-10 sm:w-16 h-0.5 mx-1 flex-shrink-0', i < currentStep ? 'bg-blue-600' : 'bg-gray-200')} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                <span>Documents submitted</span>
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{pbcDone}/{pbcItems.length}</span>
              </div>
              <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${pbcPct}%`, background: pbcPct === 100 ? '#10b981' : 'var(--brand-500)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          {[
            { icon: FileText, label: 'Docs Submitted', value: `${pbcDone}/${pbcItems.length}`, color: '#2563eb', bg: '#eff6ff', href: '/client-portal/requests' },
            { icon: MessageSquare, label: 'Unread Messages', value: unreadMsgs, color: '#7c3aed', bg: '#f5f3ff', href: '/client-portal/messages' },
            { icon: CreditCard, label: 'Outstanding', value: formatCurrency(invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.total_amount, 0)), color: '#d97706', bg: '#fffbeb', href: '/client-portal/invoices' },
            { icon: TrendingUp, label: 'Audit Progress', value: `${engagement.progress}%`, color: '#059669', bg: '#ecfdf5', href: '/client-portal' },
          ].map((s, i) => (
            <Link key={s.label} href={s.href}
              className="stat-card float-card flex flex-col gap-2 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div className="text-xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* PBC checklist */}
          <div className="lg:col-span-2 card animate-fade-in delay-200">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Document Requests</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Upload to progress your audit</p>
              </div>
              <Link href="/client-portal/requests" className="text-xs font-semibold" style={{ color: 'var(--brand-600)' }}>View all →</Link>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {pbcItems.map(item => (
                <div key={item.id} className={cn('flex items-center gap-4 px-5 py-4 transition-colors', !item.done && 'hover:bg-blue-50/30')}>
                  <div className={cn('w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                    item.done ? 'bg-emerald-100' : 'border-2 border-gray-300')}>
                    {item.done && <CheckCircle2 size={15} className="text-emerald-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm', item.done ? 'line-through' : 'font-medium')}
                      style={{ color: item.done ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      {item.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{
                      color: !item.done && new Date(item.due) < new Date() ? '#dc2626' : 'var(--text-muted)'
                    }}>
                      Due: {formatDate(item.due)}
                    </p>
                  </div>
                  {item.done
                    ? <button className="p-1.5 rounded-lg hover:bg-gray-100"><Download size={14} style={{ color: 'var(--text-muted)' }} /></button>
                    : <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        style={{ background: 'var(--brand-50)', color: 'var(--brand-600)' }}>
                        <Upload size={11} />Upload
                      </button>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            {/* Messages */}
            <div className="card animate-fade-in delay-300">
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Messages</h3>
                {unreadMsgs > 0 && (
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: 'var(--brand-500)' }}>{unreadMsgs}</span>
                )}
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {msgs.slice(-2).map((msg, i) => (
                  <div key={msg.id} className={cn('px-5 py-3.5', !msg.read && msg.sender_role === 'auditor' && 'bg-blue-50/50')}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{msg.sender}</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {new Date(msg.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{msg.content}</p>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <Link href="/client-portal/messages"
                  className="text-xs font-semibold flex items-center justify-center gap-1.5 py-2 rounded-xl w-full transition-colors"
                  style={{ color: 'var(--brand-600)', background: 'var(--brand-50)' }}>
                  <MessageSquare size={12} />Open Messages
                </Link>
              </div>
            </div>

            {/* Invoice */}
            {pendingInvoice && (
              <div className="card animate-fade-in delay-400">
                <div className="px-5 pt-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Outstanding Invoice</h3>
                </div>
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-medium" style={{ color: 'var(--text-muted)' }}>{pendingInvoice.invoice_number}</span>
                    <span className={cn('badge ring-1',
                      pendingInvoice.status === 'overdue' ? 'bg-red-50 text-red-700 ring-red-600/20' : 'bg-blue-50 text-blue-700 ring-blue-600/20')}>
                      {pendingInvoice.status}
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {formatCurrency(pendingInvoice.total_amount)}
                  </div>
                  <div className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                    Due: {formatDate(pendingInvoice.due_date)}
                  </div>
                  <button className="btn-primary w-full text-sm flex items-center justify-center gap-2">
                    <CreditCard size={14} />Pay Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
