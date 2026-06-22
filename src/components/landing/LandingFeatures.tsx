'use client'

import React, { useEffect, useRef } from 'react'
import { Paintbrush, MousePointer2, Globe, Smartphone, Zap, CheckCircle2, Layers, Code, Palette } from 'lucide-react'

const features = [
  {
    icon: <Paintbrush className="w-5 h-5 text-indigo-500" />,
    title: 'Desain Kustom',
    description: 'Pilih tema, warna, dan font yang sesuai dengan identitas merk Anda.',
  },
  {
    icon: <MousePointer2 className="w-5 h-5 text-indigo-500" />,
    title: 'Sangat Mudah',
    description: 'Drag & drop builder yang intuitif. Cukup klik, ketik, dan kustom sesuai keinginan.',
  },
  {
    icon: <Globe className="w-5 h-5 text-indigo-500" />,
    title: 'Domain Anda',
    description: 'Katalog profesional dengan slug cantik yang mudah diingat pelanggan.',
  },
  {
    icon: <Smartphone className="w-5 h-5 text-indigo-500" />,
    title: 'Mobile First',
    description: 'Tampilan optimal di semua perangkat mobile pelanggan Anda. 100% responsif.',
  },
  {
    icon: <Zap className="w-5 h-5 text-indigo-500" />,
    title: 'Performa Tinggi',
    description: 'Cepat diakses, tanpa lag. Tak ada lagi pelanggan kabur gara-gara web lambat.',
  },
  {
    icon: <CheckCircle2 className="w-5 h-5 text-indigo-500" />,
    title: 'Gratis Untuk Mulai',
    description: 'Buat unlimited proyek, publish 1 website gratis dengan badge Katalogi.',
  },
]

export default function LandingFeatures() {
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
    <section id="features" ref={sectionRef} className="py-24 md:py-32 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-50 pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-indigo-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-indigo-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* Floating decorative icons */}
      <div className="absolute pointer-events-none text-indigo-500/10" style={{ left: '4%', top: '18%' }}>
        <Layers className="w-7 h-7 animate-float-icon" />
      </div>
      <div className="absolute pointer-events-none text-indigo-500/10" style={{ left: '92%', top: '30%' }}>
        <Code className="w-7 h-7 animate-float-icon" style={{ animationDelay: '0.6s' }} />
      </div>
      <div className="absolute pointer-events-none text-indigo-500/10" style={{ left: '6%', top: '72%' }}>
        <Palette className="w-7 h-7 animate-float-icon" style={{ animationDelay: '1.2s' }} />
      </div>
      <div className="absolute pointer-events-none text-indigo-500/10" style={{ left: '90%', top: '75%' }}>
        <Zap className="w-7 h-7 animate-float-icon" style={{ animationDelay: '0.3s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 text-balance">
            <span className="reveal-item inline-block">Apapun Bisnis Anda.</span>
            <br />
            <span className="reveal-item inline-block text-indigo-600 delay-100 hover:underline decoration-indigo-300 decoration-2 underline-offset-4 transition-all duration-300">
              Katalogi Solusinya.
            </span>
          </h2>
          <p className="reveal-item max-w-2xl mx-auto text-gray-500 text-lg delay-200">
            Semua fitur yang Anda butuhkan untuk membangun katalog profesional tanpa bantuan desainer atau programmer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="feature-card reveal-item flex items-start gap-5 bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 hover:-translate-y-0.5 p-6 rounded-xl transition-all duration-500"
              style={{ transitionDelay: `${i * 100 + 300}ms` }}
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1.5">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
