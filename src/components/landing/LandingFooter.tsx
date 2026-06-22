'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Camera, Music, ArrowUp } from 'lucide-react'

export default function LandingFooter() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          <div className="max-w-sm space-y-4">
            <Link href="/" className="flex items-center group">
              <Image 
                src="/logo.png" 
                alt="Katalogi Logo" 
                width={120} 
                height={32} 
                className="h-10 w-auto rounded-xl" 
              />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Bangun katalog online profesional dalam 5 menit. Tanpa coding, tanpa ribet.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://wa.me/6281931920409"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-indigo-100 text-gray-500 hover:text-indigo-600 flex items-center justify-center transition-all duration-200"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/katalogi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-indigo-100 text-gray-500 hover:text-indigo-600 flex items-center justify-center transition-all duration-200"
                aria-label="Instagram"
              >
                <Camera className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com/@katalogi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-indigo-100 text-gray-500 hover:text-indigo-600 flex items-center justify-center transition-all duration-200"
                aria-label="TikTok"
              >
                <Music className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="flex items-start gap-10 sm:gap-16">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 tracking-wide">Navigasi</h4>
              <div className="flex flex-col gap-2">
                <Link href="#tentang" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors w-fit">Tentang</Link>
                <Link href="#cara-kerja" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors w-fit">Cara Kerja</Link>
                <Link href="#features" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors w-fit">Fitur</Link>
                <Link href="#faq" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors w-fit">FAQ</Link>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 tracking-wide">Akun</h4>
              <div className="flex flex-col gap-2">
                <Link href="/login" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors w-fit">Masuk</Link>
                <Link href="/login?signup=true" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors w-fit">Daftar Gratis</Link>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 tracking-wide">Hukum</h4>
              <div className="flex flex-col gap-2">
                <Link href="/kebijakan-privasi" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors w-fit">Kebijakan Privasi</Link>
                <Link href="/syarat-ketentuan" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors w-fit">Syarat & Ketentuan</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs">&copy; 2026 Katalogi. Karya anak bangsa untuk UMKM dunia.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-600 transition-colors"
          >
            Kembali ke atas
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  ) 
}
