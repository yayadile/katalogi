'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sections, setSections] = useState<Record<string, boolean>>({
    tentang: true,
    'cara-kerja': true,
    features: true,
    showcase: true,
    testimoni: true,
    harga: true,
    faq: true,
  })

  const navLinks = [
    { id: 'tentang', label: 'Tentang' },
    { id: 'cara-kerja', label: 'Cara Kerja' },
    { id: 'features', label: 'Fitur' },
    { id: 'showcase', label: 'Template' },
    { id: 'testimoni', label: 'Testimoni' },
    { id: 'harga', label: 'Harga' },
    { id: 'faq', label: 'FAQ' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)

    const checkSections = () => {
      setSections({
        tentang: !!document.getElementById('tentang'),
        'cara-kerja': !!document.getElementById('cara-kerja'),
        features: !!document.getElementById('features'),
        showcase: !!document.getElementById('showcase'),
        testimoni: !!document.getElementById('testimoni'),
        harga: !!document.getElementById('harga'),
        faq: !!document.getElementById('faq'),
      })
    }
    checkSections()
    const interval = setInterval(checkSections, 1000)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(interval)
    }
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-white border-b border-gray-200' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 md:h-18 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center group">
          <Image 
            src="/logo.png" 
            alt="Katalogi Logo" 
            width={120} 
            height={32} 
            className="h-10 w-auto rounded-xl" 
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => 
            sections[link.id] && (
              <Link
                key={link.id}
                href={`#${link.id}`}
                className="text-sm font-semibold px-4 py-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
              >
                {link.label}
              </Link>
            )
          )}
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
            className="bg-linear-to-br from-indigo-500 to-indigo-900 hover:from-indigo-600 hover:to-indigo-950 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 active:scale-[0.97]"
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
          {navLinks.map((link) => 
            sections[link.id] && (
              <Link 
                key={link.id}
                href={`#${link.id}`} 
                className="text-sm font-semibold px-4 py-3 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors" 
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
          <Link href="/login" className="text-sm font-semibold px-4 py-3 text-gray-500 hover:text-gray-900 transition-colors pt-3 mt-1 border-t border-gray-100" onClick={() => setMobileOpen(false)}>
            Masuk
          </Link>
        </div>
      )}
    </header>
  )
}
