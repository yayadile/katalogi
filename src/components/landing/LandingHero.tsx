'use client'

import React from 'react'
import Link from 'next/link'
import { Rocket, ShieldCheck, Zap } from 'lucide-react'

export default function LandingHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Blobs (Premium Design) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-7xl h-full blur-[120px] opacity-20 pointer-events-none">
        <div className="absolute top-20 right-20 w-80 h-80 bg-indigo-600 rounded-full animate-pulse" />
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-purple-600 rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-bold mb-8 animate-fade-in">
          <Zap className="w-4 h-4 fill-indigo-400" /> Baru: Katalog Builder v1.0
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-8 animate-fade-up">
          Bikin Katalog <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Jualannya Jadi Gampang.
          </span>
        </h1>

        {/* Sub-heading */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed mb-12 animate-fade-up delay-100">
          Ubah jualan Anda jadi online dalam 5 menit. Tanpa koding, tanpa ribet, desain premium gratis selamanya.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-200">
          <Link 
            href="/login?signup=true" 
            className="w-full sm:w-auto bg-white text-slate-900 font-bold px-10 py-5 rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-lg shadow-2xl shadow-indigo-500/20 active:scale-95"
          >
            Mulai Gratis Sekarang <Rocket className="w-5 h-5" />
          </Link>
          <Link 
            href="#showcase" 
            className="w-full sm:w-auto bg-white/5 border border-white/10 hover:border-white/20 text-white font-semibold px-10 py-5 rounded-2xl transition-all flex items-center justify-center gap-2 text-lg backdrop-blur-sm"
          >
            Lihat Contoh
          </Link>
        </div>

        {/* Stats / Social Proof */}
        <div className="mt-20 pt-10 border-t border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-8 opacity-60 animate-fade-in delay-500">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">5 Menit</div>
            <div className="text-slate-500 text-sm">Waktu Setup</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">0 Biaya</div>
            <div className="text-slate-500 text-sm">Mulai Dari Rp0</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">Mobile First</div>
            <div className="text-slate-500 text-sm">Sangat Responsif</div>
          </div>
          <div className="text-center relative">
            <div className="text-2xl font-bold text-white mb-1 flex items-center justify-center gap-1">
              Premium <ShieldCheck className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-slate-500 text-sm">Keamanan Terjamin</div>
          </div>
        </div>
      </div>
    </section>
  )
}
