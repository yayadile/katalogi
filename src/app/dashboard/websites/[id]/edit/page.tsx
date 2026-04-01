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
  const website = await prisma.website.findUnique({ where: { id }, select: { title: true } })
  return { title: website ? `Edit: ${website.title} — Katalogi` : 'Editor — Katalogi' }
}

export default async function EditPage({ params }: Props) {
  const session = await requireAuth()
  const { id } = await params

  const website = await prisma.website.findUnique({
    where: { id },
    include: { blocks: { orderBy: { sortOrder: 'asc' } } },
  })

  if (!website) notFound()
  if (website.userId !== session.userId) redirect('/dashboard')

  type ThemeConfig = {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
  }

  const theme = (website.themeConfig as ThemeConfig) ?? {
    primaryColor: '#8b5cf6',
    secondaryColor: '#1e293b',
    fontFamily: 'Inter',
  }

  const initialBlocks = website.blocks.map((b) => ({
    id: b.id,
    type: b.type as BlockType,
    content: b.content as Record<string, unknown>,
    sortOrder: b.sortOrder,
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
    />
  )
}
