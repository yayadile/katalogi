import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Camera, Music } from 'lucide-react'

export default function LandingFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center group">
              <Image 
                src="/logo.png" 
                alt="Katalogi Logo" 
                width={120} 
                height={32} 
                className="h-10 w-auto rounded-xl" 
              />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Bangun katalog online profesional dalam 5 menit. Tanpa coding, tanpa ribet.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">Navigasi</h4>
            <div className="flex flex-col gap-2">
              <Link href="#tentang" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Tentang</Link>
              <Link href="#cara-kerja" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Cara Kerja</Link>
              <Link href="#features" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Fitur</Link>
              <Link href="#showcase" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Template</Link>
              <Link href="#harga" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Harga</Link>
              <Link href="#faq" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">FAQ</Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">Akun</h4>
            <div className="flex flex-col gap-2">
              <Link href="/login" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Masuk</Link>
              <Link href="/login?signup=true" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Daftar Gratis</Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">Hubungi Kami</h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://wa.me/628xxxxxx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                WhatsApp
              </a>
              <a
                href="https://instagram.com/katalogi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
              >
                <Camera className="w-4 h-4" />
                Instagram
              </a>
              <a
                href="https://tiktok.com/@katalogi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
              >
                <Music className="w-4 h-4" />
                TikTok
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-xs">&copy; 2026 Katalogi. Karya anak bangsa untuk UMKM dunia.</p>
        </div>
      </div>
    </footer>
  ) 
}
