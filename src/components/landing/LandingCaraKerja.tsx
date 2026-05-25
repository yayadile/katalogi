'use client'

import React, { useEffect, useRef } from 'react'
import { MousePointer2, Upload, Globe } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: <MousePointer2 className="w-6 h-6 text-indigo-600" />,
    title: 'Pilih & Atur',
    description: 'Pilih blok Hero, Katalog, Kontak, atau Teks. Atur tampilannya dengan drag & drop semudah menggeser.',
  },
  {
    number: '02',
    icon: <Upload className="w-6 h-6 text-indigo-600" />,
    title: 'Upload & Sesuaikan',
    description: 'Upload foto produk, tulis deskripsi, atur harga. Ganti warna dan font sesuai merek Anda.',
  },
  {
    number: '03',
    icon: <Globe className="w-6 h-6 text-indigo-600" />,
    title: 'Publikasikan',
    description: 'Satu klik, website langsung online dan bisa diakses pelanggan lewat link. Semua tersimpan otomatis.',
  },
]

export default function LandingCaraKerja() {
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
    <section id="cara-kerja" ref={sectionRef} className="py-24 md:py-32 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-50 pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-[450px] h-[450px] bg-indigo-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="reveal-item text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Cara Kerja
          </h2>
          <p className="reveal-item delay-100 max-w-2xl mx-auto text-gray-500 text-lg">
            Tiga langkah mudah untuk membawa bisnis Anda ke dunia online.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
          <div className="hidden md:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-[2px] bg-indigo-200" />

          {steps.map((step, i) => (
            <div
              key={step.title}
              className="reveal-item relative flex flex-col items-center text-center"
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="relative z-10 w-24 h-24 bg-white border-2 border-indigo-200 rounded-2xl flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 mb-3">
                {step.number}
              </span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
