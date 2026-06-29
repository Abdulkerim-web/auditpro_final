import ClientPortalSidebar from '@/components/client-portal/ClientPortalSidebar'

export default function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--surface-1)' }}>
      <ClientPortalSidebar />
      <main className="flex-1 overflow-y-auto flex flex-col">
        {children}
      </main>
    </div>
  )
}
