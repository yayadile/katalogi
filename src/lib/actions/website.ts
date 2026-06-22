'use server'

import { prisma } from '@/lib/prisma'
import { websiteSchema, themeConfigSchema, type ActionResult } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import type { Website, PageBlock, Prisma, BlockType, Page } from '@prisma/client'
import { FULL_TEMPLATES } from '@/lib/templates'

// ─── Create Website ───────────────────────────────────────────────────────────

export async function createWebsite(
  userId: string,
  data: { slug: string; title: string; description?: string; templateId?: string }
): Promise<ActionResult<Website>> {
  const parsed = websiteSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  try {
    const existing = await prisma.website.findUnique({ where: { slug: parsed.data.slug } })
    if (existing) {
      return { success: false, error: 'Slug sudah digunakan. Pilih slug lain.' }
    }

    const template = FULL_TEMPLATES.find(t => t.id === data.templateId) || FULL_TEMPLATES[0]

    const website = await prisma.website.create({
      data: {
        userId,
        slug: parsed.data.slug,
        title: parsed.data.title,
        description: parsed.data.description,
        themeConfig: template.themeConfig,
      },
    })

    const page = await prisma.page.create({
      data: {
        websiteId: website.id,
        slug: 'home',
        title: 'Beranda',
        sortOrder: 0,
      }
    })

    if (template.blocks.length > 0) {
      await prisma.pageBlock.createMany({
        data: template.blocks.map((block, idx) => ({
          pageId: page.id,
          websiteId: website.id,
          type: block.type as unknown as BlockType,
          content: block.content as Prisma.InputJsonObject,
          sortOrder: idx,
          position: { x: 0, y: idx * 500, width: '100%', height: 'auto', zIndex: idx + 1 } as Prisma.InputJsonObject
        }))
      })
    }

    revalidatePath('/dashboard')
    return { success: true, data: website }
  } catch (e) {
    console.error(e)
    return { success: false, error: 'Gagal membuat website.' }
  }
}

// ─── Get User's Websites ──────────────────────────────────────────────────────

export async function getUserWebsites(userId: string): Promise<ActionResult<Website[]>> {
  try {
    const websites = await prisma.website.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, data: websites }
  } catch (e) {
    console.error(e)
    return { success: false, error: 'Gagal mengambil data website.' }
  }
}

// ─── Get Website With Blocks ──────────────────────────────────────────────────

export async function getWebsiteWithBlocks(
  websiteId: string
): Promise<ActionResult<Website & { pages: (Page & { blocks: PageBlock[] })[] }>> {
  try {
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: {
        pages: {
          orderBy: { sortOrder: 'asc' },
          include: { blocks: { orderBy: { sortOrder: 'asc' } } }
        }
      },
    })
    if (!website) return { success: false, error: 'Website tidak ditemukan.' }
    return { success: true, data: website }
  } catch (e) {
    console.error(e)
    return { success: false, error: 'Gagal mengambil data website.' }
  }
}

// ─── Update Website ───────────────────────────────────────────────────────────

export async function updateWebsite(
  websiteId: string,
  userId: string,
  data: Partial<{ slug: string; title: string; description: string }>
): Promise<ActionResult<Website>> {
  const website = await prisma.website.findUnique({ where: { id: websiteId } })
  if (!website || website.userId !== userId) {
    return { success: false, error: 'Tidak diizinkan.' }
  }

  try {
    const updated = await prisma.website.update({
      where: { id: websiteId },
      data,
    })
    revalidatePath(`/dashboard/websites/${websiteId}/edit`)
    revalidatePath(`/${updated.slug}`)
    return { success: true, data: updated }
  } catch (e) {
    console.error(e)
    return { success: false, error: 'Gagal memperbarui website.' }
  }
}

// ─── Update Theme Config ──────────────────────────────────────────────────────

export async function updateThemeConfig(
  websiteId: string,
  userId: string,
  themeData: {
    primaryColor?: string
    secondaryColor?: string
    backgroundColor?: string
    buttonStyle?: 'sharp' | 'rounded' | 'pill'
    fontFamily?: string
    headingFont?: string
  }
): Promise<ActionResult<Website>> {
  const website = await prisma.website.findUnique({ where: { id: websiteId } })
  if (!website || website.userId !== userId) {
    return { success: false, error: 'Tidak diizinkan.' }
  }

  const parsed = themeConfigSchema.safeParse(themeData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  try {
    const currentTheme = (website.themeConfig as Record<string, string>) ?? {}
    const updated = await prisma.website.update({
      where: { id: websiteId },
      data: { themeConfig: { ...currentTheme, ...parsed.data } },
    })
    revalidatePath(`/dashboard/websites/${websiteId}/edit`)
    revalidatePath(`/${updated.slug}`)
    return { success: true, data: updated }
  } catch (e) {
    console.error(e)
    return { success: false, error: 'Gagal memperbarui tema.' }
  }
}

// ─── Delete Website ───────────────────────────────────────────────────────────

export async function deleteWebsite(
  websiteId: string,
  userId: string
): Promise<ActionResult> {
  const website = await prisma.website.findUnique({ where: { id: websiteId } })
  if (!website || website.userId !== userId) {
    return { success: false, error: 'Tidak diizinkan.' }
  }

  try {
    await prisma.website.delete({ where: { id: websiteId } })
    revalidatePath('/dashboard')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { success: false, error: 'Gagal menghapus website.' }
  }
}

// ─── Publish / Unpublish Website ──────────────────────────────────────────────

export async function publishWebsite(
  websiteId: string,
  userId: string,
  isPublished: boolean
): Promise<ActionResult<Website>> {
  const website = await prisma.website.findUnique({ where: { id: websiteId } })
  if (!website || website.userId !== userId) {
    return { success: false, error: 'Tidak diizinkan.' }
  }

  if (isPublished) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tier: true },
    })
    if (user?.tier === 'FREE') {
      const publishedCount = await prisma.website.count({
        where: { userId, isPublished: true, id: { not: websiteId } },
      })
      if (publishedCount >= 1) {
        return { success: false, error: 'FREE_TIER_MAX_PUBLISHED' }
      }
    }
  }

  try {
    const updated = await prisma.website.update({
      where: { id: websiteId },
      data: { isPublished },
    })
    revalidatePath(`/${updated.slug}`)
    revalidatePath('/dashboard')
    return { success: true, data: updated }
  } catch (e) {
    console.error(e)
    return { success: false, error: 'Gagal mengubah status publish.' }
  }
}
