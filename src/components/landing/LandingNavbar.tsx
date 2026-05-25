'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, Menu, X } from 'lucide-react'

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-white border-b border-gray-200' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 md:h-18 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-700 transition-colors">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">
            Katalogi<span className="text-indigo-600">.</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="#tentang"
            className="text-sm font-semibold px-4 py-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
          >
            Tentang
          </Link>
          <Link
            href="#cara-kerja"
            className="text-sm font-semibold px-4 py-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
          >
            Cara Kerja
          </Link>
          <Link
            href="#features"
            className="text-sm font-semibold px-4 py-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
          >
            Fitur
          </Link>
          <Link
            href="#faq"
            className="text-sm font-semibold px-4 py-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
          >
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex text-sm font-semibold text-gray-500 hover:text-gray-900 px-4 py-2 transition-colors duration-200"
          >
            Masuk
          </Link>
          <Link
            href="/login?signup=true"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors duration-200"
          >
            Daftar Gratis
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-500 hover:text-gray-900 p-2 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-1 animate-fade-in">
          <Link href="#tentang" className="text-sm font-semibold px-4 py-3 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors" onClick={() => setMobileOpen(false)}>
            Tentang
          </Link>
          <Link href="#cara-kerja" className="text-sm font-semibold px-4 py-3 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors" onClick={() => setMobileOpen(false)}>
            Cara Kerja
          </Link>
          <Link href="#features" className="text-sm font-semibold px-4 py-3 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors" onClick={() => setMobileOpen(false)}>
            Fitur
          </Link>
          <Link href="#faq" className="text-sm font-semibold px-4 py-3 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors" onClick={() => setMobileOpen(false)}>
            FAQ
          </Link>
          <Link href="/login" className="text-sm font-semibold px-4 py-3 text-gray-500 hover:text-gray-900 transition-colors pt-3 mt-1 border-t border-gray-100" onClick={() => setMobileOpen(false)}>
            Masuk
          </Link>
        </div>
      )}
    </header>
  )
}
