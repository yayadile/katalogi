import { requireAdmin } from '@/lib/session'
import { SidebarProvider } from '@/context/SidebarContext'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminContent } from '@/components/admin/AdminContent'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin()

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 grid-overlay">
        <AdminSidebar />
        <AdminContent>
          <AdminHeader user={{ name: session.name ?? 'Admin', email: session.email }} />
          <main className="flex-1 px-4 sm:px-8 py-8">
            {children}
          </main>
        </AdminContent>
      </div>
    </SidebarProvider>
  )
}
