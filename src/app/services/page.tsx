import PublicNav from '@/components/public/PublicNav'
import AIChatbot from '@/components/AIChatbot'
import PublicFooter from '@/components/public/PublicFooter'
import Link from 'next/link'
import { FileSearch, Shield, Calculator, Microscope, ClipboardCheck, FileText, ArrowRight, Clock, DollarSign, Users } from 'lucide-react'
import { SERVICES } from '@/lib/data'

export const metadata = { title: 'Services' }
const iconMap: Record<string, React.ElementType> = { FileSearch, Shield, Calculator, Microscope, ClipboardCheck, FileText }

export default function ServicesPage() {
  return (
    <>
      <PublicNav />
      <main>
        <section className="pt-32 pb-16 gradient-brand relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <span className="inline-flex px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}>Our Services</span>
            <h1 className="text-5xl font-extrabold text-white mb-5" style={{ letterSpacing: '-0.02em' }}>Comprehensive Audit Services</h1>
            <p className="text-xl" style={{ color: 'rgba(255,255,255,0.78)' }}>Every engagement led by a certified professional with deep Ethiopian regulatory expertise.</p>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6 flex flex-col gap-8">
            {SERVICES.map((svc, i) => {
              const Icon = iconMap[svc.icon] || FileText
              return (
                <div key={svc.id} id={svc.slug} className="card p-8 grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--brand-50)' }}>
                        <Icon size={22} style={{ color: 'var(--brand-600)' }} />
                      </div>
                      <h2 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{svc.title}</h2>
                    </div>
                    <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>{svc.desc}</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {svc.features.map(f => (
                        <div key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--brand-400)' }} />{f}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="rounded-xl p-4" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-2 mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}><DollarSign size={12} />Starting from</div>
                      <div className="text-xl font-extrabold" style={{ color: 'var(--brand-600)' }}>{svc.priceFrom}</div>
                    </div>
                    <div className="rounded-xl p-4" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-2 mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}><Clock size={12} />Typical duration</div>
                      <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{svc.duration}</div>
                    </div>
                    <div className="rounded-xl p-4" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-2 mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}><Users size={12} />Best for</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{svc.forWho}</div>
                    </div>
                    <Link href="/contact" className="btn-primary text-center text-sm flex items-center justify-center gap-2">
                      Request this service <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>
      <PublicFooter />
      <AIChatbot />
    </>
  )
}
