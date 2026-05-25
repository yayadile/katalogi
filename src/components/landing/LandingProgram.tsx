'use client'

import React, { useEffect, useRef } from 'react'
import { Share2, GraduationCap, ShieldCheck, Target, TrendingUp, Medal } from 'lucide-react'

const programs = [
  {
    number: '01',
    icon: <Share2 className="w-5 h-5 text-indigo-600" />,
    title: 'Promosi & Pemasaran',
    description: 'Menciptakan platform media sosial untuk mempromosikan jasa, juga melakukan promosi jasa Katalogi dengan mengikuti pameran.',
  },
  {
    number: '02',
    icon: <GraduationCap className="w-5 h-5 text-indigo-600" />,
    title: 'Pelatihan & Tren',
    description: 'Memberikan pelatihan untuk dapat mengikuti trend pasar yang terbaru.',
  },
  {
    number: '03',
    icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />,
    title: 'Garansi & Support',
    description: 'Menyediakan garansi servis dan support pemeliharaan selama 1 bulan penuh tanpa biaya tambahan.',
  },
]

export default function LandingProgram() {
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
    <section id="program" ref={sectionRef} className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-[500px] h-[500px] bg-violet-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[350px] h-[350px] bg-indigo-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* Floating decorative icons */}
      <div className="absolute pointer-events-none text-violet-500/10" style={{ left: '7%', top: '22%' }}>
        <Target className="w-7 h-7 animate-float-icon" />
      </div>
      <div className="absolute pointer-events-none text-violet-500/10" style={{ left: '88%', top: '25%' }}>
        <TrendingUp className="w-7 h-7 animate-float-icon" style={{ animationDelay: '0.8s' }} />
      </div>
      <div className="absolute pointer-events-none text-violet-500/10" style={{ left: '3%', top: '68%' }}>
        <Medal className="w-7 h-7 animate-float-icon" style={{ animationDelay: '0.4s' }} />
      </div>
      <div className="absolute pointer-events-none text-violet-500/10" style={{ left: '93%', top: '70%' }}>
        <GraduationCap className="w-7 h-7 animate-float-icon" style={{ animationDelay: '1.1s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="reveal-item inline-block">Program</span>{' '}
            <span className="reveal-item inline-block text-indigo-600 delay-100 hover:underline decoration-indigo-300 decoration-2 underline-offset-4 transition-all duration-300">
              Kerja
            </span>
          </h2>
          <p className="reveal-item max-w-2xl mx-auto text-gray-500 text-lg delay-200">
            Komitmen kami dalam memberikan layanan terbaik untuk setiap mitra bisnis.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {programs.map((program, i) => (
            <div
              key={program.title}
              className="program-card reveal-item bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 hover:-translate-y-0.5 p-6 rounded-xl transition-all duration-500"
              style={{ transitionDelay: `${i * 100 + 300}ms` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                  {program.number}
                </span>
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  {program.icon}
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5">{program.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{program.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
