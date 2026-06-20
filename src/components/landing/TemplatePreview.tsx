'use client'

import { useRef, useLayoutEffect, useState } from 'react'
import { WebsiteTemplate } from '@/lib/templates'
import HeroBlock from '@/components/blocks/HeroBlock'
import CatalogBlock from '@/components/blocks/CatalogBlock'
import TextBlock from '@/components/blocks/TextBlock'
import { HeadingBlock } from '@/components/blocks/TypographyBlocks'

const PREVIEW_WIDTH = 1024
const MAX_PAD = 20

function capPad(v: string | undefined): string | undefined {
  if (!v) return undefined
  const n = parseInt(v)
  return isNaN(n) ? v : `${Math.min(n, MAX_PAD)}px`
}

function compactContent(content: Record<string, unknown>): Record<string, unknown> {
  if (!content) return {}
  const styles = content.styles as Record<string, string> | undefined
  if (!styles) return content
  return {
    ...content,
    styles: {
      ...styles,
      paddingTop: capPad(styles.paddingTop),
      paddingBottom: capPad(styles.paddingBottom),
    },
  }
}

function InlineContact({ content: c = {} }: { content?: Record<string, unknown> }) {
  const title = c.title as string | undefined
  const email = c.email as string | undefined
  const phone = c.phone as string | undefined
  return (
    <div className="flex flex-col gap-0.5 px-4 py-4 text-xs" style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>
      {title && <span className="font-semibold">{title}</span>}
      {email && <span>{email}</span>}
      {phone && <span>{phone}</span>}
    </div>
  )
}

function CompactGallery({ content: c = {} }: { content?: Record<string, unknown> }) {
  const images = c.images as string[] | undefined
  if (!images || images.length === 0) return null
  return (
    <div className="flex gap-2 px-4 py-4">
      {images.slice(0, 3).map((src, i) => (
        <div key={i} className="flex-1 aspect-square bg-gray-100 rounded-lg" />
      ))}
    </div>
  )
}

export default function TemplatePreview({ template }: { template: WebsiteTemplate }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.4)

  useLayoutEffect(() => {
    if (!wrapperRef.current) return
    const w = wrapperRef.current.offsetWidth
    if (w === 0) return
    setScale(w / PREVIEW_WIDTH)
  }, [template])

  const theme = {
    primaryColor: template.themeConfig.primaryColor,
    secondaryColor: template.themeConfig.secondaryColor,
    fontFamily: template.themeConfig.fontFamily,
    backgroundColor: '#ffffff',
  }

  if (template.blocks.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-slate-50 text-slate-400 text-sm font-medium">
        Kanvas Kosong
      </div>
    )
  }

  const blocks = (
    <>
      {template.blocks.map((block, idx) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const content = compactContent(block.content as any) as any
        switch (block.type) {
          case 'HERO':     return <HeroBlock      key={idx} content={content} theme={theme} />
          case 'CATALOG':  return <CatalogBlock   key={idx} content={content} theme={theme} />
          case 'TEXT':     return <TextBlock      key={idx} content={content} theme={theme} />
          case 'HEADING':  return <HeadingBlock   key={idx} content={content} theme={theme} />
          case 'GALLERY':  return <CompactGallery key={idx} content={content} />
          case 'CONTACT':  return <InlineContact  key={idx} content={content} />
          default:         return null
        }
      })}
    </>
  )

  return (
    <div ref={wrapperRef} className="w-full h-full overflow-hidden">
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${PREVIEW_WIDTH}px`,
        }}
      >
        {blocks}
      </div>
    </div>
  )
}
