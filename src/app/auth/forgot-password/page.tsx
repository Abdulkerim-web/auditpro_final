'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Scale, Mail, ArrowLeft, CircleCheck as CheckCircle2 } from 'lucide-react'
import { FIRM } from '@/lib/data'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setSent(true); setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--surface-1)' }}>
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center">
            <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center"><Scale size={18} className="text-white" /></div>
            <span className="font-bold text-xl">{FIRM.name}</span>
          </Link>
        </div>
        <div className="card p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={30} className="text-green-600" /></div>
              <h2 className="text-xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>Check your email</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>We sent a password reset link to <strong>{email}</strong>. Check your inbox.</p>
              <Link href="/auth/login" className="btn-primary w-full justify-center">Back to Sign in</Link>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                <ArrowLeft size={14} />Back to Sign in
              </Link>
              <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>Reset password</h1>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Enter your email and we will send you a reset link.</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Email address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@company.et" required />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary py-3 w-full disabled:opacity-60">
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
