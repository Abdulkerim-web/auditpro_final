import DashboardSidebar from '@/components/dashboard/DashboardSidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--surface-1)' }}>
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto flex flex-col">
        {children}
      </main>
    </div>
  )
}
