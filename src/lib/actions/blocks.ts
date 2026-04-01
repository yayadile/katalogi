'use server'

import { prisma } from '@/lib/prisma'
import { type ActionResult } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import type { PageBlock, BlockType } from '@prisma/client'

// ─── Add Page Block ───────────────────────────────────────────────────────────

const defaultContent: Record<BlockType, object> = {
  HERO: { headline: 'Judul Baru', subtext: 'Deskripsi singkat', ctaText: 'Mulai', bgImage: '' },
  CATALOG: { title: 'Produk', items: [] },
  CONTACT: { title: 'Hubungi Kami', email: '', whatsapp: '', address: '' },
  TEXT: { text: '', html: '<p>Tulis konten Anda di sini</p>' },
  GALLERY: { title: 'Galeri', images: [] },
}

export async function addPageBlock(
  websiteId: string,
  type: BlockType,
  sortOrder: number
): Promise<ActionResult<PageBlock>> {
  try {
    const block = await prisma.pageBlock.create({
      data: {
        websiteId,
        type,
        content: defaultContent[type],
        sortOrder,
      },
    })
    revalidatePath(`/dashboard/websites/${websiteId}/edit`)
    return { success: true, data: block }
  } catch (e) {
    console.error(e)
    return { success: false, error: 'Gagal menambahkan block.' }
  }
}

// ─── Update Page Block ────────────────────────────────────────────────────────

export async function updatePageBlock(
  blockId: string,
  contentJSON: Record<string, unknown>
): Promise<ActionResult<PageBlock>> {
  try {
    const block = await prisma.pageBlock.update({
      where: { id: blockId },
      data: { content: contentJSON as any },
    })
    revalidatePath(`/dashboard/websites/${block.websiteId}/edit`)

    // Revalidate the published page
    const website = await prisma.website.findUnique({ where: { id: block.websiteId } })
    if (website) revalidatePath(`/${website.slug}`)

    return { success: true, data: block }
  } catch (e) {
    console.error(e)
    return { success: false, error: 'Gagal memperbarui block.' }
  }
}

// ─── Delete Page Block ────────────────────────────────────────────────────────

export async function deletePageBlock(
  blockId: string
): Promise<ActionResult> {
  try {
    const block = await prisma.pageBlock.findUnique({ where: { id: blockId } })
    if (!block) return { success: false, error: 'Block tidak ditemukan.' }

    await prisma.pageBlock.delete({ where: { id: blockId } })

    revalidatePath(`/dashboard/websites/${block.websiteId}/edit`)
    const website = await prisma.website.findUnique({ where: { id: block.websiteId } })
    if (website) revalidatePath(`/${website.slug}`)

    return { success: true }
  } catch (e) {
    console.error(e)
    return { success: false, error: 'Gagal menghapus block.' }
  }
}

// ─── Reorder Blocks ───────────────────────────────────────────────────────────

export async function reorderBlocks(
  websiteId: string,
  orderedIds: string[]
): Promise<ActionResult> {
  try {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.pageBlock.update({
          where: { id },
          data: { sortOrder: index + 1 },
        })
      )
    )

    revalidatePath(`/dashboard/websites/${websiteId}/edit`)
    const website = await prisma.website.findUnique({ where: { id: websiteId } })
    if (website) revalidatePath(`/${website.slug}`)

    return { success: true }
  } catch (e) {
    console.error(e)
    return { success: false, error: 'Gagal mengubah urutan block.' }
  }
}
