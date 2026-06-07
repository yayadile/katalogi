import { requireAuth } from '@/lib/session'
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth()

  return (
    <div className="min-h-screen bg-white grid-overlay flex flex-col relative">
      <DashboardNavbar user={{ name: session.name ?? 'Pengguna', email: session.email }} />

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 relative z-10">
        {children}
      </main>
    </div>
  )
}
