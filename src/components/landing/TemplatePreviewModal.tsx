'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { WebsiteTemplate } from '@/lib/templates'
import HeroBlock from '@/components/blocks/HeroBlock'
import CatalogBlock from '@/components/blocks/CatalogBlock'
import ContactBlock from '@/components/blocks/ContactBlock'
import TextBlock from '@/components/blocks/TextBlock'
import { HeadingBlock } from '@/components/blocks/TypographyBlocks'
import { GalleryBlock } from '@/components/blocks/MediaBlocks'

export default function TemplatePreviewModal({
  templates,
  initialIndex,
  onClose,
}: {
  templates: WebsiteTemplate[]
  initialIndex: number
  onClose: () => void
}) {
  const router = useRouter()
  const [index, setIndex] = useState(initialIndex)
  const [closing, setClosing] = useState(false)

  const goPrev = useCallback(() => setIndex(i => Math.max(0, i - 1)), [])
  const goNext = useCallback(() => setIndex(i => Math.min(templates.length - 1, i + 1)), [templates.length])

  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => onClose(), 200)
  }, [onClose])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleClose, goPrev, goNext])

  const template = templates[index]
  const theme = {
    primaryColor: template.themeConfig.primaryColor,
    secondaryColor: template.themeConfig.secondaryColor,
    fontFamily: template.themeConfig.fontFamily,
    backgroundColor: '#ffffff',
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${closing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`}
        onClick={handleClose}
      />

      <div className={`relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col ${closing ? 'animate-modal-close' : 'animate-modal-enter'}`}>
        <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="ml-3 text-xs font-medium text-gray-400 bg-white px-3 py-1.5 rounded-lg border border-gray-200 select-none">
              katalogi.app/preview
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-900">{template.name}</span>
            <button onClick={handleClose} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors" aria-label="Tutup">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          {template.blocks.map((block, idx) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const content = block.content as any
            switch (block.type) {
              case 'HERO':     return <HeroBlock    key={idx} content={content} theme={theme} />
              case 'CATALOG':  return <CatalogBlock key={idx} content={content} theme={theme} />
              case 'CONTACT':  return <ContactBlock key={idx} content={content} theme={theme} />
              case 'TEXT':     return <TextBlock    key={idx} content={content} theme={theme} />
              case 'HEADING':  return <HeadingBlock key={idx} content={content} theme={theme} />
              case 'GALLERY':  return <GalleryBlock key={idx} content={content} />
              default:         return null
            }
          })}
        </div>

        <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={goPrev} disabled={index === 0} className="p-2 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Sebelumnya">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-gray-500 min-w-[4rem] text-center tabular-nums">{index + 1} / {templates.length}</span>
            <button onClick={goNext} disabled={index === templates.length - 1} className="p-2 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Selanjutnya">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button onClick={() => router.push('/dashboard/create')} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-600/25 active:scale-95">
            Gunakan Template
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
