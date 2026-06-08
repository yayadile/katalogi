import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import Link from 'next/link'

import { renderBlocks, type PublishedBlock, type PublishedTheme } from '@/components/published/renderBlocks'
import StoreShell from '@/components/published/StoreShell'

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

  const allBlocks = (page.blocks || []) as PublishedBlock[]
  const contactBlock = allBlocks.find((b) => b.type === 'CONTACT')
  const contactWhatsapp = contactBlock
    ? (contactBlock.content as { whatsapp?: string }).whatsapp
    : undefined

  const publishedTheme: PublishedTheme = { ...theme, primaryColor, secondaryColor, fontFamily }

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

      <StoreShell whatsapp={contactWhatsapp} storeName={website.title} primaryColor={primaryColor}>
        {renderBlocks(allBlocks, publishedTheme, {
          whatsapp: contactWhatsapp,
          storeName: website.title,
        })}
      </StoreShell>

      <footer className="py-6 text-center border-t border-slate-200/50">
        <Link href="/" className="inline-flex items-center gap-1.5 text-slate-400 text-xs hover:text-slate-600">
          <span className="w-4 h-4 rounded flex items-center justify-center text-[9px] text-white font-bold" style={{ backgroundColor: primaryColor }}>K</span>
          Dibuat dengan <strong className="text-slate-600">Katalogi</strong>
        </Link>
      </footer>
    </main>
  )
}
