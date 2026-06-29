'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Lock } from 'lucide-react'
import { formatRelativeTime, getInitials } from '@/utils'
import { useAuth } from '@/lib/auth-context'
import { fetchClientByProfileId, fetchMessages, sendMessage } from '@/lib/db'
import type { Message } from '@/lib/supabase'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export default function ClientMessagesPage() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [msgs, setMsgs] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [clientId, setClientId] = useState<string | null>(null)
  const [engagementId, setEngagementId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true
    if (!profile?.id) return
    ;(async () => {
      try {
        const c = await fetchClientByProfileId(profile.id)
        if (!c) { setLoading(false); return }
        if (mounted) setClientId(c.id)
        const m = await fetchMessages(c.id)
        if (mounted) {
          setMsgs(m)
          if (m.length > 0) setEngagementId(m[0].engagement_id || null)
        }
      } catch (err) {
        console.error('Client messages load failed:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [profile?.id])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  const sendMsg = async () => {
    if (!input.trim() || !profile || !clientId) return
    setSending(true)
    try {
      const msg = await sendMessage({
        engagement_id: engagementId || undefined,
        client_id: clientId,
        sender_id: profile.id,
        sender_name: profile.full_name,
        sender_role: 'client',
        content: input.trim(),
      })
      setMsgs(prev => [...prev, msg])
      setInput('')
    } catch (err) {
      console.error('Send failed:', err)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col flex-1">
        <DashboardHeader title="Messages" subtitle="Loading..." />
        <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--surface-1)' }}>
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" style={{ borderWidth: '3px' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader title="Messages" subtitle="Secure communication with your audit team" />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Thread header */}
        <div className="px-6 py-3 border-b flex items-center justify-between bg-white" style={{ borderColor: 'var(--border)' }}>
          <div>
            <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Conversation with your audit team</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{profile?.company_name || 'Your company'}</div>
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--success)' }}><Lock size={10} />End-to-end encrypted</div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4" style={{ background: 'var(--surface-1)' }}>
          {msgs.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No messages yet. Start the conversation!</p>
            </div>
          ) : msgs.map(msg => {
            const isMe = msg.sender_role === 'client'
            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                {!isMe && <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{getInitials(msg.sender_name || '?')}</div>}
                <div className={`flex flex-col gap-0.5 max-w-sm ${isMe ? 'items-end' : ''}`}>
                  <div className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={isMe ? { background: 'var(--brand-600)', color: 'white', borderRadius: '18px 18px 4px 18px' }
                      : { background: 'var(--surface-0)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '18px 18px 18px 4px' }}>
                    {msg.content}
                  </div>
                  <span className="text-xs px-1" style={{ color: 'var(--text-muted)' }}>{msg.sender_name || 'Unknown'} · {formatRelativeTime(msg.created_at)}</span>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t flex items-center gap-3 bg-white" style={{ borderColor: 'var(--border)' }}>
          <button className="p-2 rounded-xl hover:bg-gray-100"><Paperclip size={17} style={{ color: 'var(--text-muted)' }} /></button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()}
            placeholder="Type a secure message..." className="flex-1 input-field h-10 text-sm" disabled={sending} />
          <button onClick={sendMsg} disabled={!input.trim() || sending} className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40" style={{ background: 'var(--brand-600)' }}>
            <Send size={15} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
