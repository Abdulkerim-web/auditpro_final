'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Scale, Eye, EyeOff, Lock, Mail, CircleAlert as AlertCircle, Shield, CircleCheck as CheckCircle } from 'lucide-react'
import { FIRM } from '@/lib/data'
import { supabase } from '@/lib/supabase'
import { fetchProfile } from '@/lib/db'
import { cn } from '@/utils'

const DEMO_CREDS = [
  { label: 'Admin', email: 'admin@beyanomer.et', password: 'admin2024', role: 'admin' },
  { label: 'Auditor (you)', email: 'beyan@beyanomer.et', password: 'audit2024', role: 'auditor' },
  { label: 'Client demo', email: 'client@ethiotrading.et', password: 'client2024', role: 'client' },
]

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    if (signInError || !data.user) {
      setError('Invalid email or password. Try a demo account below.')
      setLoading(false); return
    }
    // Fetch profile to determine role-based redirect
    try {
      const profile = await fetchProfile(data.user.id)
      const role = profile?.role || 'client'
      const dest = redirect || (role === 'client' ? '/client-portal' : '/dashboard')
      router.push(dest)
    } catch {
      router.push(redirect || '/dashboard')
    }
  }

  const fillDemo = (email: string, pw: string) => { setEmail(email); setPassword(pw); setError('') }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-brand flex-col justify-between p-12 relative overflow-hidden">
        {/* 3D orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="orb absolute w-96 h-96 -top-20 -left-20 opacity-20" style={{ background: 'radial-gradient(circle,#3b82f6,transparent)' }} />
          <div className="orb orb-2 absolute w-64 h-64 bottom-20 right-10 opacity-15" style={{ background: 'radial-gradient(circle,#d4a017,transparent)' }} />
          <div className="orb orb-3 absolute w-48 h-48 top-1/2 left-1/2 opacity-10" style={{ background: 'radial-gradient(circle,#10b981,transparent)' }} />
          {/* Rotating ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5 animate-spin-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-white/8" style={{ animation: 'spin-slow 14s linear infinite reverse' }} />
        </div>

        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur border border-white/10">
            <Scale size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl text-white">{FIRM.name}</span>
        </Link>

        <div className="relative z-10 animate-fade-in">
          <div className="text-5xl mb-6" style={{ color: 'var(--gold-400)' }}>"</div>
          <blockquote className="text-white/90 text-2xl font-light leading-relaxed mb-6">
            Financial clarity is not just compliance — it is the foundation of every sound business decision.
          </blockquote>
          <div className="text-white/50 text-sm">— {FIRM.name}, Est. {FIRM.established}</div>
        </div>

        <div className="flex gap-10 relative z-10">
          {[['120+','Clients'],['500+','Audits'],['15yr','Experience']].map(([v,l]) => (
            <div key={l}>
              <div className="text-3xl font-extrabold text-white">{v}</div>
              <div className="text-white/50 text-sm">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12" style={{ background: 'var(--surface-1)' }}>
        <div className="w-full max-w-md animate-scale-in">
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center"><Scale size={15} className="text-white" /></div>
            <span className="font-bold text-lg">{FIRM.name}</span>
          </Link>

          <div className="card p-8">
            <div className="mb-7">
              <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>Welcome back</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sign in to your {FIRM.name} account</p>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl mb-5 text-sm animate-scale-in"
                style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />{error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Email address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@company.et" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="input-field pl-10 pr-10" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <div className="text-right mt-1.5">
                  <Link href="/auth/forgot-password" className="text-xs hover:underline" style={{ color: 'var(--brand-600)' }}>Forgot password?</Link>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary py-3 mt-1 font-semibold disabled:opacity-60 w-full">
                {loading ? <span className="flex items-center gap-2 justify-center"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</span> : 'Sign in'}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Demo accounts</p>
              <div className="flex flex-col gap-2">
                {DEMO_CREDS.map(d => (
                  <button key={d.email} onClick={() => fillDemo(d.email, d.password)}
                    className={cn('flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:border-blue-300 hover:bg-blue-50',
                      email === d.email ? 'border-blue-400 bg-blue-50' : '')}
                    style={{ borderColor: 'var(--border)' }}>
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0', d.role === 'auditor' ? 'gradient-brand' : d.role === 'admin' ? 'bg-gray-900' : 'bg-amber-500')}>
                      {d.role === 'auditor' ? 'BO' : d.role === 'admin' ? 'AD' : 'AG'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{d.label}</div>
                      <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{d.email}</div>
                    </div>
                    {email === d.email && <CheckCircle size={15} className="text-blue-600 ml-auto flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Shield size={11} />256-bit SSL encrypted · Role-based access control
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
