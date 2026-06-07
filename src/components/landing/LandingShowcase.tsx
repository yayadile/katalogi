import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ScrollRevealWrapper from './ScrollRevealWrapper'

export default async function LandingShowcase() {
  const showcases = await prisma.website.findMany({
    where: { isPublished: true },
    take: 6,
    orderBy: { createdAt: 'desc' }
  })

  if (showcases.length === 0) return null

  return (
    <ScrollRevealWrapper id="showcase" className="py-24 bg-gray-50 border-y border-gray-100 overflow-hidden relative">
      <div className="absolute inset-0 grid-overlay opacity-50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="reveal-item text-sm font-black text-indigo-600 uppercase tracking-widest mb-3">
            Galeri Template
          </h2>
          <h3 className="reveal-item text-3xl md:text-4xl font-bold text-gray-900 mb-6" style={{ transitionDelay: '100ms' }}>
            Desain Profesional Siap Pakai
          </h3>
          <p className="reveal-item text-gray-500 text-lg" style={{ transitionDelay: '200ms' }}>
            Apapun jenis usaha Anda, Katalogi memiliki struktur dan desain yang disesuaikan untuk memaksimalkan penjualan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {showcases.map((item, i) => {
            const theme = item.themeConfig as { primaryColor?: string } | null
            const primaryColor = theme?.primaryColor || '#9819ff'
            
            return (
              <Link 
                href={`/${item.slug}`}
                key={item.id} 
                className="reveal-item group bg-white rounded-4xl p-4 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2"
                style={{ transitionDelay: `${((i % 3) + 1) * 100 + 200}ms` }}
              >
                <div 
                  className="relative aspect-4/3 rounded-2xl overflow-hidden mb-6 flex items-center justify-center transition-transform duration-700 group-hover:scale-[1.02]"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <div className="text-indigo-200 opacity-50" style={{ color: primaryColor }}>
                    <svg className="w-24 h-24 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v16H4z" opacity=".2"/><path d="M4 2h16c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm0 2v16h16V4H4zm10 4h4v4h-4zM6 8h4v4H6zm0 6h4v4H6zm10 0h4v4h-4z"/></svg>
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                      Lihat Web
                    </span>
                  </div>
                </div>
                <div className="px-2 pb-2">
                  <h4 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                    {item.description || 'Katalog Digital'}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </ScrollRevealWrapper>
  )
}
