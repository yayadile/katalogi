'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

export default function LandingCTA() {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    const maxDeg = 8
    setRotateY((x - 0.5) * maxDeg * 2)
    setRotateX((0.5 - y) * maxDeg * 2)
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setRotateX(0)
    setRotateY(0)
    setIsHovered(false)
  }, [])

  return (
    <section ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden bg-white">
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <div
        className={`max-w-5xl mx-auto px-6 relative transition-all duration-700 ${
          revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="bg-gradient-to-br from-indigo-500 to-indigo-900 rounded-[2rem] p-10 md:p-16 lg:p-20 text-center relative overflow-hidden cursor-default"
          style={{
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
            transition: isHovered
              ? 'transform 0.1s ease-out'
              : 'transform 0.5s ease-out',
          }}
        >
          {/* Dot + grid pattern overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px),
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '28px 28px, 80px 80px, 80px 80px',
            }}
          />

          {/* Decorative block shapes */}
          <div className="absolute top-8 right-12 w-8 h-8 border border-white/10 rounded-lg rotate-12 pointer-events-none hidden md:block" />
          <div className="absolute bottom-12 left-10 w-6 h-6 border-2 border-white/[0.08] rounded-md -rotate-6 pointer-events-none hidden md:block" />
          <div className="absolute top-1/3 left-8 w-4 h-4 border border-white/[0.06] rounded pointer-events-none hidden md:block" />
          <div className="absolute bottom-1/3 right-8 w-5 h-5 border border-white/[0.06] rounded-sm rotate-45 pointer-events-none hidden md:block" />

          {/* Glare effect */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: isHovered ? 0.15 : 0,
              background: `radial-gradient(circle at ${50 + rotateY * 3}% ${50 - rotateX * 3}%, rgba(255,255,255,0.8) 0%, transparent 60%)`,
            }}
          />

          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-black/10 rounded-full blur-[60px] pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
              Siap Buat Katalog <br /> Terbaik Anda?
            </h2>
            <Link
              href="/login?signup=true"
              className="inline-flex bg-white text-indigo-700 font-bold px-10 py-4 rounded-xl hover:bg-gray-100 transition-colors duration-200 text-lg"
            >
              Mulai Sekarang dengan Gratis
            </Link>
            <p className="mt-6 text-indigo-200 font-medium text-sm md:text-base">
              Bersenang-senanglah membangun, kami yang urus teknisnya.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
