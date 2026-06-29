'use client'
import { useState } from 'react'
import { Search, Upload, FileText, FileSpreadsheet, Image, File, Download, Eye, Trash2, Filter } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { cn, STATUS_COLORS, formatDate, formatFileSize } from '@/utils'

const DOCS = [
  { id: '1', name: 'Bank Statements Jan–Dec 2023.pdf', client: 'Ethio Trading PLC', engagement: 'Statutory Audit FY2023', document_type: 'bank_statement', status: 'approved', file_size: 2400000, file_type: 'pdf', created_at: '2024-01-20' },
  { id: '2', name: 'Trial Balance 31 Dec 2023.xlsx', client: 'Ethio Trading PLC', engagement: 'Statutory Audit FY2023', document_type: 'financial_statement', status: 'reviewed', file_size: 580000, file_type: 'xlsx', created_at: '2024-01-22' },
  { id: '3', name: 'Fixed Asset Register 2023.xlsx', client: 'Ethio Trading PLC', engagement: 'Statutory Audit FY2023', document_type: 'pbc_document', status: 'pending', file_size: 920000, file_type: 'xlsx', created_at: '2024-01-28' },
  { id: '4', name: 'Internal Controls Assessment Q4.pdf', client: 'Abyssinia Hotels Group', engagement: 'Internal Audit Q4', document_type: 'working_paper', status: 'uploaded', file_size: 1800000, file_type: 'pdf', created_at: '2024-01-18' },
  { id: '5', name: 'VAT Returns 2023 All Quarters.pdf', client: 'Nile Construction Ltd', engagement: 'Tax Compliance', document_type: 'tax_return', status: 'uploaded', file_size: 3200000, file_type: 'pdf', created_at: '2024-01-27' },
  { id: '6', name: 'Audit Report Draft v2.pdf', client: 'East Africa Dev Fund', engagement: 'Compliance Review', document_type: 'audit_report', status: 'approved', file_size: 1100000, file_type: 'pdf', created_at: '2024-01-24' },
]

const fileIcons: Record<string, React.ReactNode> = {
  pdf: <FileText size={18} className="text-red-500" />,
  xlsx: <FileSpreadsheet size={18} className="text-green-600" />,
  image: <Image size={18} className="text-blue-500" />,
}

export default function DocumentsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = DOCS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.client.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || d.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader title="Documents" subtitle="All client documents and working papers"
        action={{ label: 'Upload File', onClick: () => {} }} />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Filters */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input type="search" placeholder="Search documents..." value={search}
              onChange={e => setSearch(e.target.value)} className="input-field pl-9 h-10 text-sm" />
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'uploaded', 'reviewed', 'approved'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={cn('px-3 py-2 rounded-lg text-xs font-medium capitalize border transition-all',
                  statusFilter === s ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50')}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Documents table */}
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
                {['Document', 'Client', 'Type', 'Size', 'Uploaded', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(doc => (
                <tr key={doc.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'var(--surface-2)' }}>
                        {fileIcons[doc.file_type] || <File size={18} style={{ color: 'var(--text-muted)' }} />}
                      </div>
                      <span className="text-sm font-medium truncate max-w-[200px]" style={{ color: 'var(--text-primary)' }}>
                        {doc.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{doc.client}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{doc.engagement}</div>
                  </td>
                  <td className="px-4 py-3.5 text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>
                    {doc.document_type.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {formatFileSize(doc.file_size)}
                  </td>
                  <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {formatDate(doc.created_at)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn('badge ring-1', STATUS_COLORS[doc.status])}>{doc.status}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded hover:bg-gray-100 transition-colors"><Eye size={14} style={{ color: 'var(--text-muted)' }} /></button>
                      <button className="p-1.5 rounded hover:bg-gray-100 transition-colors"><Download size={14} style={{ color: 'var(--text-muted)' }} /></button>
                      <button className="p-1.5 rounded hover:bg-red-50 transition-colors"><Trash2 size={14} className="text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <FileText size={40} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No documents found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
