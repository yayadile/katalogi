import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import type { BlockType } from '@prisma/client'
import Link from 'next/link'

import HeroBlock from '@/components/blocks/HeroBlock'
import CatalogBlock from '@/components/blocks/CatalogBlock'
import ContactBlock from '@/components/blocks/ContactBlock'
import TextBlock from '@/components/blocks/TextBlock'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

type Props = {
  params: Promise<{ slug: string; pageSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, pageSlug } = await params
  const website = await prisma.website.findUnique({
    where: { slug, isPublished: true },
    select: { title: true, description: true, slug: true },
  })
  if (!website) return { title: 'Halaman Tidak Ditemukan' }
  return {
    title: `${website.title} - ${pageSlug}`,
    description: website.description ?? '',
  }
}

export default async function PublishedPage({ params }: Props) {
  const { slug, pageSlug } = await params

  const website = await prisma.website.findUnique({
    where: { slug },
    include: {
      pages: {
        orderBy: { sortOrder: 'asc' },
        include: { blocks: { orderBy: { sortOrder: 'asc' } } }
      }
    },
  })

  if (!website || !website.isPublished) notFound()

  const page = website.pages.find(p => p.slug === pageSlug)
  if (!page) notFound()

  const theme = (website.themeConfig as Record<string, string>) ?? {}
  const primaryColor = theme.primaryColor ?? '#9819ff'
  const secondaryColor = theme.secondaryColor ?? '#1e293b'
  const fontFamily = theme.fontFamily ?? 'Inter'
  const headingFont = theme.headingFont ?? fontFamily

  return (
    <main
      className="published-content"
      style={{
        '--primary-color': primaryColor,
        fontFamily: `'${fontFamily}', sans-serif`,
        backgroundColor: theme.backgroundColor || '#F8FAFC',
        minHeight: '100vh',
      } as React.CSSProperties}
    >
      {website.pages.length > 1 && (
        <nav className="flex items-center justify-center gap-4 py-4 px-6 border-b border-slate-200/50 bg-white/80 sticky top-0 z-50 backdrop-blur-sm">
          {website.pages.map((p) => (
            <Link
              key={p.id}
              href={`/${website.slug}/${p.slug}`}
              className={`text-sm font-semibold transition-colors uppercase tracking-wider ${p.slug === pageSlug ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
            >
              {p.title}
            </Link>
          ))}
        </nav>
      )}

      {page.blocks.map((block) => {
        const content = block.content as Record<string, unknown>
        switch (block.type as BlockType) {
          case 'HERO':
            return <HeroBlock key={block.id} content={content as Parameters<typeof HeroBlock>[0]['content']} theme={{ ...theme, primaryColor, secondaryColor }} />
          case 'CATALOG':
            return <CatalogBlock key={block.id} content={content as Parameters<typeof CatalogBlock>[0]['content']} theme={{ ...theme, primaryColor, secondaryColor }} />
          case 'CONTACT':
            return <ContactBlock key={block.id} content={content as Parameters<typeof ContactBlock>[0]['content']} theme={{ ...theme, primaryColor, secondaryColor }} />
          case 'TEXT':
            return <TextBlock key={block.id} content={content as Parameters<typeof TextBlock>[0]['content']} theme={{ ...theme, primaryColor, secondaryColor }} />
          default:
            return null
        }
      })}

      <footer className="py-6 text-center border-t border-slate-200/50">
        <Link href="/" className="inline-flex items-center gap-1.5 text-slate-400 text-xs hover:text-slate-600">
          <span className="w-4 h-4 rounded flex items-center justify-center text-[9px] text-white font-bold" style={{ backgroundColor: primaryColor }}>K</span>
          Dibuat dengan <strong className="text-slate-600">Katalogi</strong>
        </Link>
      </footer>
    </main>
  )
}
