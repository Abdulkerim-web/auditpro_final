'use client'
import { useState, useEffect, useRef } from 'react'
import { Search, Send, Paperclip, Circle } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { cn, formatRelativeTime, getInitials } from '@/utils'
import { useAuth } from '@/lib/auth-context'
import { fetchMessages, sendMessage } from '@/lib/db'
import type { Message } from '@/lib/supabase'

interface Thread {
  clientId: string
  clientName: string
  engagementId?: string
  engagementTitle?: string
  messages: Message[]
  lastMsg: Message
  unread: number
}

export default function MessagesPage() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [threads, setThreads] = useState<Thread[]>([])
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [newMsg, setNewMsg] = useState('')
  const [search, setSearch] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const msgs = await fetchMessages()
        if (!mounted) return
        // Group messages into threads by client_id
        const threadMap = new Map<string, Message[]>()
        msgs.forEach(m => {
          const key = m.client_id || m.engagement_id || m.id
          if (!threadMap.has(key)) threadMap.set(key, [])
          threadMap.get(key)!.push(m)
        })
        const built: Thread[] = []
        threadMap.forEach((threadMsgs, key) => {
          const sorted = threadMsgs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          const last = sorted[sorted.length - 1]
          built.push({
            clientId: key,
            clientName: last.sender_role === 'client' ? (last.sender_name || 'Client') : (sorted.find(m => m.sender_role === 'client')?.sender_name || 'Client'),
            engagementId: last.engagement_id || undefined,
            engagementTitle: undefined,
            messages: sorted,
            lastMsg: last,
            unread: sorted.filter(m => !m.is_read && m.sender_role === 'client').length,
          })
        })
        built.sort((a, b) => new Date(b.lastMsg.created_at).getTime() - new Date(a.lastMsg.created_at).getTime())
        setThreads(built)
        if (built.length > 0) setActiveThreadId(built[0].clientId)
      } catch (err) {
        console.error('Messages load failed:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeThreadId, threads])

  const activeThread = threads.find(t => t.clientId === activeThreadId)
  const filteredThreads = threads.filter(t =>
    !search || t.clientName.toLowerCase().includes(search.toLowerCase())
  )

  const handleSend = async () => {
    if (!newMsg.trim() || !activeThread || !profile) return
    setSending(true)
    try {
      const msg = await sendMessage({
        engagement_id: activeThread.engagementId,
        client_id: activeThread.clientId,
        sender_id: profile.id,
        sender_name: profile.full_name,
        sender_role: 'auditor',
        content: newMsg.trim(),
      })
      setThreads(prev => prev.map(t => t.clientId === activeThread.clientId
        ? { ...t, messages: [...t.messages, msg], lastMsg: msg }
        : t))
      setNewMsg('')
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
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" style={{ borderWidth: '3px' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader title="Messages" subtitle="Secure communication with your clients" />
      <div className="flex-1 flex overflow-hidden">
        {/* Thread list */}
        <div className="w-72 border-r flex flex-col flex-shrink-0" style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}>
          <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." className="input-field pl-9 h-9 text-sm" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredThreads.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No conversations</div>
            ) : filteredThreads.map(thread => (
              <button key={thread.clientId} onClick={() => setActiveThreadId(thread.clientId)}
                className={cn('w-full text-left px-4 py-3.5 border-b transition-colors', 'hover:bg-gray-50',
                  activeThreadId === thread.clientId && 'bg-blue-50 border-l-2 border-l-blue-500')}
                style={{ borderBottomColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {getInitials(thread.clientName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{thread.clientName}</span>
                      <span className="text-xs flex-shrink-0 ml-2" style={{ color: 'var(--text-muted)' }}>
                        {formatRelativeTime(thread.lastMsg.created_at)}
                      </span>
                    </div>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>{thread.lastMsg.content}</p>
                  </div>
                  {thread.unread > 0 && (
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: 'var(--brand-500)' }}>
                      {thread.unread}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message view */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeThread ? (
            <>
              {/* Thread header */}
              <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}>
                <div>
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{activeThread.clientName}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{activeThread.engagementTitle || 'General conversation'}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Circle size={8} className="fill-green-500 text-green-500" />
                  End-to-end encrypted
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4" style={{ background: 'var(--surface-1)' }}>
                {activeThread.messages.map(msg => {
                  const isMe = msg.sender_role === 'auditor'
                  return (
                    <div key={msg.id} className={cn('flex gap-3', isMe && 'flex-row-reverse')}>
                      {!isMe && (
                        <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {getInitials(msg.sender_name || '?')}
                        </div>
                      )}
                      <div className={cn('max-w-sm flex flex-col gap-1', isMe && 'items-end')}>
                        <div className={cn('px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                          isMe ? 'rounded-tr-sm text-white' : 'rounded-tl-sm')}
                          style={{
                            background: isMe ? 'var(--brand-600)' : 'var(--surface-0)',
                            color: isMe ? 'white' : 'var(--text-primary)',
                            border: isMe ? 'none' : '1px solid var(--border)'
                          }}>
                          {msg.content}
                        </div>
                        <span className="text-xs px-1" style={{ color: 'var(--text-muted)' }}>
                          {!isMe && `${msg.sender_name || 'Client'} · `}{formatRelativeTime(msg.created_at)}
                        </span>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-6 py-4 border-t flex items-center gap-3" style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Paperclip size={18} style={{ color: 'var(--text-muted)' }} />
                </button>
                <input
                  value={newMsg} onChange={e => setNewMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..." className="input-field flex-1 h-10 text-sm"
                  disabled={sending}
                />
                <button onClick={handleSend} disabled={!newMsg.trim() || sending}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
                  style={{ background: 'var(--brand-600)' }}>
                  <Send size={16} className="text-white" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--surface-1)' }}>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Select a conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
