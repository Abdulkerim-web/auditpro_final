import Link from 'next/link'
import { Scale, Mail, Phone, MapPin } from 'lucide-react'
import { FIRM } from '@/lib/data'

export default function PublicFooter() {
  return (
    <footer style={{ background: 'var(--brand-900)', color: 'rgba(255,255,255,0.65)' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-600)' }}>
                <Scale size={15} className="text-white" />
              </div>
              <span className="font-bold text-lg text-white">{FIRM.name}</span>
            </div>
            <p className="text-sm leading-relaxed mb-5">Independent audit and assurance services for Ethiopian businesses. ICPAE member. IFRS certified.</p>
            <div className="text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              ICPAE {FIRM.license}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Services</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              {[['Statutory Audit', '/services#statutory-audit'], ['Internal Audit', '/services#internal-audit'], ['Tax Audit', '/services#tax-audit'], ['Forensic Audit', '/services#forensic-audit'], ['Compliance Review', '/services#compliance-review']].map(([l, h]) => (
                <li key={l}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Company</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              {[['About', '/about'], ['Insights', '/blog'], ['Contact', '/contact'], ['Client Portal', '/client-portal'], ['Privacy Policy', '/privacy']].map(([l, h]) => (
                <li key={l}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--gold-400)' }} />
                <span>{FIRM.address}<br />{FIRM.city}, {FIRM.country}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} style={{ color: 'var(--gold-400)' }} />
                <a href={`tel:${FIRM.phone.replace(/\s/g,'')}`} className="hover:text-white">{FIRM.phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} style={{ color: 'var(--gold-400)' }} />
                <a href={`mailto:${FIRM.email}`} className="hover:text-white">{FIRM.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <span>© {new Date().getFullYear()} {FIRM.fullName}. All rights reserved.</span>
          <span>Registered in Ethiopia · {FIRM.city}</span>
        </div>
      </div>
    </footer>
  )
}
