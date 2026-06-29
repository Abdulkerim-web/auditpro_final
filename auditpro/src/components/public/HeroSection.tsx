'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Star, Scale, TrendingUp, Shield, Users, Award } from 'lucide-react'
import { FIRM, CLIENTS, ENGAGEMENTS } from '@/lib/data'
import { cn } from '@/utils'

const trust = ['ICPAE Licensed', 'IFRS Certified', '15+ Years Experience', 'NBE Approved']

const floatingCards = [
  { icon: TrendingUp, label: 'Revenue YTD', value: 'ETB 1.25M', sub: '+18% vs last year', color: '#10b981', top: '15%', right: '-5%', delay: '0s' },
  { icon: Users, label: 'Active Clients', value: '24', sub: 'Across Ethiopia', color: '#2563eb', top: '60%', right: '-8%', delay: '0.3s' },
  { icon: Shield, label: 'Audits Completed', value: '500+', sub: 'IFRS compliant', color: '#7c3aed', top: '38%', left: '-8%', delay: '0.6s' },
]

const recentActivity = [
  { company: 'Ethio Trading PLC', action: 'Fieldwork started', time: '2h ago', progress: 65 },
  { company: 'Abyssinia Hotels', action: 'Report under review', time: '1d ago', progress: 82 },
  { company: 'Nile Construction', action: 'Planning complete', time: '2d ago', progress: 20 },
]

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)

  useEffect(() => {
    setMounted(true)
    const handleMouse = (e: MouseEvent) => {
      setMouseX((e.clientX / window.innerWidth - 0.5) * 10)
      setMouseY((e.clientY / window.innerHeight - 0.5) * 10)
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-brand" />

      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="orb absolute w-[600px] h-[600px] -top-32 -left-32 opacity-25"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
        <div className="orb orb-2 absolute w-[400px] h-[400px] bottom-10 right-10 opacity-20"
          style={{ background: 'radial-gradient(circle, #d4a017 0%, transparent 70%)' }} />
        <div className="orb orb-3 absolute w-[300px] h-[300px] top-1/2 left-1/3 opacity-15"
          style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }} />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }} />

        {/* Rotating rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/5 animate-spin-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5"
          style={{ animation: 'spin-slow 15s linear infinite reverse' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-white/8 animate-spin-slow" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8 border animate-fade-in"
              style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.95)' }}>
              <Star size={11} className="fill-yellow-400 text-yellow-400" />
              Trusted by 120+ Companies Across Ethiopia
            </div>

            <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-2 text-white animate-fade-in delay-100" style={{ letterSpacing: '-0.03em' }}>
              {FIRM.name}
            </h1>
            <h2 className="text-3xl lg:text-4xl font-light mb-6 animate-fade-in delay-200" style={{ color: 'var(--gold-400)', letterSpacing: '-0.01em' }}>
              Audit with Clarity & Confidence
            </h2>

            <p className="text-lg leading-relaxed mb-8 animate-fade-in delay-300" style={{ color: 'rgba(255,255,255,0.78)' }}>
              Independent audit and assurance services built for Ethiopian businesses.
              IFRS-compliant reporting, rigorous methodology, and a secure digital client
              portal — all in one professional platform.
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-10 animate-fade-in delay-300">
              {trust.map(t => (
                <span key={t} className="flex items-center gap-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  <CheckCircle2 size={13} className="text-green-400 flex-shrink-0" />{t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 animate-fade-in delay-400">
              <Link href="/contact"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all hover:shadow-2xl hover:scale-105 active:scale-95"
                style={{ background: 'var(--gold-500)', color: 'white' }}>
                Book Free Consultation
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/auth/login"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm border transition-all hover:bg-white/15 hover:border-white/50"
                style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', background: 'rgba(255,255,255,0.08)' }}>
                Client Portal Login
              </Link>
            </div>
          </div>

          {/* Right — 3D Dashboard preview */}
          <div className="hidden lg:block relative perspective animate-fade-in-right delay-300">
            {/* Floating stat cards */}
            {mounted && floatingCards.map((card, i) => (
              <div key={i} className="absolute z-20 animate-fade-in"
                style={{
                  top: card.top, right: card.right, left: card.left,
                  animationDelay: card.delay,
                  transform: `translateX(${mouseX * 0.3}px) translateY(${mouseY * 0.3}px)`,
                  transition: 'transform 0.1s ease-out'
                }}>
                <div className="glass rounded-xl p-3 shadow-xl border border-white/20 backdrop-blur-xl min-w-[130px]"
                  style={{ transform: `perspective(800px) rotateX(${mouseY * 0.5}deg) rotateY(${mouseX * -0.5}deg)` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: card.color + '20' }}>
                      <card.icon size={13} style={{ color: card.color }} />
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{card.label}</span>
                  </div>
                  <div className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>{card.value}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{card.sub}</div>
                </div>
              </div>
            ))}

            {/* Main dashboard card */}
            <div className="relative"
              style={{
                transform: mounted ? `perspective(1200px) rotateX(${mouseY * -0.4}deg) rotateY(${mouseX * 0.4}deg) translateZ(0)` : 'none',
                transition: 'transform 0.1s ease-out'
              }}>
              <div className="rounded-2xl overflow-hidden shadow-2xl border"
                style={{ background: 'var(--surface-0)', borderColor: 'rgba(255,255,255,0.15)' }}>
                {/* Window chrome */}
                <div className="px-4 py-3 border-b flex items-center gap-2"
                  style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg text-xs" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                      <Scale size={11} />
                      beyanomer.et/dashboard
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {/* Stat mini row */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { l: 'Clients', v: '24', c: '#2563eb', bg: '#eff6ff' },
                      { l: 'Engagements', v: '8', c: '#d97706', bg: '#fffbeb' },
                      { l: 'YTD Revenue', v: '1.2M', c: '#059669', bg: '#ecfdf5' },
                    ].map(s => (
                      <div key={s.l} className="rounded-xl p-3 text-center" style={{ background: s.bg }}>
                        <div className="text-xl font-extrabold" style={{ color: s.c }}>{s.v}</div>
                        <div className="text-xs mt-0.5" style={{ color: s.c + '99' }}>{s.l}</div>
                      </div>
                    ))}
                  </div>

                  {/* Engagement list */}
                  <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                    <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider"
                      style={{ background: 'var(--surface-1)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                      Live Engagements
                    </div>
                    {recentActivity.map((r, i) => (
                      <div key={i} className="px-3 py-2.5 border-b last:border-0 flex items-center gap-3"
                        style={{ borderColor: 'var(--border)' }}>
                        <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {r.company[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{r.company}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                              <div className="h-full rounded-full" style={{ width: `${r.progress}%`, background: '#2563eb' }} />
                            </div>
                            <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{r.progress}%</span>
                          </div>
                        </div>
                        <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{r.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '80px' }}>
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
