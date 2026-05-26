import { notFound, redirect } from 'next/navigation'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import EditorClient from '@/components/editor/EditorClient'
import type { BlockType } from '@prisma/client'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  console.log("generateMetadata executing for id:", id)
  const website = await prisma.website.findUnique({ where: { id }, select: { title: true } })
  console.log("generateMetadata found website:", !!website)
  return { title: website ? `Edit: ${website.title} — Katalogi` : 'Editor — Katalogi' }
}

export default async function EditPage({ params }: Props) {
  const session = await requireAuth()
  const { id } = await params

  console.log("EditPage executing for id:", id)

  const website = await prisma.website.findUnique({
    where: { id },
    include: {
      pages: {
        orderBy: { sortOrder: 'asc' },
        include: { blocks: { orderBy: { sortOrder: 'asc' } } }
      }
    },
  })
  
  console.log("Website found:", !!website)

  if (!website) notFound()
  if (website.userId !== session.userId) redirect('/dashboard')

  type ThemeConfig = {
    primaryColor: string
    secondaryColor: string
    backgroundColor?: string
    buttonStyle?: 'sharp' | 'rounded' | 'pill'
    fontFamily: string
    headingFont?: string
  }

  const theme = (website.themeConfig as ThemeConfig) ?? {
    primaryColor: '#8b5cf6',
    secondaryColor: '#1e293b',
    backgroundColor: '#ffffff',
    buttonStyle: 'rounded',
    fontFamily: 'Inter',
    headingFont: 'Inter',
  }

  const firstPage = website.pages[0]
  const initialBlocks = firstPage ? firstPage.blocks.map((b) => ({
    id: b.id,
    type: b.type as BlockType,
    content: b.content as Record<string, unknown>,
    sortOrder: b.sortOrder,
    parentId: b.parentId,
  })) : []

  const initialPages = website.pages.map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    sortOrder: p.sortOrder,
  }))

  return (
    <EditorClient
      websiteId={website.id}
      userId={session.userId}
      websiteTitle={website.title}
      websiteSlug={website.slug}
      isPublished={website.isPublished}
      initialBlocks={initialBlocks}
      initialTheme={theme}
      initialPages={initialPages}
      initialPageId={firstPage?.id}
    />
  )
}
