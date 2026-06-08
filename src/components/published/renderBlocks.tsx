import React from 'react'
import type { BlockType } from '@prisma/client'

import HeroBlock from '@/components/blocks/HeroBlock'
import CatalogBlock from '@/components/blocks/CatalogBlock'
import ContactBlock from '@/components/blocks/ContactBlock'
import TextBlock from '@/components/blocks/TextBlock'
import { HeadingBlock, ParagraphBlock, QuoteBlock } from '@/components/blocks/TypographyBlocks'
import { ListBlock, LinkBlock, ButtonBlock, CMSBlock, DivBlock } from '@/components/blocks/StructureBlocks'
import { VideoBlock, GalleryBlock } from '@/components/blocks/MediaBlocks'

// ─── Types ──────────────────────────────────────────────────────────────────

export type PublishedBlock = {
  id: string
  type: BlockType
  content: Record<string, unknown>
  sortOrder: number
  parentId?: string | null
}

export type PublishedTheme = {
  primaryColor?: string
  secondaryColor?: string
  backgroundColor?: string
  buttonStyle?: 'sharp' | 'rounded' | 'pill'
  fontFamily?: string
  headingFont?: string
}

export type StoreInfo = {
  /** Owner WhatsApp number used by catalog "Beli" buttons (format: 628xxxxxxxxxx) */
  whatsapp?: string
  /** Store / website title, included in the WhatsApp order template */
  storeName?: string
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Renders every saved block (all 17 BlockTypes) for a published page,
 * resolving parent/child nesting. This mirrors what the editor lets users
 * build, so the live site is never empty when non-default blocks are used.
 */
export function renderBlocks(
  blocks: PublishedBlock[],
  theme: PublishedTheme,
  store: StoreInfo = {}
): React.ReactNode {
  const roots = blocks
    .filter((b) => !b.parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  return roots.map((block) => renderBlock(block, blocks, theme, store))
}

// ─── Internals ──────────────────────────────────────────────────────────────

function renderBlock(
  block: PublishedBlock,
  all: PublishedBlock[],
  theme: PublishedTheme,
  store: StoreInfo
): React.ReactNode {
  const primaryColor = theme.primaryColor ?? '#9819ff'
  const secondaryColor = theme.secondaryColor ?? '#1e293b'
  const fontFamily = theme.fontFamily ?? 'Inter'

  const fullTheme = {
    ...theme,
    primaryColor,
    secondaryColor,
    fontFamily,
  }

  const content = block.content as Record<string, unknown>

  const children = all
    .filter((b) => b.parentId === block.id)
    .sort((a, b) => a.sortOrder - b.sortOrder)
  const childNodes = children.map((c) => renderBlock(c, all, theme, store))

  switch (block.type as BlockType) {
    case 'HERO':
      return (
        <HeroBlock
          key={block.id}
          content={content as Parameters<typeof HeroBlock>[0]['content']}
          theme={fullTheme}
        />
      )

    case 'CATALOG':
      return (
        <CatalogBlock
          key={block.id}
          content={content as Parameters<typeof CatalogBlock>[0]['content']}
          theme={fullTheme}
          whatsapp={(content.whatsapp as string) || store.whatsapp}
          storeName={store.storeName}
        />
      )

    case 'CONTACT':
      return (
        <ContactBlock
          key={block.id}
          content={content as Parameters<typeof ContactBlock>[0]['content']}
          theme={fullTheme}
        />
      )

    case 'TEXT':
      return (
        <TextBlock
          key={block.id}
          content={content as Parameters<typeof TextBlock>[0]['content']}
          theme={fullTheme}
        />
      )

    case 'GALLERY':
      return (
        <GalleryBlock
          key={block.id}
          content={content as Parameters<typeof GalleryBlock>[0]['content']}
        />
      )

    case 'VIDEO':
      return (
        <VideoBlock
          key={block.id}
          content={content as Parameters<typeof VideoBlock>[0]['content']}
        />
      )

    case 'HEADING':
      return (
        <HeadingBlock
          key={block.id}
          content={content as Parameters<typeof HeadingBlock>[0]['content']}
          theme={fullTheme}
        />
      )

    case 'PARAGRAPH':
      return (
        <ParagraphBlock
          key={block.id}
          content={content as Parameters<typeof ParagraphBlock>[0]['content']}
          theme={fullTheme}
        />
      )

    case 'QUOTE':
      return (
        <QuoteBlock
          key={block.id}
          content={content as Parameters<typeof QuoteBlock>[0]['content']}
          theme={fullTheme}
        />
      )

    case 'LIST':
      return (
        <ListBlock
          key={block.id}
          content={content as Parameters<typeof ListBlock>[0]['content']}
          theme={fullTheme}
        />
      )

    case 'BUTTON':
      return (
        <ButtonBlock
          key={block.id}
          content={content as Parameters<typeof ButtonBlock>[0]['content']}
          theme={fullTheme}
        />
      )

    case 'CMS':
      return <CMSBlock key={block.id} />

    case 'LINK_BLOCK':
      return (
        <LinkBlock
          key={block.id}
          content={content as Parameters<typeof LinkBlock>[0]['content']}
        >
          {childNodes.length > 0 ? childNodes : undefined}
        </LinkBlock>
      )

    case 'DIV':
      return (
        <DivBlock
          key={block.id}
          content={content as Parameters<typeof DivBlock>[0]['content']}
        >
          {childNodes.length > 0 ? childNodes : undefined}
        </DivBlock>
      )

    case 'CONTAINER':
      return (
        <section
          key={block.id}
          style={(content.style as React.CSSProperties) || { padding: '20px' }}
        >
          {childNodes}
        </section>
      )

    case 'COLUMN':
    case 'GRID': {
      // Only render a real grid on the live site when it actually has children.
      if (childNodes.length === 0) return null
      const columns = Number(content.columns ?? (block.type === 'GRID' ? 3 : 2))
      const gap = Number(content.gap ?? 4) * 4
      return (
        <div
          key={block.id}
          className="py-4 px-4 w-full max-w-6xl mx-auto grid"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gap: `${gap}px`,
          }}
        >
          {childNodes}
        </div>
      )
    }

    default:
      return null
  }
}
