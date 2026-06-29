import { Star, Quote } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/data'

export default function TestimonialsSection() {
  return (
    <section className="py-24" style={{ background: 'var(--surface-1)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border" style={{ background: 'var(--gold-100)', borderColor: '#fde68a', color: '#92400e' }}>Client Feedback</span>
          <h2 className="text-4xl font-extrabold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>What Our Clients Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="card p-7 flex flex-col">
              <div className="flex gap-1 mb-4">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}</div>
              <Quote size={22} className="mb-3 opacity-15" style={{ color: 'var(--brand-600)' }} />
              <p className="text-sm leading-relaxed flex-1 mb-5 italic" style={{ color: 'var(--text-secondary)' }}>"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold">{t.name.split(' ').map(n => n[0]).join('')}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{t.name}</div>
                  <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{t.role}, {t.company}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full flex-shrink-0" style={{ background: 'var(--brand-50)', color: 'var(--brand-600)' }}>{t.industry}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
