import PublicNav from '@/components/public/PublicNav'
import AIChatbot from '@/components/AIChatbot'
import PublicFooter from '@/components/public/PublicFooter'
import { CheckCircle2, Award, Users, Clock, Scale } from 'lucide-react'
import { FIRM, AUDITOR } from '@/lib/data'

export const metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <>
      <PublicNav />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 gradient-brand relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 0%, transparent 60%)' }} />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}>About Us</span>
            <h1 className="text-5xl font-extrabold text-white mb-6" style={{ letterSpacing: '-0.02em' }}>{FIRM.fullName}</h1>
            <p className="text-xl" style={{ color: 'rgba(255,255,255,0.78)' }}>Independent audit and assurance services built on integrity, expertise, and transparency — serving Ethiopian businesses since {FIRM.established}.</p>
          </div>
        </section>

        {/* Story */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border" style={{ background: 'var(--brand-50)', borderColor: 'var(--brand-100)', color: 'var(--brand-600)' }}>Our Story</span>
              <h2 className="text-4xl font-extrabold mb-6" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Who We Are</h2>
              <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>{FIRM.name} is an independent audit and assurance practice founded in {FIRM.established} in Addis Ababa. We serve a diverse portfolio of clients — from growing SMEs to listed companies, NGOs, and financial institutions — across Ethiopia and East Africa.</p>
              <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>Our approach combines rigorous professional methodology with a genuine commitment to helping our clients understand their finances, manage their risks, and improve their governance. We believe that audit should be a value-adding experience, not just a compliance exercise.</p>
              <div className="flex flex-col gap-3">
                {['ICPAE Licensed Practitioner', 'IFRS Specialist Certification', 'CIA — Certified Internal Auditor', 'NBE Approved Auditor'].map(c => (
                  <div key={c} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                    <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0" />{c}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: 'Clients Served', value: '120+', color: 'var(--brand-600)', bg: 'var(--brand-50)' },
                { icon: Clock, label: 'Years Experience', value: '15+', color: '#d97706', bg: '#fffbeb' },
                { icon: Award, label: 'Audits Done', value: '500+', color: '#059669', bg: '#ecfdf5' },
                { icon: Scale, label: 'Retention Rate', value: '98%', color: '#7c3aed', bg: '#f5f3ff' },
              ].map(s => (
                <div key={s.label} className="card p-6 text-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: s.bg }}>
                    <s.icon size={22} style={{ color: s.color }} />
                  </div>
                  <div className="text-3xl font-extrabold mb-1" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Credentials */}
        <section className="py-20 border-t" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-extrabold mb-12" style={{ color: 'var(--text-primary)' }}>Professional Credentials</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { title: 'ICPAE Member', body: 'Full member of the Institute of Certified Public Accountants of Ethiopia. License No. ' + FIRM.license },
                { title: 'IFRS Certified', body: 'Specialist certification in International Financial Reporting Standards — current and up to date.' },
                { title: 'NBE Approved', body: 'Approved by the National Bank of Ethiopia to conduct audits for financial institutions and regulated entities.' },
              ].map(c => (
                <div key={c.title} className="card p-6 text-left">
                  <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center mb-4">
                    <Award size={18} className="text-white" />
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{c.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
      <AIChatbot />
    </>
  )
}
