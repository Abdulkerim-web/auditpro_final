'use client'
import { useState } from 'react'
import PublicNav from '@/components/public/PublicNav'
import AIChatbot from '@/components/AIChatbot'
import PublicFooter from '@/components/public/PublicFooter'
import { Mail, Phone, MapPin, Clock, CircleCheck as CheckCircle2, Send } from 'lucide-react'
import { FIRM, SERVICES } from '@/lib/data'
import { submitContactForm } from '@/lib/db'

const services = SERVICES.map(s => s.title)

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: '', message: '' })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await submitContactForm({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        company: form.company || undefined,
        service_interest: form.service || undefined,
        message: form.message,
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Contact form submission failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const contacts = [
    { icon: MapPin, title: 'Office', lines: [FIRM.address, `${FIRM.city}, ${FIRM.country}`] },
    { icon: Phone, title: 'Phone', lines: [FIRM.phone, FIRM.phone2] },
    { icon: Mail, title: 'Email', lines: [FIRM.email, FIRM.support] },
    { icon: Clock, title: 'Office Hours', lines: ['Mon–Fri: 8:00am – 5:30pm', 'Sat: 9:00am – 1:00pm'] },
  ]

  return (
    <>
      <PublicNav />
      <main className="min-h-screen" style={{ background: 'var(--surface-1)' }}>
        <section className="pt-32 pb-16 gradient-brand">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <span className="inline-flex px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}>Get In Touch</span>
            <h1 className="text-5xl font-extrabold text-white mb-5" style={{ letterSpacing: '-0.02em' }}>Book a Free Consultation</h1>
            <p className="text-xl" style={{ color: 'rgba(255,255,255,0.78)' }}>Tell us about your business and what you need. We respond within one business day.</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="flex flex-col gap-4">
              {contacts.map(c => (
                <div key={c.title} className="card p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--brand-50)' }}>
                    <c.icon size={18} style={{ color: 'var(--brand-600)' }} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{c.title}</div>
                    {c.lines.map((l, i) => (
                      <div key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {c.title === 'Phone' ? <a href={`tel:${l.replace(/\s/g,'')}`} className="hover:underline">{l}</a>
                          : c.title === 'Email' ? <a href={`mailto:${l}`} className="hover:underline">{l}</a>
                          : l}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Map embed placeholder */}
              <div className="card overflow-hidden">
                <div className="h-48 flex items-center justify-center" style={{ background: 'var(--brand-50)' }}>
                  <div className="text-center">
                    <MapPin size={32} style={{ color: 'var(--brand-300)', margin: '0 auto 8px' }} />
                    <div className="text-sm font-medium" style={{ color: 'var(--brand-600)' }}>Piasa, Kalifa Building</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Addis Ababa, Ethiopia</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 card p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: '#ecfdf5' }}>
                    <CheckCircle2 size={32} className="text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold mb-3" style={{ color: 'var(--text-primary)' }}>Message Sent!</h3>
                  <p className="text-base max-w-sm" style={{ color: 'var(--text-secondary)' }}>
                    Thank you, {form.name}. We will be in touch within one business day.
                  </p>
                  <button onClick={() => { setSubmitted(false); setForm({ name:'',email:'',phone:'',company:'',service:'',message:'' }) }}
                    className="btn-secondary mt-6 text-sm">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>Send us a message</h2>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Full name *</label>
                      <input required value={form.name} onChange={e => set('name', e.target.value)} className="input-field" placeholder="Abebe Kebede" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Email address *</label>
                      <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} className="input-field" placeholder="abebe@company.et" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Phone number</label>
                      <input value={form.phone} onChange={e => set('phone', e.target.value)} className="input-field" placeholder="+251 9xx xxx xxx" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Company name</label>
                      <input value={form.company} onChange={e => set('company', e.target.value)} className="input-field" placeholder="Your company PLC" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Service of interest</label>
                    <select value={form.service} onChange={e => set('service', e.target.value)} className="input-field">
                      <option value="">Select a service...</option>
                      {services.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Message *</label>
                    <textarea required value={form.message} onChange={e => set('message', e.target.value)} className="input-field resize-none" rows={5} placeholder="Tell us about your business and what you need..." />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 py-3.5 text-sm font-semibold disabled:opacity-60">
                    <Send size={15} />{loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
      <AIChatbot />
    </>
  )
}
