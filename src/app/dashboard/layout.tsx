import { requireAuth } from '@/lib/session'
import { logout } from '@/lib/actions/auth'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth()

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Navbar */}
      <nav className="bg-slate-900 border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-base">K</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Katalogi</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm hidden sm:block">
            {session.name ?? session.email}
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Keluar
            </button>
          </form>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {children}
      </main>
    </div>
  )
}
