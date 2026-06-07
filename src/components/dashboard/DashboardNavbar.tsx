'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import { LayoutDashboard, BarChart3, CreditCard, Settings, LifeBuoy, LogOut } from 'lucide-react'

const navItems = [
  { name: 'Proyek', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analitik', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Langganan', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
  { name: 'Bantuan', href: '/dashboard/help', icon: LifeBuoy },
]

export function DashboardNavbar({ user }: { user: { name: string, email: string } }) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`sticky z-50 w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'top-4 sm:top-6 px-4 sm:px-6' : 'top-0 px-0'}`}>
      <nav className={`mx-auto w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
        isScrolled
          ? 'max-w-6xl rounded-[2.5rem] md:rounded-full backdrop-blur-2xl bg-white/95 shadow-2xl shadow-indigo-600/10 border border-gray-200/50'
          : 'max-w-full rounded-none backdrop-blur-xl bg-white/70 shadow-sm border-b border-gray-200/50'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tabs */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center shrink-0 transition-transform hover:scale-105">
              <Image 
                src="/logo.png" 
                alt="Katalogi Logo" 
                width={120} 
                height={32} 
                className="h-9 w-auto rounded-xl" 
                priority
              />
            </Link>

            {/* Desktop Tabs */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                // Determine active state strictly for the exact path, or if it's a subpath
                // except for '/dashboard' which shouldn't light up on other paths.
                const isActive = item.href === '/dashboard' 
                  ? pathname === '/dashboard' 
                  : pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 group overflow-hidden ${
                      isActive ? 'text-indigo-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 bg-indigo-50/80 rounded-full -z-10 animate-fade-in" />
                    )}
                    <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right side: User & Logout */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-gray-900 text-sm font-bold leading-none mb-1 truncate max-w-[150px]">{user.name}</span>
              <span className={`text-gray-500 text-[10px] font-bold uppercase tracking-widest truncate max-w-[150px] transition-all duration-300 ${isScrolled ? 'hidden opacity-0 h-0' : 'block opacity-100'}`}>{user.email}</span>
            </div>
            <div className="w-px h-8 bg-gray-200 hidden sm:block" />
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-2 text-gray-500 hover:text-red-600 text-xs font-bold uppercase tracking-wider transition-colors group px-3 py-2 rounded-xl hover:bg-red-50"
              >
                <span className="hidden sm:inline">Keluar</span>
                <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Mobile Tabs (Scrollable) */}
      <div className="md:hidden border-t border-gray-100/50 pb-3 pt-3 relative">
        {/* Efek gradient fading di tepi agar terlihat bisa di-scroll */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 rounded-bl-[2.5rem]" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 rounded-br-[2.5rem]" />
        
        <div className="flex items-center space-x-3 overflow-x-auto hide-scrollbar snap-x snap-mandatory px-4 sm:px-6">
          {navItems.map((item) => {
            const isActive = item.href === '/dashboard' 
              ? pathname === '/dashboard' 
              : pathname.startsWith(item.href)
              
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`snap-center flex-shrink-0 relative px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center gap-2 group overflow-hidden ${
                  isActive ? 'text-indigo-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 bg-indigo-50/90 shadow-inner rounded-full -z-10 animate-in fade-in zoom-in-95 duration-500" />
                )}
                <item.icon className={`w-4 h-4 transition-colors duration-500 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>
      </nav>
    </div>
  )
}
