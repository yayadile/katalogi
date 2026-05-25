'use client'

import React, { useEffect, useRef } from 'react'
import { Target, Eye } from 'lucide-react'

export default function LandingTentang() {
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
    <section id="tentang" ref={sectionRef} className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-indigo-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-[400px] h-[400px] bg-purple-600/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="absolute pointer-events-none text-indigo-600/10" style={{ left: '5%', top: '30%' }}>
        <Target className="w-7 h-7 animate-float-icon" />
      </div>
      <div className="absolute pointer-events-none text-indigo-600/10" style={{ right: '5%', top: '60%' }}>
        <Eye className="w-7 h-7 animate-float-icon" style={{ animationDelay: '0.7s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="max-w-[860px] mx-auto text-center">
          <h2 className="reveal-item text-3xl md:text-5xl font-bold text-gray-900 mb-8">
            Tentang Katalogi
          </h2>
          <p className="reveal-item delay-100 text-[15px] sm:text-[17px] text-gray-500 leading-[1.8] text-left sm:text-center">
            Katalogi adalah website builder yang dibuat khusus untuk membantu Anda memajang produk dan jasa secara online, tanpa perlu bisa coding, tanpa perlu panggil desainer. Semua Anda atur sendiri langsung dari dashboard.
          </p>
        </div>
      </div>
    </section>
  )
}
