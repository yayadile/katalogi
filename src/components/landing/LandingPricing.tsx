'use client'

import React, { useEffect, useRef } from 'react'
import { Check } from 'lucide-react'
import Link from 'next/link'

export default function LandingPricing() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const items = el.querySelectorAll('.reveal-item')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('revealed', entry.isIntersecting)
        })
      },
      { threshold: 0.15 }
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="harga" ref={sectionRef} className="py-24 bg-gray-50 relative overflow-hidden border-y border-gray-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-linear-to-br from-indigo-500/5 to-purple-500/5 blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="reveal-item text-sm font-black text-indigo-600 uppercase tracking-widest mb-3">
            Pilihan Paket
          </h2>
          <h3 className="reveal-item text-3xl md:text-4xl font-bold text-gray-900 mb-6" style={{ transitionDelay: '100ms' }}>
            Harga Transparan, Tanpa Biaya Tersembunyi
          </h3>
          <p className="reveal-item text-gray-500 text-lg" style={{ transitionDelay: '200ms' }}>
            Mulai dari gratis untuk coba-coba, hingga paket pro untuk usaha yang serius berkembang.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="reveal-item bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100" style={{ transitionDelay: '300ms' }}>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Starter</h4>
            <p className="text-gray-500 text-sm mb-6">Cocok untuk mencoba fitur dasar</p>
            <div className="mb-8">
              <span className="text-4xl font-black text-gray-900">Gratis</span>
              <span className="text-gray-500"> /selamanya</span>
            </div>
            <ul className="space-y-4 mb-10">
              {['1 Website Katalog', 'Subdomain .katalogi.com', 'Maksimal 50 Produk', 'Tema Standar'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            <Link 
              href="/register"
              className="block w-full py-4 text-center rounded-2xl font-bold text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              Mulai Gratis
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="reveal-item bg-linear-to-br from-indigo-500 to-indigo-900 rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-600/20 text-white relative transform md:-translate-y-4" style={{ transitionDelay: '400ms' }}>
            <div className="absolute top-0 right-10 -mt-4 bg-yellow-400 text-yellow-900 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">
              Paling Laris
            </div>
            <h4 className="text-xl font-bold mb-2">Bisnis</h4>
            <p className="text-indigo-200 text-sm mb-6">Untuk usaha yang serius berkembang</p>
            <div className="mb-8">
              <span className="text-4xl font-black">Rp 75rb</span>
              <span className="text-indigo-200"> /bulan</span>
            </div>
            <ul className="space-y-4 mb-10">
              {['Website Katalog Tanpa Batas', 'Produk & Gambar Tanpa Batas', 'Akses Semua Tema Premium', 'Analitik Pengunjung Detail', 'Prioritas Bantuan 24/7'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-indigo-100">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            <Link 
              href="/register?plan=pro"
              className="block w-full py-4 text-center rounded-2xl font-bold text-indigo-900 bg-white hover:bg-gray-50 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10"
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
