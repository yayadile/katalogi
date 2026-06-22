'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/context/SidebarContext'
import {
  LayoutDashboard, Users, Globe, MessageSquareText, BarChart3,
  ChevronLeft, ChevronRight, Menu, X, Crown
} from 'lucide-react'

const navItems = [
  { name: 'Beranda', href: '/admin', icon: LayoutDashboard },
  { name: 'Analitik', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Pengguna', href: '/admin/users', icon: Users },
  { name: 'Website', href: '/admin/websites', icon: Globe },
  { name: 'Langganan', href: '/admin/subscriptions', icon: Crown },
  { name: 'Testimoni', href: '/admin/testimonials', icon: MessageSquareText },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname, setMobileOpen])

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${collapsed ? 'w-[68px]' : 'w-[240px]'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-gray-100 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {collapsed ? (
            <Image src="/logo.png" alt="K" width={28} height={28} className="rounded-lg shrink-0" />
          ) : (
            <>
              <Link href="/admin" className="flex items-center gap-2">
                <Image src="/logo.png" alt="Katalogi" width={28} height={28} className="rounded-lg shrink-0" />
                <span className="font-black text-gray-900 text-lg tracking-tight">Katalogi</span>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md uppercase tracking-wider">Admin</span>
              </Link>
              <button
                onClick={() => setCollapsed(true)}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors shrink-0"
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </button>
            </>
          )}
        </div>

        {/* Toggle expand button when collapsed */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="absolute top-4 -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors z-10"
          >
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </button>
        )}

        {/* Nav items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all duration-200
                  ${collapsed ? 'justify-center' : ''}
                  ${isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Mobile close button */}
        <div className="lg:hidden border-t border-gray-100 p-3">
          <button
            onClick={() => setMobileOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
            Tutup
          </button>
        </div>
      </aside>
    </>
  )
}
