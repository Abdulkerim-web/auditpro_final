import Link from 'next/link'
import { FileSearch, Shield, Calculator, Microscope, ClipboardCheck, FileText, ArrowRight } from 'lucide-react'
import { SERVICES } from '@/lib/data'

const iconMap: Record<string, React.ElementType> = { FileSearch, Shield, Calculator, Microscope, ClipboardCheck, FileText }

export default function ServicesSection() {
  return (
    <section id="services" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border" style={{ background: 'var(--brand-50)', borderColor: 'var(--brand-100)', color: 'var(--brand-600)' }}>What We Offer</span>
          <h2 className="text-4xl font-extrabold mb-4" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Comprehensive Audit Services</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>From statutory compliance to forensic investigation — every engagement led by a certified professional with deep local expertise.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(svc => {
            const Icon = iconMap[svc.icon] || FileText
            return (
              <Link key={svc.id} href={`/services#${svc.slug}`} className="card card-hover p-6 flex flex-col group">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors" style={{ background: 'var(--brand-50)' }}>
                  <Icon size={20} style={{ color: 'var(--brand-600)' }} />
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>{svc.title}</h3>
                <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-secondary)' }}>{svc.shortDesc}</p>
                <div className="flex flex-col gap-1.5 mb-4">
                  {svc.features.slice(0, 3).map(f => (
                    <span key={f} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--brand-400)' }} />{f}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>From {svc.priceFrom}</span>
                  <span className="flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all" style={{ color: 'var(--brand-600)' }}>Learn more <ArrowRight size={12} /></span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
