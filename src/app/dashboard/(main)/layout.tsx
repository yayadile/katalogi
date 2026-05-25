import { requireAuth } from '@/lib/session'
import { logout } from '@/lib/actions/auth'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth()

  return (
    <div className="min-h-screen bg-white grid-overlay flex flex-col relative">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">K</span>
          </div>
          <span className="text-gray-900 font-black text-2xl tracking-tighter uppercase">Katalogi</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-gray-600 text-sm font-medium hidden sm:block">
            {session.name ?? session.email}
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="text-gray-500 hover:text-indigo-600 text-sm font-bold uppercase tracking-wider transition-colors"
            >
              Keluar
            </button>
          </form>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 relative z-10">
        {children}
      </main>
    </div>
  )
}
