'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Lock } from 'lucide-react'
import { MESSAGES } from '@/lib/data'
import { formatRelativeTime, getInitials } from '@/utils'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export default function ClientMessagesPage() {
  const [msgs, setMsgs] = useState(MESSAGES.filter(m => m.client_id === 'cli-001'))
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  const sendMsg = () => {
    if (!input.trim()) return
    setMsgs(prev => [...prev, { id: Date.now().toString(), thread_id: 'thr-001', client_id: 'cli-001', engagement_id: 'eng-001', sender: 'Abebe Girma', sender_role: 'client', content: input, created_at: new Date().toISOString(), read: true }])
    setInput('')
  }

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader title="Messages" subtitle="Secure communication with your audit team" />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Thread header */}
        <div className="px-6 py-3 border-b flex items-center justify-between bg-white" style={{ borderColor: 'var(--border)' }}>
          <div>
            <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Statutory Audit FY2023 — Beyan Omer</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Ethio Trading PLC</div>
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--success)' }}><Lock size={10} />End-to-end encrypted</div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4" style={{ background: 'var(--surface-1)' }}>
          {msgs.map(msg => {
            const isMe = msg.sender_role === 'client'
            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                {!isMe && <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{getInitials(msg.sender)}</div>}
                <div className={`flex flex-col gap-0.5 max-w-sm ${isMe ? 'items-end' : ''}`}>
                  <div className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={isMe ? { background: 'var(--brand-600)', color: 'white', borderRadius: '18px 18px 4px 18px' }
                      : { background: 'var(--surface-0)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '18px 18px 18px 4px' }}>
                    {msg.content}
                  </div>
                  <span className="text-xs px-1" style={{ color: 'var(--text-muted)' }}>{msg.sender} · {formatRelativeTime(msg.created_at)}</span>
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
            placeholder="Type a secure message..." className="flex-1 input-field h-10 text-sm" />
          <button onClick={sendMsg} disabled={!input.trim()} className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40" style={{ background: 'var(--brand-600)' }}>
            <Send size={15} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
