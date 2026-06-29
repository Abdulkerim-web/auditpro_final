'use client'
import { useState } from 'react'
import { Upload, FileText, FileSpreadsheet, Download, Eye, CheckCircle2 } from 'lucide-react'
import { DOCUMENTS } from '@/lib/data'
import { cn, STATUS_COLORS, formatDate, formatFileSize } from '@/utils'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export default function ClientDocumentsPage() {
  const [dragOver, setDragOver] = useState(false)
  const docs = DOCUMENTS.filter(d => d.client_id === 'cli-001')
  const fileIcons: Record<string,any> = { pdf: FileText, xlsx: FileSpreadsheet }

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader title="My Documents" subtitle="All your uploaded and shared documents" />
      <div className="flex-1 p-6 overflow-y-auto" style={{ background: 'var(--surface-1)' }}>
        {/* Upload zone */}
        <div onDragOver={e => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false) }}
          className={cn('border-2 border-dashed rounded-2xl p-10 text-center mb-6 transition-all cursor-pointer', dragOver ? 'border-blue-400 bg-blue-50' : 'hover:border-gray-400 hover:bg-gray-50')}
          style={{ borderColor: dragOver ? undefined : 'var(--border-strong)' }}>
          <Upload size={36} className="mx-auto mb-3" style={{ color: dragOver ? 'var(--brand-500)' : 'var(--text-muted)' }} />
          <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Drop files here or <span className="text-blue-600">browse</span></p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>PDF, Excel, Word — max 50MB per file</p>
        </div>

        <div className="card overflow-hidden">
          <div className="px-5 py-3.5 border-b font-bold text-sm" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}>
            Documents ({docs.length})
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {docs.map(doc => {
              const Icon = fileIcons[doc.file_type] || FileText
              return (
                <div key={doc.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--surface-2)' }}>
                    <Icon size={18} style={{ color: doc.file_type === 'pdf' ? '#ef4444' : '#059669' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{doc.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatFileSize(doc.file_size)} · {doc.created_at ? formatDate(doc.created_at) : 'Pending upload'}</p>
                  </div>
                  <span className={cn('badge ring-1', STATUS_COLORS[doc.status])}>{doc.status}</span>
                  <div className="flex gap-1">
                    <button className="p-2 rounded-lg hover:bg-gray-100"><Eye size={14} style={{ color: 'var(--text-muted)' }} /></button>
                    {doc.status !== 'pending' && <button className="p-2 rounded-lg hover:bg-gray-100"><Download size={14} style={{ color: 'var(--text-muted)' }} /></button>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
