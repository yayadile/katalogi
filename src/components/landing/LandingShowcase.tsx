'use client'

import { useState, useRef, useCallback } from 'react'
import { FULL_TEMPLATES, WebsiteTemplate } from '@/lib/templates'
import ScrollRevealWrapper from './ScrollRevealWrapper'
import TemplatePreview from './TemplatePreview'
import TemplatePreviewModal from './TemplatePreviewModal'

function TiltCard({
  template,
  index,
  onClick,
}: {
  template: WebsiteTemplate
  index: number
  onClick: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current
    const glow = glowRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const tiltX = (y - 0.5) * -16
    const tiltY = (x - 0.5) * 16
    el.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`
    el.style.boxShadow = `${(x - 0.5) * 24}px ${(y - 0.5) * 24}px 48px rgba(0,0,0,0.10)`
    if (glow) {
      glow.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(152,25,255,0.08), transparent 60%)`
      glow.style.opacity = '1'
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current
    const glow = glowRef.current
    if (!el) return
    el.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    el.style.boxShadow = ''
    if (glow) glow.style.opacity = '0'
  }, [])

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick() }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      className="relative text-left w-full group focus:outline-none rounded-2xl cursor-pointer aspect-[3/4] sm:aspect-[4/5]"
      style={{ transformStyle: 'preserve-3d', transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out' }}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5 relative h-full flex flex-col">
        <div ref={glowRef} className="absolute inset-0 z-20 pointer-events-none opacity-0 transition-opacity duration-300" />
        <div className="h-1.5 shrink-0" style={{ backgroundColor: template.themeConfig.primaryColor }} />
        <div className="overflow-hidden bg-gray-100 flex-1 relative">
          <div className="absolute inset-0">
            <TemplatePreview template={template} />
          </div>
        </div>
        <div className="px-5 py-4 flex items-center justify-between relative z-10 bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-sm"
              style={{ backgroundColor: template.themeConfig.primaryColor }}
            />
            <span className="font-semibold text-gray-900">{template.name}</span>
          </div>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {template.blocks.length} blok
          </span>
        </div>
      </div>
    </div>
  )
}

export default function LandingShowcase() {
  const [modalIndex, setModalIndex] = useState<number | null>(null)
  const templates = FULL_TEMPLATES.filter(t => t.id !== 'blank')

  if (templates.length === 0) return null

  return (
    <>
      <ScrollRevealWrapper id="showcase" className="py-24 md:py-32 bg-gray-50 border-y border-gray-100 overflow-hidden relative">
        <div className="absolute inset-0 grid-overlay opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
            <h2 className="reveal-item text-sm font-black text-indigo-600 uppercase tracking-widest mb-3">
              Galeri Template
            </h2>
            <h3 className="reveal-item text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Pilih Template Favoritmu
            </h3>
            <p className="reveal-item text-gray-500 text-lg">
              Klik untuk melihat detail dan mencoba template.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto perspective-[1200px]">
            {templates.map((template, i) => (
              <div
                key={template.id}
                className="reveal-item"
                style={{ transitionDelay: `${((i % 2) + 1) * 100 + 200}ms` }}
              >
                <TiltCard
                  template={template}
                  index={i}
                  onClick={() => setModalIndex(i)}
                />
              </div>
            ))}
          </div>
        </div>
      </ScrollRevealWrapper>

      {modalIndex !== null && (
        <TemplatePreviewModal
          templates={templates}
          initialIndex={modalIndex}
          onClose={() => setModalIndex(null)}
        />
      )}
    </>
  )
}
