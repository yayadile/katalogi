import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import type { BlockType } from '@prisma/client'


import HeroBlock from '@/components/blocks/HeroBlock'
import CatalogBlock from '@/components/blocks/CatalogBlock'
import ContactBlock from '@/components/blocks/ContactBlock'
import TextBlock from '@/components/blocks/TextBlock'

// ISR: revalidate every 60 seconds
export const revalidate = 60

export const dynamic = 'force-dynamic';

// ─── Static Params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const websites = await prisma.website.findMany({
    where: { isPublished: true },
    select: { slug: true },
  })
  return websites.map((w) => ({ slug: w.slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const website = await prisma.website.findUnique({
    where: { slug, isPublished: true },
    select: { title: true, description: true, slug: true },
  })

  if (!website) return { title: 'Halaman Tidak Ditemukan' }

  return {
    title: website.title,
    description: website.description ?? `Website ${website.title} dibuat dengan Katalogi.`,
    openGraph: {
      title: website.title,
      description: website.description ?? '',
      url: `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/${website.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: website.title,
      description: website.description ?? '',
    },
  }
}

// ─── Block Renderer ───────────────────────────────────────────────────────────

type ThemeConfig = {
  primaryColor?: string
  fontFamily?: string
  secondaryColor?: string
}

// JSON-LD for LocalBusiness (if CONTACT block exists)
function buildJsonLd(
  website: { title: string; slug: string },
  contactContent?: { email?: string; address?: string; whatsapp?: string }
) {
  if (!contactContent) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: website.title,
    email: contactContent.email ?? undefined,
    address: contactContent.address
      ? { '@type': 'PostalAddress', streetAddress: contactContent.address }
      : undefined,
    telephone: contactContent.whatsapp ?? undefined,
    url: `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/${website.slug}`,
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PublishedPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const website = await prisma.website.findUnique({
    where: { slug },
    include: {
      blocks: { orderBy: { sortOrder: 'asc' } },
    },
  })

  if (!website || !website.isPublished) {
    notFound()
  }

  const theme = (website.themeConfig as ThemeConfig) ?? {}
  const primaryColor = theme.primaryColor ?? '#8b5cf6'
  const fontFamily = theme.fontFamily ?? 'Inter'

  // Find a CONTACT block for JSON-LD
  const contactBlock = website.blocks.find((b) => b.type === 'CONTACT')
  const jsonLd = buildJsonLd(
    website,
    contactBlock ? (contactBlock.content as { email?: string; address?: string; whatsapp?: string }) : undefined
  )

  return (
    <>
      {/* JSON-LD */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <main
        style={
          {
            '--primary-color': primaryColor,
            '--font-family': `'${fontFamily}', sans-serif`,
            fontFamily: `'${fontFamily}', sans-serif`,
          } as React.CSSProperties
        }
      >
        {website.blocks.map((block) => {
          const content = block.content as Record<string, unknown>

          switch (block.type as BlockType) {
            case 'HERO':
              return (
                <HeroBlock
                  key={block.id}
                  content={content as Parameters<typeof HeroBlock>[0]['content']}
                  primaryColor={primaryColor}
                />
              )
            case 'CATALOG':
              return (
                <CatalogBlock
                  key={block.id}
                  content={content as Parameters<typeof CatalogBlock>[0]['content']}
                  primaryColor={primaryColor}
                />
              )
            case 'CONTACT':
              return (
                <ContactBlock
                  key={block.id}
                  content={content as Parameters<typeof ContactBlock>[0]['content']}
                  primaryColor={primaryColor}
                />
              )
            case 'TEXT':
              return (
                <TextBlock
                  key={block.id}
                  content={content as Parameters<typeof TextBlock>[0]['content']}
                  primaryColor={primaryColor}
                />
              )
            default:
              return null
          }
        })}

        {/* Footer badge */}
        <footer className="py-6 text-center border-t border-slate-100 bg-slate-50">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-slate-400 text-xs hover:text-slate-600 transition-colors"
          >
            <span className="w-4 h-4 bg-indigo-500 rounded flex items-center justify-center text-[9px] text-white font-bold">K</span>
            Dibuat dengan <strong className="text-slate-600">Katalogi</strong>
          </a>
        </footer>
      </main>
    </>
  )
}
