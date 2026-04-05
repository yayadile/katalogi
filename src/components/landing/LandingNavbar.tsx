'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-slate-900/80 backdrop-blur-md border-white/10 py-3' 
          : 'bg-transparent border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Katalogi<span className="text-indigo-400">.</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Fitur</Link>
          <Link href="#showcase" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Showcase</Link>
          <Link href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Harga</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 transition-colors"
          >
            Masuk
          </Link>
          <Link 
            href="/login?signup=true" 
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
          >
            Daftar Gratis
          </Link>
        </div>
      </div>
    </nav>
  )
}
