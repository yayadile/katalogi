'use client'

import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { logout } from '@/lib/actions/auth'
import { useSidebar } from '@/context/SidebarContext'

const breadcrumbMap: Record<string, string> = {
  '/admin': 'Beranda',
  '/admin/analytics': 'Analitik',
  '/admin/users': 'Pengguna',
  '/admin/websites': 'Website',
  '/admin/testimonials': 'Testimoni',
}

export function AdminHeader({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname()
  const { collapsed } = useSidebar()
  const base = '/' + pathname.split('/').slice(1, 3).join('/')
  const title = breadcrumbMap[base] ?? breadcrumbMap[pathname] ?? 'Admin'
  return (
    <header
      className={`h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 transition-all duration-300 ${
        collapsed ? 'lg:pl-[68px]' : 'lg:pl-[240px]'
      }`}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-bold text-gray-400 tracking-wider uppercase shrink-0">Admin</span>
        <span className="text-gray-300 font-bold shrink-0">/</span>
        <h1 className="text-sm font-black text-gray-900 tracking-wide truncate">{title}</h1>
      </div>

      {/* User info + logout */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black text-sm">
            {(user.name ?? user.email).charAt(0).toUpperCase()}
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900 leading-tight">{user.name ?? 'Admin'}</p>
            <p className="text-[11px] font-medium text-gray-400">{user.email}</p>
          </div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </form>
      </div>
    </header>
  )
}
