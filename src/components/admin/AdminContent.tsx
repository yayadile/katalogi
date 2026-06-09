'use client'

import { useSidebar } from '@/context/SidebarContext'
import type { ReactNode } from 'react'

export function AdminContent({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebar()

  return (
    <div
      className={`flex flex-col min-h-screen transition-all duration-300 ${
        collapsed ? 'lg:ml-[68px]' : 'lg:ml-[240px]'
      }`}
    >
      {children}
    </div>
  )
}
