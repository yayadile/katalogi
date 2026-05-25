import { requireAuth } from '@/lib/session'
import { logout } from '@/lib/actions/auth'
import { Sparkles, Palette, Zap, Globe } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth()

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Grid overlay */}
      <div className="fixed inset-0 grid-overlay pointer-events-none" />

      {/* Gradient blur orbs */}
      <div className="fixed -top-40 -left-40 w-[500px] h-[500px] bg-indigo-500/[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-[500px] h-[500px] bg-violet-500/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* Floating decorative icons */}
      <div className="fixed pointer-events-none text-indigo-600/10" style={{ left: '3%', top: '12%' }}>
        <Sparkles className="w-6 h-6 animate-float-icon" />
      </div>
      <div className="fixed pointer-events-none text-indigo-600/10" style={{ left: '95%', top: '20%' }}>
        <Palette className="w-6 h-6 animate-float-icon" style={{ animationDelay: '0.6s' }} />
      </div>
      <div className="fixed pointer-events-none text-indigo-600/10" style={{ left: '4%', top: '85%' }}>
        <Zap className="w-5 h-5 animate-float-icon" style={{ animationDelay: '1.2s' }} />
      </div>
      <div className="fixed pointer-events-none text-indigo-600/10" style={{ left: '96%', top: '80%' }}>
        <Globe className="w-6 h-6 animate-float-icon" style={{ animationDelay: '0.3s' }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/10 group-hover:bg-indigo-700 transition-colors">
            <span className="text-white font-bold text-base">K</span>
          </div>
          <span className="text-gray-900 font-bold text-xl tracking-tight">
            Katalogi<span className="text-indigo-600">.</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm hidden sm:block">
            {session.name ?? session.email}
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all"
            >
              Keluar
            </button>
          </form>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 py-8 animate-fade-in">
        {children}
      </main>
    </div>
  )
}
