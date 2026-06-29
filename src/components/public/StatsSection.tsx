export default function StatsSection() {
  const stats = [
    { value: '120+', label: 'Clients Served', sub: 'Across Ethiopia' },
    { value: '15+', label: 'Years Experience', sub: 'In audit & assurance' },
    { value: '98%', label: 'Client Retention', sub: 'Year over year' },
    { value: '500+', label: 'Audits Completed', sub: 'IFRS compliant' },
  ]
  return (
    <section className="py-20 border-y" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map(s => (
          <div key={s.label} className="text-center">
            <div className="text-4xl font-extrabold mb-1 text-gradient">{s.value}</div>
            <div className="font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{s.label}</div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
