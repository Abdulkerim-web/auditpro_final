import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { FIRM } from '@/lib/data'

export default function CtaSection() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="rounded-3xl gradient-brand p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 75% 25%, rgba(212,160,23,0.25) 0%, transparent 55%)' }} />
          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>Ready for a More Transparent Audit?</h2>
            <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.75)' }}>Book a free 30-minute consultation. We will discuss your business, scope, and give you a clear proposal — no obligations.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all hover:shadow-xl hover:scale-105" style={{ background: 'var(--gold-500)', color: 'white' }}>
                Book Free Consultation <ArrowRight size={16} />
              </Link>
              <a href={`tel:${FIRM.phone.replace(/\s/g,'')}`} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm border transition-all hover:bg-white/15" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', background: 'rgba(255,255,255,0.08)' }}>
                <Phone size={15} /> {FIRM.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
