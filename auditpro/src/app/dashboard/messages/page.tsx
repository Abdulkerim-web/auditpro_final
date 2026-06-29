'use client'
import { useState } from 'react'
import { Search, Send, Paperclip, Circle } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { cn, formatRelativeTime, getInitials } from '@/utils'

const THREADS = [
  {
    id: '1', client: 'Ethio Trading PLC', engagement: 'Statutory Audit FY2023',
    lastMsg: 'We will upload the fixed asset register by end of day tomorrow.',
    time: '2024-01-29T14:30:00', unread: 2, avatar: 'ET',
    messages: [
      { id: 'm1', sender: 'Abebe Girma', isMe: false, content: 'Hello, we have uploaded the bank statements for all accounts. Please let us know if you need anything else.', time: '2024-01-28T09:00:00' },
      { id: 'm2', sender: 'You', isMe: true, content: 'Thank you Abebe. We have reviewed the bank statements. We still need the fixed asset register as at 31 December 2023. Could you provide this by end of this week?', time: '2024-01-28T11:30:00' },
      { id: 'm3', sender: 'Abebe Girma', isMe: false, content: 'We will upload the fixed asset register by end of day tomorrow.', time: '2024-01-29T14:30:00' },
    ]
  },
  {
    id: '2', client: 'Abyssinia Hotels Group', engagement: 'Internal Audit Q4 2023',
    lastMsg: 'The draft report looks comprehensive. A few minor edits on page 8.',
    time: '2024-01-29T10:00:00', unread: 0, avatar: 'AH',
    messages: [
      { id: 'm4', sender: 'Hana Tesfaye', isMe: false, content: 'The draft report looks comprehensive. A few minor edits on page 8.', time: '2024-01-29T10:00:00' },
    ]
  },
  {
    id: '3', client: 'Nile Construction Ltd', engagement: 'Tax Compliance Review 2023',
    lastMsg: 'Please find attached the TIN certificate and ERCA registration.',
    time: '2024-01-27T16:00:00', unread: 1, avatar: 'NC',
    messages: [
      { id: 'm5', sender: 'Dawit Tadesse', isMe: false, content: 'Please find attached the TIN certificate and ERCA registration.', time: '2024-01-27T16:00:00' },
    ]
  },
]

export default function MessagesPage() {
  const [activeThread, setActiveThread] = useState(THREADS[0])
  const [newMsg, setNewMsg] = useState('')

  const handleSend = () => {
    if (!newMsg.trim()) return
    setNewMsg('')
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
              <input placeholder="Search messages..." className="input-field pl-9 h-9 text-sm" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {THREADS.map(thread => (
              <button key={thread.id} onClick={() => setActiveThread(thread)}
                className={cn('w-full text-left px-4 py-3.5 border-b transition-colors', 'hover:bg-gray-50',
                  activeThread.id === thread.id && 'bg-blue-50 border-l-2 border-l-blue-500')}
                style={{ borderBottomColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {thread.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{thread.client}</span>
                      <span className="text-xs flex-shrink-0 ml-2" style={{ color: 'var(--text-muted)' }}>
                        {formatRelativeTime(thread.time)}
                      </span>
                    </div>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>{thread.lastMsg}</p>
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
          {/* Thread header */}
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}>
            <div>
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{activeThread.client}</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{activeThread.engagement}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Circle size={8} className="fill-green-500 text-green-500" />
              End-to-end encrypted
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4" style={{ background: 'var(--surface-1)' }}>
            {activeThread.messages.map(msg => (
              <div key={msg.id} className={cn('flex gap-3', msg.isMe && 'flex-row-reverse')}>
                {!msg.isMe && (
                  <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {getInitials(msg.sender)}
                  </div>
                )}
                <div className={cn('max-w-sm flex flex-col gap-1', msg.isMe && 'items-end')}>
                  <div className={cn('px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                    msg.isMe
                      ? 'rounded-tr-sm text-white'
                      : 'rounded-tl-sm')}
                    style={{
                      background: msg.isMe ? 'var(--brand-600)' : 'var(--surface-0)',
                      color: msg.isMe ? 'white' : 'var(--text-primary)',
                      border: msg.isMe ? 'none' : '1px solid var(--border)'
                    }}>
                    {msg.content}
                  </div>
                  <span className="text-xs px-1" style={{ color: 'var(--text-muted)' }}>
                    {!msg.isMe && `${msg.sender} · `}{formatRelativeTime(msg.time)}
                  </span>
                </div>
              </div>
            ))}
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
            />
            <button onClick={handleSend} disabled={!newMsg.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
              style={{ background: 'var(--brand-600)' }}>
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
