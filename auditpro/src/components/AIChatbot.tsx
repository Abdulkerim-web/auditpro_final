'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, Minimize2, Maximize2, Sparkles } from 'lucide-react'
import { cn, formatRelativeTime } from '@/utils'
import { FIRM, SERVICES, BLOG_POSTS } from '@/lib/data'

type Msg = { id: string; role: 'user' | 'assistant'; content: string; time: string }

const SYSTEM_CONTEXT = `You are the AI assistant for ${FIRM.name}, an independent audit and assurance practice based at ${FIRM.address}, ${FIRM.city}, Ethiopia. Phone: ${FIRM.phone}. Email: ${FIRM.email}.

Services offered:
${SERVICES.map(s => `- ${s.title}: ${s.shortDesc}. Starting from ${s.priceFrom}. Duration: ${s.duration}.`).join('\n')}

Your role is to:
1. Answer questions about audit services, pricing, timelines, and processes
2. Explain IFRS, Ethiopian tax (ERCA), and compliance requirements in simple terms
3. Help visitors understand which service they need
4. Encourage booking a free consultation for specific advice
5. Be warm, professional, and concise

Always direct complex legal/tax questions to booking a consultation. Never give definitive legal or tax advice.`

const QUICK_PROMPTS = [
  'What services do you offer?',
  'How much does a statutory audit cost?',
  'What is IFRS and do I need it?',
  'How long does an audit take?',
  'Book a consultation',
]

async function callClaude(messages: { role: string; content: string }[]): Promise<string> {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: SYSTEM_CONTEXT,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }),
    })
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    return data.content?.[0]?.text || 'Sorry, I could not get a response. Please try again.'
  } catch {
    return `Thank you for your message. Our team at ${FIRM.name} will get back to you shortly. For urgent inquiries, please call us at ${FIRM.phone} or email ${FIRM.email}.`
  }
}

function TypingIndicator() {
  return (
    <div className="flex gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm w-fit" style={{ background: 'var(--surface-2)' }}>
      {[0,1,2].map(i => (
        <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--text-muted)', animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  )
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    { id: 'welcome', role: 'assistant', content: `Hi! I am the AI assistant for **${FIRM.name}**. I can help you with questions about our audit services, IFRS, Ethiopian tax regulations, or booking a consultation. How can I help you today?`, time: new Date().toISOString() }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100) }
  }, [open])

  useEffect(() => {
    if (open && !minimized) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open, minimized])

  const send = async (text?: string) => {
    const content = (text || input).trim()
    if (!content || loading) return
    setInput('')
    const userMsg: Msg = { id: Date.now().toString(), role: 'user', content, time: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
    const reply = await callClaude(history)
    setMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: 'assistant', content: reply, time: new Date().toISOString() }])
    setLoading(false)
    if (!open) setUnread(n => n + 1)
  }

  const renderContent = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n/g, '<br/>')
  }

  return (
    <>
      {/* Bubble */}
      {!open && (
        <button onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center gradient-brand hover:scale-110 active:scale-95 transition-all"
          aria-label="Open chat">
          <MessageSquare size={22} className="text-white" />
          {unread > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold text-white">{unread}</span>}
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className={cn('fixed right-6 z-50 flex flex-col shadow-2xl rounded-2xl overflow-hidden border transition-all duration-300', minimized ? 'bottom-6 w-72 h-14' : 'bottom-6 w-80 sm:w-96 h-[560px]')}
          style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 gradient-brand">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <Sparkles size={15} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white leading-none">{FIRM.name} Assistant</div>
                <div className="text-xs mt-0.5 flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Online · Powered by AI
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setMinimized(!minimized)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/15 transition-colors">
                {minimized ? <Maximize2 size={14} className="text-white" /> : <Minimize2 size={14} className="text-white" />}
              </button>
              <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/15 transition-colors">
                <X size={14} className="text-white" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ background: 'var(--surface-1)' }}>
                {messages.map(msg => (
                  <div key={msg.id} className={cn('flex gap-2', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot size={13} className="text-white" />
                      </div>
                    )}
                    <div className={cn('flex flex-col gap-0.5 max-w-[80%]', msg.role === 'user' && 'items-end')}>
                      <div className={cn('px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                        msg.role === 'user' ? 'rounded-tr-sm text-white' : 'rounded-tl-sm')}
                        style={msg.role === 'user'
                          ? { background: 'var(--brand-600)', color: 'white' }
                          : { background: 'var(--surface-0)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                        dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }} />
                      <span className="text-xs px-1" style={{ color: 'var(--text-muted)' }}>{formatRelativeTime(msg.time)}</span>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center flex-shrink-0"><Bot size={13} className="text-white" /></div>
                    <TypingIndicator />
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick prompts */}
              {messages.length <= 1 && (
                <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t" style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}>
                  {QUICK_PROMPTS.map(p => (
                    <button key={p} onClick={() => send(p)}
                      className="text-xs px-2.5 py-1.5 rounded-full border transition-colors hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="px-3 py-3 border-t flex items-center gap-2 flex-shrink-0" style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}>
                <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                  placeholder="Ask about our services..."
                  className="flex-1 text-sm px-3 py-2 rounded-xl outline-none transition-all" disabled={loading}
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                <button onClick={() => send()} disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 flex-shrink-0"
                  style={{ background: 'var(--brand-600)' }}>
                  <Send size={15} className="text-white" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
