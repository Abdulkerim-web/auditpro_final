'use client'
import { useState, useEffect } from 'react'
import { CircleCheck as CheckCircle2, Circle, Upload, Download, CircleAlert as AlertCircle } from 'lucide-react'
import { formatDate, cn } from '@/utils'
import { useAuth } from '@/lib/auth-context'
import { fetchClientByProfileId, fetchEngagements, fetchPBCRequests, togglePBCRequest } from '@/lib/db'
import type { PBCRequest } from '@/lib/supabase'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export default function ClientRequestsPage() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<PBCRequest[]>([])
  const [engagementTitle, setEngagementTitle] = useState('')

  useEffect(() => {
    let mounted = true
    if (!profile?.id) return
    ;(async () => {
      try {
        const c = await fetchClientByProfileId(profile.id)
        if (!c) { setLoading(false); return }
        const engs = await fetchEngagements({ clientId: c.id })
        if (!mounted) return
        if (engs.length > 0) {
          setEngagementTitle(engs[0].title)
          const pbc = await fetchPBCRequests(engs[0].id)
          if (mounted) setItems(pbc)
        }
      } catch (err) {
        console.error('Client requests load failed:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [profile?.id])

  const done = items.filter(i => i.is_completed).length
  const pct = items.length > 0 ? Math.round((done / items.length) * 100) : 0

  const handleToggle = async (id: string, current: boolean) => {
    const newval = !current
    setItems(prev => prev.map(i => i.id === id ? { ...i, is_completed: newval } : i))
    try {
      await togglePBCRequest(id, newval)
    } catch (err) {
      console.error('Toggle failed:', err)
      setItems(prev => prev.map(i => i.id === id ? { ...i, is_completed: current } : i))
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col flex-1">
        <DashboardHeader title="Document Requests" subtitle="Loading..." />
        <div className="flex-1 p-6 flex items-center justify-center" style={{ background: 'var(--surface-1)' }}>
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" style={{ borderWidth: '3px' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader title="Document Requests" subtitle="Documents requested by your audit team" />
      <div className="flex-1 p-6 overflow-y-auto" style={{ background: 'var(--surface-1)' }}>
        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>No document requests</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your audit team will post requests here when needed.</p>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="card p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{engagementTitle} — PBC List</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{done} of {items.length} items completed</p>
                </div>
                <div className="text-3xl font-extrabold" style={{ color: pct === 100 ? 'var(--success)' : 'var(--brand-600)' }}>{pct}%</div>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: pct === 100 ? '#10b981' : 'var(--brand-500)' }} />
              </div>
              {items.some(i => !i.is_completed && i.due_date && new Date(i.due_date) < new Date()) && (
                <div className="flex items-center gap-2 mt-3 text-sm" style={{ color: '#dc2626' }}>
                  <AlertCircle size={14} />Some items are overdue — please upload as soon as possible
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {items.map(item => (
                <div key={item.id} className={cn('card p-5 flex items-center gap-4 transition-all', !item.is_completed && 'hover:shadow-md')}>
                  <button onClick={() => handleToggle(item.id, item.is_completed)}>
                    {item.is_completed ? <CheckCircle2 size={22} className="text-green-600 flex-shrink-0" /> : <Circle size={22} className="flex-shrink-0" style={{ color: 'var(--text-muted)' }} />}
                  </button>
                  <div className="flex-1">
                    <p className={cn('font-medium', item.is_completed && 'line-through')} style={{ color: item.is_completed ? 'var(--text-muted)' : 'var(--text-primary)' }}>{item.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: item.due_date && new Date(item.due_date) < new Date() && !item.is_completed ? '#dc2626' : 'var(--text-muted)' }}>Due: {formatDate(item.due_date)}</p>
                  </div>
                  {item.is_completed ? (
                    <button className="btn-secondary text-xs flex items-center gap-1.5 h-8 px-3"><Download size={12} />View</button>
                  ) : (
                    <button className="btn-primary text-xs flex items-center gap-1.5 h-8 px-3"><Upload size={12} />Upload</button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
