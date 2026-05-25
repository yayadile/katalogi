'use client'

import React from 'react'
import Link from 'next/link'
import { Rocket, ShieldCheck, Timer, Zap, Smartphone, Sparkles, Palette, Globe } from 'lucide-react'

export default function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Grid overlay (4% opacity) */}
      <div className="absolute inset-0 grid-overlay pointer-events-none" />

      {/* Concentric decorative rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] md:w-[520px] md:h-[520px] lg:w-[620px] lg:h-[620px] rounded-full border border-indigo-600/10 animate-ring-pulse pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] md:w-[370px] md:h-[370px] lg:w-[420px] lg:h-[420px] rounded-full border border-indigo-600/[0.06] animate-ring-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Floating decorative icons (15% opacity) */}
      <div className="absolute pointer-events-none text-indigo-600/15" style={{ left: '10%', top: '20%' }}>
        <Palette className="w-8 h-8 md:w-10 md:h-10 animate-float-icon" />
      </div>
      <div className="absolute pointer-events-none text-indigo-600/15" style={{ left: '85%', top: '22%' }}>
        <Globe className="w-8 h-8 md:w-10 md:h-10 animate-float-icon" style={{ animationDelay: '0.5s' }} />
      </div>
      <div className="absolute pointer-events-none text-indigo-600/15" style={{ left: '8%', top: '70%' }}>
        <Zap className="w-8 h-8 md:w-10 md:h-10 animate-float-icon" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute pointer-events-none text-indigo-600/15" style={{ left: '88%', top: '68%' }}>
        <Smartphone className="w-8 h-8 md:w-10 md:h-10 animate-float-icon" style={{ animationDelay: '0.3s' }} />
      </div>
      <div className="absolute pointer-events-none text-indigo-600/15" style={{ left: '50%', top: '88%' }}>
        <Sparkles className="w-7 h-7 md:w-9 md:h-9 animate-float-icon" style={{ animationDelay: '0.8s' }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 w-full">
        <div className="max-w-[880px] mx-auto text-center">
          {/* Heading */}
          <h1 className="text-[clamp(36px,10vw,80px)] font-extrabold text-gray-950 leading-[1.0] tracking-[-0.02em] animate-fade-up delay-100">
            Bikin Katalog{' '}
            <span className="text-indigo-600">
              Jualannya Jadi Gampang.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 mx-auto max-w-[560px] text-[15px] sm:text-[17px] leading-[1.7] text-gray-500 animate-fade-up delay-200">
            Ubah jualan Anda jadi online dalam 5 menit. Tanpa koding, tanpa ribet, desain premium gratis selamanya.
          </p>

          {/* CTAs */}
          <div className="mt-8 md:mt-10 animate-fade-up delay-300">
            <Link
              href="/login?signup=true"
              className="inline-flex bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl transition-colors duration-200 items-center justify-center gap-2 text-base group"
            >
              Mulai Gratis Sekarang
              <Rocket className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 md:mt-20 pt-10 border-t border-gray-100 grid grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-up delay-500">
            <StatItem value="5 Menit" label="Waktu Setup">
              <Timer className="w-4 h-4 text-indigo-500" />
            </StatItem>
            <StatItem value="0 Biaya" label="Mulai Dari Rp0">
              <Zap className="w-4 h-4 text-amber-500" />
            </StatItem>
            <StatItem value="Mobile First" label="Sangat Responsif">
              <Smartphone className="w-4 h-4 text-cyan-600" />
            </StatItem>
            <StatItem value="Premium" label="Keamanan Terjamin">
              <ShieldCheck className="w-4 h-4 text-green-600" />
            </StatItem>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatItem({ value, label, children }: { value: string; label: string; children: React.ReactNode }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1.5 text-lg font-bold text-gray-900 mb-0.5">
        {children}
        <span>{value}</span>
      </div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}
