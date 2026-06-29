'use client'
import { useState } from 'react'
import { Search, Plus, Building2, Mail, Phone, Tag, MoreVertical, Filter } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { cn, STATUS_COLORS, INDUSTRY_LABELS } from '@/utils'
import Link from 'next/link'

const DEMO_CLIENTS = [
  { id: '1', company_name: 'Ethio Trading PLC', industry: 'retail', status: 'active', city: 'Addis Ababa', primary_contact_name: 'Abebe Girma', primary_contact_email: 'a.girma@ethiotrading.et', tags: ['Priority', 'IFRS'], engagements: 3 },
  { id: '2', company_name: 'Abyssinia Hotels Group', industry: 'hospitality', status: 'active', city: 'Addis Ababa', primary_contact_name: 'Hana Tesfaye', primary_contact_email: 'hana@abyssiniahotels.et', tags: ['Large'], engagements: 2 },
  { id: '3', company_name: 'Nile Construction Ltd', industry: 'real_estate', status: 'active', city: 'Hawassa', primary_contact_name: 'Dawit Tadesse', primary_contact_email: 'd.tadesse@nileconstruction.et', tags: [], engagements: 1 },
  { id: '4', company_name: 'East Africa Dev Fund', industry: 'ngo', status: 'active', city: 'Addis Ababa', primary_contact_name: 'Dr. Samuel Bekele', primary_contact_email: 's.bekele@eadf.org', tags: ['Donor Funded'], engagements: 2 },
  { id: '5', company_name: 'Habesha Breweries', industry: 'manufacturing', status: 'active', city: 'Addis Ababa', primary_contact_name: 'Yohannes Alemu', primary_contact_email: 'y.alemu@habesha.et', tags: ['Annual'], engagements: 4 },
  { id: '6', company_name: 'Summit Bank SC', industry: 'financial_services', status: 'prospect', city: 'Addis Ababa', primary_contact_name: 'Meron Bekele', primary_contact_email: 'm.bekele@summitbank.et', tags: ['Prospect'], engagements: 0 },
]

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = DEMO_CLIENTS.filter(c => {
    const matchSearch = c.company_name.toLowerCase().includes(search.toLowerCase()) ||
      c.primary_contact_name?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader
        title="Clients"
        subtitle={`${DEMO_CLIENTS.filter(c => c.status === 'active').length} active clients`}
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
            { label: 'Total Clients', value: DEMO_CLIENTS.length },
            { label: 'Active', value: DEMO_CLIENTS.filter(c => c.status === 'active').length },
            { label: 'Prospects', value: DEMO_CLIENTS.filter(c => c.status === 'prospect').length },
          ].map(s => (
            <div key={s.label} className="card px-5 py-4 flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
              <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Client cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(client => (
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
                      {INDUSTRY_LABELS[client.industry]} · {client.city}
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
                  <span className="truncate">{client.primary_contact_email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <Building2 size={12} />
                  {client.primary_contact_name}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {client.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  {client.engagements} engagement{client.engagements !== 1 ? 's' : ''}
                </span>
              </div>
            </Link>
          ))}
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
