'use server'

import { prisma } from '@/lib/prisma'
import { type ActionResult } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import type { PageBlock, BlockType, Prisma } from '@prisma/client'

// ─── Add Page Block ───────────────────────────────────────────────────────────

const defaultContent: Record<string, Record<string, unknown>> = {
  HERO: { headline: 'Judul Baru', subtext: 'Deskripsi singkat', ctaText: 'Mulai', bgImage: '' },
  CATALOG: { title: 'Produk', items: [] },
  CONTACT: { title: 'Hubungi Kami', email: '', whatsapp: '', address: '' },
  TEXT: { text: '', html: '<p>Tulis konten Anda di sini</p>' },
  GALLERY: { title: 'Galeri', images: [] },
  // Structure
  DIV: { style: {} },
  CMS: { collectionId: '' },
  COLUMN: { columns: 2, gap: 4 },
  GRID: { columns: 3, gap: 4 },
  CONTAINER: { style: { padding: '20px', backgroundColor: '#ffffff' }, label: 'Container' },
  LINK_BLOCK: { url: '#', target: '_self' },
  LIST: { items: ['Item 1', 'Item 2', 'Item 3'] },
  // Typography
  HEADING: { text: 'Headline Baru', level: 1 },
  PARAGRAPH: { text: 'Ini adalah paragraf baru. Anda dapat mengubah teks ini sesuai kebutuhan.' },
  QUOTE: { text: 'Kutipan inspiratif di sini.', author: 'Nama Penulis' },
  BUTTON: { text: 'Klik Disini', url: '#', target: '_self', variant: 'solid' },
  // Media
  VIDEO: { url: '', platform: 'youtube' },
}

export async function addPageBlock(
  websiteId: string,
  type: BlockType,
  sortOrder: number,
  initialContent?: Record<string, unknown>,
  pageId?: string,
  id?: string
): Promise<ActionResult<PageBlock>> {
  try {
    const targetPageId = pageId || websiteId
    const data: Prisma.PageBlockCreateInput = {
      websiteId,
      pageId: targetPageId,
      type,
      content: (initialContent || defaultContent[type]) as Prisma.InputJsonObject,
      sortOrder,
    }
    if (id) {
      data.id = id
    }
    
    const block = await prisma.pageBlock.create({
      data,
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
  contentJSON: Record<string, unknown>,
  positionJSON?: Record<string, unknown>
): Promise<ActionResult<PageBlock>> {
  try {
    const dataToUpdate: Prisma.PageBlockUpdateInput = { content: contentJSON as Prisma.InputJsonObject }
    if (positionJSON) {
      dataToUpdate.position = positionJSON as Prisma.InputJsonObject
    }
    const block = await prisma.pageBlock.update({
      where: { id: blockId },
      data: dataToUpdate,
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
