export const FIRM = {
  name: 'Beyan Omer',
  fullName: 'Beyan Omer Independent Audit & Assurance',
  tagline: 'Audit with Clarity & Confidence',
  license: 'AU-2024-0042',
  icpae: 'ICPAE-ET-2009-0042',
  tin: '0123456789',
  phone: '+251 911 734 096',
  phone2: '+251 116 000 000',
  email: 'info@beyanomer.et',
  support: 'support@beyanomer.et',
  address: 'Piasa, Kalifa Building',
  city: 'Addis Ababa',
  country: 'Ethiopia',
  established: 2009,
  linkedin: 'https://linkedin.com',
  twitter: 'https://twitter.com',
}

export const AUDITOR = {
  id: 'aud-001',
  name: 'Beyan Omer',
  title: 'CPA, Lead Auditor',
  email: 'beyan@beyanomer.et',
  initials: 'BO',
  license: 'AU-2024-0042',
  experience: 15,
  certifications: ['CPA', 'IFRS Specialist', 'CIA'],
}

export const SERVICES = [
  { id: 'statutory-audit', slug: 'statutory-audit', icon: 'FileSearch', title: 'Statutory Audit', shortDesc: 'Full IFRS-compliant external audit of financial statements', desc: 'A thorough, independent examination of your financial statements conducted in accordance with ISAs and Ethiopian Financial Reporting Standards.', features: ['IFRS/GAAP compliant', 'Regulatory submission ready', 'Management letter included', 'Board presentation available'], priceFrom: 'ETB 25,000', duration: '4–8 weeks', forWho: 'All companies above the audit threshold per Ethiopian Commercial Code' },
  { id: 'internal-audit', slug: 'internal-audit', icon: 'Shield', title: 'Internal Audit', shortDesc: 'Independent evaluation of controls, risk & governance', desc: 'We provide an objective, independent assessment of your internal control environment, risk management framework, and governance processes.', features: ['Risk-based approach', 'Control testing', 'Process improvement roadmap', 'Follow-up review included'], priceFrom: 'ETB 18,000', duration: '2–6 weeks', forWho: 'Medium and large organisations, NGOs, financial institutions' },
  { id: 'tax-audit', slug: 'tax-audit', icon: 'Calculator', title: 'Tax Audit & Advisory', shortDesc: 'ERCA compliance review, VAT, and income tax assurance', desc: 'Comprehensive tax compliance review aligned with Ethiopian Revenue and Customs Authority requirements.', features: ['ERCA compliance', 'VAT review', 'Corporate income tax', 'Transfer pricing review'], priceFrom: 'ETB 15,000', duration: '2–4 weeks', forWho: 'All registered businesses with ERCA filing obligations' },
  { id: 'forensic-audit', slug: 'forensic-audit', icon: 'Microscope', title: 'Forensic Audit', shortDesc: 'Fraud detection and investigation with court-admissible documentation', desc: 'When you suspect fraud or financial irregularity, our forensic audit team conducts a rigorous, evidence-based investigation.', features: ['Fraud detection & prevention', 'Legal-grade documentation', 'Litigation support', 'Digital forensics'], priceFrom: 'ETB 50,000', duration: '4–16 weeks', forWho: 'Companies suspecting fraud, boards investigating irregularities' },
  { id: 'compliance-review', slug: 'compliance-review', icon: 'ClipboardCheck', title: 'Compliance Review', shortDesc: 'Regulatory, sector-specific and grant compliance assurance', desc: 'We systematically examine your compliance with applicable regulations, donor grant conditions, and internal policies.', features: ['Regulatory mapping', 'Gap analysis report', 'Remediation roadmap', 'Regulatory filing support'], priceFrom: 'ETB 12,000', duration: '2–3 weeks', forWho: 'NGOs with donor funding, regulated industries, government contractors' },
  { id: 'agreed-upon-procedures', slug: 'agreed-upon-procedures', icon: 'FileText', title: 'Agreed-Upon Procedures', shortDesc: 'Targeted factual findings on specific financial information', desc: 'When a full audit is not required but a third party needs independent verification of specific information.', features: ['Flexible scope', 'Quick turnaround', 'Third-party ready output', 'Cost-effective'], priceFrom: 'ETB 8,000', duration: '1–3 weeks', forWho: 'M&A due diligence, lender requirements, specific regulatory checks' },
]

export const CLIENTS = [
  { id: 'cli-001', company_name: 'Ethio Trading PLC', trade_name: 'ETP', industry: 'retail', status: 'active', city: 'Addis Ababa', tin_number: 'TIN-1234567', fiscal_year_end: '2023-12-31', primary_contact_name: 'Abebe Girma', primary_contact_email: 'a.girma@ethiotrading.et', primary_contact_phone: '+251 911 111 111', tags: ['Priority', 'IFRS', 'Annual'], engagements_count: 3, country: "Ethiopia", notes: "Long-standing client since 2015. Requires IFRS compliant statutory audit annually." },
  { id: 'cli-002', company_name: 'Abyssinia Hotels Group', trade_name: 'AHG', industry: 'hospitality', status: 'active', city: 'Addis Ababa', tin_number: 'TIN-2345678', fiscal_year_end: '2023-09-30', primary_contact_name: 'Hana Tesfaye', primary_contact_email: 'hana@abyssiniahotels.et', primary_contact_phone: '+251 911 222 222', tags: ['Large'], engagements_count: 2, country: "Ethiopia", notes: "Multiple hotel properties. Q4 internal audit plus annual statutory." },
  { id: 'cli-003', company_name: 'Nile Construction Ltd', trade_name: 'NCL', industry: 'real_estate', status: 'active', city: 'Hawassa', tin_number: 'TIN-3456789', fiscal_year_end: '2023-07-07', primary_contact_name: 'Dawit Tadesse', primary_contact_email: 'd.tadesse@nileconstruction.et', primary_contact_phone: '+251 912 333 333', tags: ['Regional'], engagements_count: 1, country: "Ethiopia", notes: "Construction company in Hawassa. Complex revenue recognition issues." },
  { id: 'cli-004', company_name: 'East Africa Dev Fund', trade_name: 'EADF', industry: 'ngo', status: 'active', city: 'Addis Ababa', tin_number: 'TIN-4567890', fiscal_year_end: '2023-12-31', primary_contact_name: 'Dr. Samuel Bekele', primary_contact_email: 's.bekele@eadf.org', primary_contact_phone: '+251 911 444 444', tags: ['Donor Funded', 'Priority'], engagements_count: 2, country: "Ethiopia", notes: "Donor-funded NGO. Compliance with EU and USAID grant requirements." },
  { id: 'cli-005', company_name: 'Habesha Breweries SC', trade_name: 'HBS', industry: 'manufacturing', status: 'active', city: 'Addis Ababa', tin_number: 'TIN-5678901', fiscal_year_end: '2023-12-31', primary_contact_name: 'Yohannes Alemu', primary_contact_email: 'y.alemu@habesha.et', primary_contact_phone: '+251 911 555 555', tags: ['Annual', 'Listed'], engagements_count: 4, country: "Ethiopia", notes: "Listed company. High-volume transaction testing required." },
  { id: 'cli-006', company_name: 'Summit Bank SC', trade_name: 'SB', industry: 'financial_services', status: 'prospect', city: 'Addis Ababa', tin_number: '', fiscal_year_end: '', primary_contact_name: 'Meron Bekele', primary_contact_email: 'm.bekele@summitbank.et', primary_contact_phone: '+251 911 666 666', tags: ['Prospect', 'New'], engagements_count: 0, country: "Ethiopia", notes: "Prospective client. Initial consultation completed Jan 2024." },
]

export const ENGAGEMENTS = [
  { id: 'eng-001', client_id: 'cli-001', title: 'Statutory Audit FY2023', type: 'statutory_audit', status: 'fieldwork', period_start: '2023-01-01', period_end: '2023-12-31', planned_start: '2024-01-10', planned_end: '2024-02-28', fee_amount: 45000, fee_currency: 'ETB', billable_hours: 68, budgeted_hours: 120, progress: 65, description: 'Full statutory audit of FY2023 financial statements per IFRS and ISAs.', milestones: [{ title: 'Engagement letter signed', done: true, date: '2024-01-10' }, { title: 'Planning & risk assessment', done: true, date: '2024-01-15' }, { title: 'Interim fieldwork', done: true, date: '2024-01-25' }, { title: 'Final fieldwork', done: false, date: '2024-02-10' }, { title: 'Draft report', done: false, date: '2024-02-20' }, { title: 'Final sign-off', done: false, date: '2024-02-28' }] },
  { id: 'eng-002', client_id: 'cli-002', title: 'Internal Audit Q4 2023', type: 'internal_audit', status: 'review', period_start: '2023-10-01', period_end: '2023-12-31', planned_start: '2024-01-15', planned_end: '2024-02-15', fee_amount: 38000, fee_currency: 'ETB', billable_hours: 95, budgeted_hours: 100, progress: 82, description: 'Quarterly internal audit focusing on revenue cycle and procurement controls.', milestones: [{ title: 'Scope agreement', done: true, date: '2024-01-15' }, { title: 'Fieldwork complete', done: true, date: '2024-02-01' }, { title: 'Draft report issued', done: true, date: '2024-02-08' }, { title: 'Management responses', done: false, date: '2024-02-12' }, { title: 'Final report', done: false, date: '2024-02-15' }] },
  { id: 'eng-003', client_id: 'cli-003', title: 'Tax Compliance Review 2023', type: 'tax_audit', status: 'planning', period_start: '2023-01-01', period_end: '2023-12-31', planned_start: '2024-02-01', planned_end: '2024-03-15', fee_amount: 28000, fee_currency: 'ETB', billable_hours: 12, budgeted_hours: 80, progress: 20, description: 'Review of tax compliance including VAT, income tax and payroll taxes.', milestones: [{ title: 'Planning meeting', done: true, date: '2024-02-01' }, { title: 'Document collection', done: false, date: '2024-02-15' }, { title: 'Tax testing', done: false, date: '2024-03-01' }, { title: 'Report delivery', done: false, date: '2024-03-15' }] },
  { id: 'eng-004', client_id: 'cli-004', title: 'Annual Compliance Review', type: 'compliance_review', status: 'reporting', period_start: '2023-01-01', period_end: '2023-12-31', planned_start: '2023-12-01', planned_end: '2024-02-10', fee_amount: 32000, fee_currency: 'ETB', billable_hours: 108, budgeted_hours: 110, progress: 91, description: 'Compliance review against EU and USAID grant requirements.', milestones: [{ title: 'Scope finalised', done: true, date: '2023-12-05' }, { title: 'Fieldwork complete', done: true, date: '2024-01-20' }, { title: 'Draft report', done: true, date: '2024-02-01' }, { title: 'Final report', done: false, date: '2024-02-10' }] },
  { id: 'eng-005', client_id: 'cli-005', title: 'Agreed-Upon Procedures H2 2023', type: 'agreed_upon_procedures', status: 'completed', period_start: '2023-07-01', period_end: '2023-12-31', planned_start: '2023-11-01', planned_end: '2024-01-31', fee_amount: 18000, fee_currency: 'ETB', billable_hours: 45, budgeted_hours: 45, progress: 100, description: 'AUP engagement on semi-annual production data for lender reporting.', milestones: [{ title: 'Procedures agreed', done: true, date: '2023-11-05' }, { title: 'Fieldwork', done: true, date: '2023-12-15' }, { title: 'Report delivered', done: true, date: '2024-01-31' }] },
]

export const DOCUMENTS = [
  { id: 'doc-001', engagement_id: 'eng-001', client_id: 'cli-001', name: 'Bank Statements Jan–Dec 2023.pdf', document_type: 'bank_statement', status: 'approved', file_size: 2400000, file_type: 'pdf', uploaded_by: 'Abebe Girma', created_at: '2024-01-20', notes: 'All 3 accounts included' },
  { id: 'doc-002', engagement_id: 'eng-001', client_id: 'cli-001', name: 'Trial Balance 31 Dec 2023.xlsx', document_type: 'financial_statement', status: 'reviewed', file_size: 580000, file_type: 'xlsx', uploaded_by: 'Abebe Girma', created_at: '2024-01-22', notes: '' },
  { id: 'doc-003', engagement_id: 'eng-001', client_id: 'cli-001', name: 'Fixed Asset Register 2023.xlsx', document_type: 'pbc_document', status: 'pending', file_size: 0, file_type: 'xlsx', uploaded_by: '', created_at: '', notes: 'Awaiting upload' },
  { id: 'doc-004', engagement_id: 'eng-002', client_id: 'cli-002', name: 'Internal Controls Assessment Q4.pdf', document_type: 'working_paper', status: 'uploaded', file_size: 1800000, file_type: 'pdf', uploaded_by: 'Beyan Omer', created_at: '2024-01-18', notes: '' },
  { id: 'doc-005', engagement_id: 'eng-003', client_id: 'cli-003', name: 'VAT Returns 2023 All Quarters.pdf', document_type: 'tax_return', status: 'uploaded', file_size: 3200000, file_type: 'pdf', uploaded_by: 'Dawit Tadesse', created_at: '2024-01-27', notes: '' },
  { id: 'doc-006', engagement_id: 'eng-004', client_id: 'cli-004', name: 'Audit Report Draft v2.pdf', document_type: 'audit_report', status: 'approved', file_size: 1100000, file_type: 'pdf', uploaded_by: 'Beyan Omer', created_at: '2024-01-24', notes: '' },
]

export const INVOICES = [
  { id: 'inv-001', engagement_id: 'eng-001', client_id: 'cli-001', invoice_number: 'INV-2024-0021', status: 'sent', amount: 45000, tax_amount: 6750, total_amount: 51750, currency: 'ETB', issue_date: '2024-01-20', due_date: '2024-02-20', paid_date: '', items: [{ desc: 'Statutory Audit FY2023 — fieldwork phase', qty: 1, unit: 35000, amount: 35000 }, { desc: 'Travel & out-of-pocket expenses', qty: 1, unit: 10000, amount: 10000 }] },
  { id: 'inv-002', engagement_id: 'eng-002', client_id: 'cli-002', invoice_number: 'INV-2024-0020', status: 'paid', amount: 38000, tax_amount: 5700, total_amount: 43700, currency: 'ETB', issue_date: '2024-01-10', due_date: '2024-02-10', paid_date: '2024-01-28', items: [{ desc: 'Internal Audit Q4 2023 — full fee', qty: 1, unit: 38000, amount: 38000 }] },
  { id: 'inv-003', engagement_id: 'eng-004', client_id: 'cli-004', invoice_number: 'INV-2024-0019', status: 'overdue', amount: 32000, tax_amount: 4800, total_amount: 36800, currency: 'ETB', issue_date: '2023-12-15', due_date: '2024-01-15', paid_date: '', items: [{ desc: 'Annual Compliance Review — 50% milestone', qty: 1, unit: 32000, amount: 32000 }] },
  { id: 'inv-004', engagement_id: 'eng-003', client_id: 'cli-003', invoice_number: 'INV-2024-0018', status: 'draft', amount: 28000, tax_amount: 4200, total_amount: 32200, currency: 'ETB', issue_date: '2024-01-25', due_date: '2024-02-25', paid_date: '', items: [{ desc: 'Tax Compliance Review 2023 — 50% deposit', qty: 1, unit: 28000, amount: 28000 }] },
  { id: 'inv-005', engagement_id: 'eng-005', client_id: 'cli-005', invoice_number: 'INV-2023-0017', status: 'paid', amount: 55000, tax_amount: 8250, total_amount: 63250, currency: 'ETB', issue_date: '2023-12-01', due_date: '2023-12-31', paid_date: '2023-12-29', items: [{ desc: 'Agreed-Upon Procedures — full fee', qty: 1, unit: 55000, amount: 55000 }] },
]

export const MESSAGES = [
  { id: 'msg-001', thread_id: 'thr-001', client_id: 'cli-001', engagement_id: 'eng-001', sender: 'Abebe Girma', sender_role: 'client', content: 'Hello, we have uploaded the bank statements for all three accounts. Please let us know if you need anything else urgently.', created_at: '2024-01-28T09:00:00', read: true },
  { id: 'msg-002', thread_id: 'thr-001', client_id: 'cli-001', engagement_id: 'eng-001', sender: 'Beyan Omer', sender_role: 'auditor', content: 'Thank you Abebe. Bank statements look complete. We still need the fixed asset register as at 31 December 2023 — could you provide this by end of this week?', created_at: '2024-01-28T11:30:00', read: true },
  { id: 'msg-003', thread_id: 'thr-001', client_id: 'cli-001', engagement_id: 'eng-001', sender: 'Abebe Girma', sender_role: 'client', content: 'We will upload the fixed asset register by end of day tomorrow. Apologies for the delay — our finance team was finalising the depreciation calculation.', created_at: '2024-01-29T14:30:00', read: false },
  { id: 'msg-004', thread_id: 'thr-002', client_id: 'cli-002', engagement_id: 'eng-002', sender: 'Hana Tesfaye', sender_role: 'client', content: 'The draft report looks very comprehensive. We have a few minor edits on page 8 regarding the procurement findings — can we discuss on a call?', created_at: '2024-01-29T10:00:00', read: true },
  { id: 'msg-005', thread_id: 'thr-003', client_id: 'cli-003', engagement_id: 'eng-003', sender: 'Dawit Tadesse', sender_role: 'client', content: 'Please find attached our TIN certificate and ERCA registration documents. Let me know if you need the withholding tax reconciliation as well.', created_at: '2024-01-27T16:00:00', read: false },
]

export const TIME_ENTRIES = [
  { id: 'te-001', engagement_id: 'eng-001', description: 'Revenue recognition policies review and trade receivables testing', hours: 3.5, date: '2024-01-29', is_billable: true },
  { id: 'te-002', engagement_id: 'eng-002', description: 'Finalising internal controls assessment report — draft v3', hours: 2.0, date: '2024-01-29', is_billable: true },
  { id: 'te-003', engagement_id: 'eng-001', description: 'Inventory count observation and cut-off testing at warehouse', hours: 4.0, date: '2024-01-26', is_billable: true },
  { id: 'te-004', engagement_id: 'eng-003', description: 'Initial planning meeting and document request list preparation', hours: 1.5, date: '2024-01-26', is_billable: true },
  { id: 'te-005', engagement_id: 'eng-004', description: 'Draft management letter — finding 3 remediation section', hours: 2.5, date: '2024-01-25', is_billable: true },
  { id: 'te-006', engagement_id: '', description: 'CPD training — IFRS 9 Financial Instruments update (NBE)', hours: 3.0, date: '2024-01-25', is_billable: false },
]

export const REPORTS = [
  { id: 'rep-001', engagement_id: 'eng-001', title: "Independent Auditor's Report — Ethio Trading PLC FY2023", client_id: 'cli-001', type: 'Statutory Audit Report', status: 'review', created: '2024-01-25', pages: 24, version: 2 },
  { id: 'rep-002', engagement_id: 'eng-002', title: 'Internal Audit Report — Abyssinia Hotels Q4 2023', client_id: 'cli-002', type: 'Internal Audit Report', status: 'completed', created: '2024-01-20', pages: 38, version: 3 },
  { id: 'rep-003', engagement_id: 'eng-004', title: 'Management Letter — East Africa Development Fund', client_id: 'cli-004', type: 'Management Letter', status: 'reporting', created: '2024-01-18', pages: 12, version: 1 },
  { id: 'rep-004', engagement_id: 'eng-005', title: 'AUP Report — Habesha Breweries SC H2 2023', client_id: 'cli-005', type: 'AUP Report', status: 'completed', created: '2023-12-15', pages: 18, version: 2 },
]

export const BLOG_POSTS = [
  { id: 'bp-001', slug: 'ifrs-17-ethiopia', title: 'IFRS 17 Insurance Contracts: What Ethiopian Insurers Must Know', excerpt: 'The phased adoption of IFRS 17 is now mandatory for Ethiopian insurance companies. Here is what the standard requires and how to prepare your audit trail.', content: 'IFRS 17 represents the most significant change to insurance accounting in decades. For Ethiopian insurers, the standard introduces a new measurement model requiring policies to be grouped and measured at current fulfilment values.\n\nUnder IFRS 17, insurers must group contracts into portfolios based on similar risks, apply the correct measurement model, and disclose the Contractual Service Margin (CSM) which represents future unearned profit.\n\nYour auditor will need to examine your actuarial assumptions, discount rates, and risk adjustments. Start by reviewing your contract portfolio segmentation, engaging your actuary early, and ensuring your finance system can produce the required disclosures.', tag: 'IFRS', author: 'Beyan Omer', date: '2024-01-15', read_time: 6 },
  { id: 'bp-002', slug: 'erca-transfer-pricing', title: "ERCA Transfer Pricing Rules and Their Audit Implications", excerpt: "Recent amendments to transfer pricing regulations affect multinational entities in Ethiopia. We break down the disclosure requirements and documentation standards.", content: 'The Ethiopian Revenue and Customs Authority (ERCA) has introduced updated transfer pricing regulations that significantly expand documentation obligations for companies engaged in cross-border related-party transactions.\n\nAny company with cross-border transactions exceeding ETB 500,000 per year must now maintain a Master File and Local File in line with the OECD BEPS Action 13 framework.\n\nDuring a tax audit, ERCA may challenge the arm\'s length nature of related-party pricing. Your auditor will assess whether adequate documentation exists to support the transfer prices applied.', tag: 'Tax', author: 'Beyan Omer', date: '2024-01-08', read_time: 5 },
  { id: 'bp-003', slug: 'audit-committee-ethiopia', title: 'Building an Effective Audit Committee in Ethiopian Companies', excerpt: 'A well-functioning audit committee is the cornerstone of financial governance. We outline composition, responsibilities, and best practices under the Commercial Code.', content: 'The Ethiopian Commercial Code requires companies above a certain size to establish an audit committee as part of their board governance structure. Despite this, many Ethiopian companies have audit committees in name only.\n\nAn effective audit committee should have at least three independent non-executive directors, include at least one member with financial expertise, meet quarterly at minimum, and have direct access to both internal and external auditors.\n\nThe audit committee oversees financial reporting integrity, appoints external auditors, reviews internal audit plans, and monitors the effectiveness of internal controls.', tag: 'Governance', author: 'Beyan Omer', date: '2023-12-20', read_time: 7 },
  { id: 'bp-004', slug: 'digital-audit-tools', title: 'How Digital Audit Tools Are Transforming Assurance in Africa', excerpt: 'Data analytics, AI-assisted sampling, and cloud-based working papers are reshaping how audits are planned and executed across the continent.', content: 'The audit profession is undergoing rapid technological change. Data analytics tools allow auditors to test entire populations of transactions rather than samples, dramatically improving audit quality and efficiency.\n\nAt Beyan Omer, we leverage modern audit software to deliver faster, more thorough engagements without compromising on rigour.', tag: 'Technology', author: 'Beyan Omer', date: '2023-11-30', read_time: 4 },
]

export const TESTIMONIALS = [
  { name: 'Tigist Alemu', role: 'CFO', company: 'Ethio Agro Industries PLC', industry: 'Manufacturing', rating: 5, quote: 'Beyan Omer transformed our financial reporting. Their IFRS expertise and the secure client portal made the whole process seamless. Our board now has full confidence in our numbers.' },
  { name: 'Dr. Samuel Bekele', role: 'Executive Director', company: 'East Africa Development Fund', industry: 'NGO', rating: 5, quote: 'The forensic audit uncovered a procurement irregularity that had gone undetected for 3 years. The methodology was airtight and the documentation stood up in court.' },
  { name: 'Hana Tesfaye', role: 'Managing Director', company: 'Abyssinia Hotels Group', industry: 'Hospitality', rating: 5, quote: "We have worked with several auditors over the years. Beyan Omer is different — they communicate proactively, use modern tools, and actually explain what they find." },
]

export const PBC_REQUESTS = [
  { id: 'pbc-001', engagement_id: 'eng-001', title: 'Audited financial statements FY2022 (comparatives)', done: true, due: '2024-01-15' },
  { id: 'pbc-002', engagement_id: 'eng-001', title: 'Bank statements — all accounts Jan–Dec 2023', done: true, due: '2024-01-15' },
  { id: 'pbc-003', engagement_id: 'eng-001', title: 'Fixed asset register as at 31 Dec 2023', done: false, due: '2024-01-30' },
  { id: 'pbc-004', engagement_id: 'eng-001', title: 'Debtors ageing schedule as at 31 Dec 2023', done: false, due: '2024-01-30' },
  { id: 'pbc-005', engagement_id: 'eng-001', title: 'Management accounts Q4 2023', done: false, due: '2024-02-05' },
  { id: 'pbc-006', engagement_id: 'eng-001', title: 'Board minutes FY2023 (all meetings)', done: false, due: '2024-02-05' },
]

export const REVENUE_CHART = [
  { month: 'Jul', revenue: 85000, target: 90000 }, { month: 'Aug', revenue: 92000, target: 90000 },
  { month: 'Sep', revenue: 78000, target: 90000 }, { month: 'Oct', revenue: 115000, target: 100000 },
  { month: 'Nov', revenue: 108000, target: 100000 }, { month: 'Dec', revenue: 132000, target: 110000 },
  { month: 'Jan', revenue: 95000, target: 100000 }, { month: 'Feb', revenue: 128000, target: 110000 },
  { month: 'Mar', revenue: 142000, target: 120000 }, { month: 'Apr', revenue: 156000, target: 130000 },
  { month: 'May', revenue: 148000, target: 140000 }, { month: 'Jun', revenue: 171000, target: 150000 },
]

export const NOTIFICATIONS = [
  { id: 'n-001', type: 'document_uploaded', title: 'New document uploaded', message: 'Abebe Girma uploaded "Bank Statements Jan-Dec 2023.pdf"', link: '/dashboard/documents', read: false, created_at: '2024-01-29T14:30:00' },
  { id: 'n-002', type: 'message_received', title: 'New message from Hana Tesfaye', message: 'Abyssinia Hotels: "The draft report looks comprehensive..."', link: '/dashboard/messages', read: false, created_at: '2024-01-29T10:00:00' },
  { id: 'n-003', type: 'invoice_overdue', title: 'Invoice overdue', message: 'INV-2024-0019 for East Africa Dev Fund is 14 days overdue', link: '/dashboard/billing', read: false, created_at: '2024-01-29T08:00:00' },
  { id: 'n-004', type: 'deadline_approaching', title: 'Engagement deadline in 7 days', message: 'Internal Audit Q4 — Abyssinia Hotels due Feb 15', link: '/dashboard/engagements', read: true, created_at: '2024-01-28T09:00:00' },
]
