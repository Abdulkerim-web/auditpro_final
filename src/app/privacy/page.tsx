import PublicNav from '@/components/public/PublicNav'
import PublicFooter from '@/components/public/PublicFooter'
import { FIRM } from '@/lib/data'

export const metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <>
      <PublicNav />
      <main className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>Privacy Policy</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>Last updated: January 2024</p>
          <div className="card p-8 flex flex-col gap-6 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {[
              ['Data We Collect', `We collect information you provide when contacting us or using our client portal, including name, email, phone number, company name, and financial documents shared for audit purposes.`],
              ['How We Use Your Data', `Your data is used solely to deliver audit and assurance services, communicate with you about engagements, issue invoices, and comply with our professional obligations under Ethiopian law and ICPAE standards.`],
              ['Data Security', `All data is encrypted in transit (TLS 1.3) and at rest. Our client portal uses role-based access control so only authorised personnel can access your documents. We maintain an audit log of all access.`],
              ['Data Retention', `Client engagement data is retained for 7 years in accordance with Ethiopian accounting and professional standards requirements. You may request deletion of non-mandatory data at any time.`],
              ['Your Rights', `You have the right to access, correct, or request deletion of your personal data. Contact us at ${FIRM.email} to exercise these rights.`],
              ['Contact Us', `For privacy inquiries: ${FIRM.name}, ${FIRM.address}, ${FIRM.city}. Email: ${FIRM.email}. Phone: ${FIRM.phone}.`],
            ].map(([title, body]) => (
              <div key={title as string}>
                <h2 className="font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>{title as string}</h2>
                <p>{body as string}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  )
}
