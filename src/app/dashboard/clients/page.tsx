'use client'
import { useState, useEffect } from 'react'
import { Search, Plus, Building2, Mail, Building2 as BuildingIcon } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { cn, STATUS_COLORS, INDUSTRY_LABELS } from '@/utils'
import Link from 'next/link'
import { fetchClients, fetchEngagements } from '@/lib/db'
import type { Client, Engagement } from '@/lib/supabase'

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [engagementCounts, setEngagementCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [c, e] = await Promise.all([fetchClients(), fetchEngagements()])
        if (!mounted) return
        setClients(c)
        const counts: Record<string, number> = {}
        e.forEach(eng => { counts[eng.client_id] = (counts[eng.client_id] || 0) + 1 })
        setEngagementCounts(counts)
      } catch (err) {
        console.error('Clients load failed:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = clients.filter(c => {
    const s = search.toLowerCase()
    const matchSearch = c.company_name.toLowerCase().includes(s) ||
      (c.primary_contact_name || '').toLowerCase().includes(s)
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  const activeCount = clients.filter(c => c.status === 'active').length
  const prospectCount = clients.filter(c => c.status === 'prospect').length

  if (loading) {
    return (
      <div className="flex flex-col flex-1">
        <DashboardHeader title="Clients" subtitle="Loading..." />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" style={{ borderWidth: '3px' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader
        title="Clients"
        subtitle={`${activeCount} active clients`}
        action={{ label: 'Add Client', onClick: () => {} }}
      />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="search" placeholder="Search clients..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="input-field pl-9 h-10"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'prospect', 'inactive'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={cn('px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all border',
                  statusFilter === s
                    ? 'border-blue-200 text-blue-700 bg-blue-50'
                    : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
                )}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Clients', value: clients.length },
            { label: 'Active', value: activeCount },
            { label: 'Prospects', value: prospectCount },
          ].map(s => (
            <div key={s.label} className="card px-5 py-4 flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
              <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Client cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(client => {
            const engCount = engagementCounts[client.id] || 0
            return (
              <Link key={client.id} href={`/dashboard/clients/${client.id}`} className="card card-hover p-5 block">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {client.company_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>
                        {client.company_name}
                      </h3>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {INDUSTRY_LABELS[client.industry] || client.industry} · {client.city || '—'}
                      </span>
                    </div>
                  </div>
                  <span className={cn('badge ring-1', STATUS_COLORS[client.status])}>
                    {client.status}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <Mail size={12} />
                    <span className="truncate">{client.primary_contact_email || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <BuildingIcon size={12} />
                    {client.primary_contact_name || '—'}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {(client.tags || []).map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    {engCount} engagement{engCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Building2 size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>No clients found</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
