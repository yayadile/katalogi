import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FULL_TEMPLATES } from '@/lib/templates'
import ScrollRevealWrapper from './ScrollRevealWrapper'

export default function LandingShowcase() {
  const templates = FULL_TEMPLATES.filter(t => t.id !== 'blank')

  if (templates.length === 0) return null

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
            Pilih template favorit Anda, lalu kustomisasi semudah drag-and-drop.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {templates.map((template, i) => (
            <Link
              href="/dashboard/create"
              key={template.id}
              className="reveal-item group bg-white rounded-4xl p-4 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2"
              style={{ transitionDelay: `${((i % 3) + 1) * 100 + 200}ms` }}
            >
              <div
                className="relative aspect-4/3 rounded-2xl overflow-hidden mb-6 transition-transform duration-700 group-hover:scale-[1.02]"
                style={{ backgroundColor: `${template.themeConfig.primaryColor}15` }}
              >
                {template.image && (
                  <Image
                    src={template.image}
                    alt={template.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                    Pakai Template
                  </span>
                </div>
              </div>
              <div className="px-2 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: template.themeConfig.primaryColor }} />
                  <h4 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {template.name}
                  </h4>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {template.description}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                    {template.blocks.length} blok
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ScrollRevealWrapper>
  )
}
