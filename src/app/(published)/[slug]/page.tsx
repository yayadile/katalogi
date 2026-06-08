import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import Link from 'next/link'

import PageViewTracker from '@/components/published/PageViewTracker'
import StoreShell from '@/components/published/StoreShell'
import { renderBlocks, type PublishedBlock, type PublishedTheme } from '@/components/published/renderBlocks'

// ISR: revalidate every 60 seconds
export const revalidate = 30

export const dynamic = 'force-dynamic';
export const dynamicParams = true; 


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
  secondaryColor?: string
  backgroundColor?: string
  buttonStyle?: 'sharp' | 'rounded' | 'pill'
  fontFamily?: string
  headingFont?: string
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
      pages: {
        orderBy: { sortOrder: 'asc' },
        include: { blocks: { orderBy: { sortOrder: 'asc' } } }
      }
    },
  })

  if (!website || !website.isPublished) {
    notFound()
  }

  const theme = (website.themeConfig as ThemeConfig) ?? {}
  const primaryColor = theme.primaryColor ?? '#9819ff'
  const secondaryColor = theme.secondaryColor ?? '#1e293b'
  const fontFamily = theme.fontFamily ?? 'Inter'
  const headingFont = theme.headingFont ?? fontFamily

  const currentPage = website.pages[0]
  const allBlocks = (currentPage?.blocks || []) as PublishedBlock[]

  // Find a CONTACT block for JSON-LD + WhatsApp ordering number
  const contactBlock = allBlocks.find((b) => b.type === 'CONTACT')
  const contactContent = contactBlock
    ? (contactBlock.content as { email?: string; address?: string; whatsapp?: string })
    : undefined
  const jsonLd = buildJsonLd(website, contactContent)

  const publishedTheme: PublishedTheme = { ...theme, primaryColor, secondaryColor, fontFamily }

  return (
    <>
      <PageViewTracker websiteId={website.id} />
      
      {/* JSON-LD */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Dynamic Font Injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap');
        ${headingFont !== fontFamily ? `@import url('https://fonts.googleapis.com/css2?family=${headingFont.replace(/\s+/g, '+')}:wght@500;600;700;800&display=swap');` : ''}

        .published-content h1, .published-content h2, .published-content h3, .published-content h4 {
          font-family: "${headingFont}", sans-serif !important;
        }
      `}</style>

      <main
        className="published-content"
        style={
          {
            '--primary-color': primaryColor,
            '--font-family': `'${fontFamily}', sans-serif`,
            fontFamily: `'${fontFamily}', sans-serif`,
            backgroundColor: theme.backgroundColor || '#F8FAFC',
            minHeight: '100vh',
          } as React.CSSProperties
        }
      >
        {website.pages.length > 1 && (
          <nav className="flex items-center justify-center gap-4 py-4 px-6 border-b border-slate-200/50 bg-white/80 sticky top-0 z-50 backdrop-blur-sm">
            {website.pages.map((page) => {
              const isActive = website.pages[0]?.id === page.id
              return (
                <Link
                  key={page.id}
                  href={`/${website.slug}/${page.slug}`}
                  className={`text-sm font-semibold transition-colors uppercase tracking-wider ${isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
                >
                  {page.title}
                </Link>
              )
            })}
          </nav>
        )}

        <StoreShell
          whatsapp={contactContent?.whatsapp}
          storeName={website.title}
          primaryColor={primaryColor}
        >
          {renderBlocks(allBlocks, publishedTheme, {
            whatsapp: contactContent?.whatsapp,
            storeName: website.title,
          })}
        </StoreShell>

        {/* Footer badge */}
        <footer 
          className="py-6 text-center border-t border-slate-200/50"
          style={{ backgroundColor: theme.backgroundColor || '#F8FAFC' }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-slate-400 text-xs hover:text-slate-600 transition-colors"
          >
            <span className="w-4 h-4 rounded flex items-center justify-center text-[9px] text-white font-bold" style={{ backgroundColor: primaryColor }}>K</span>
            Dibuat dengan <strong className="text-slate-600">Katalogi</strong>
          </Link>
        </footer>
      </main>
    </>
  )
}
