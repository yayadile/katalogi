'use client'

import type { BlockType } from '@prisma/client'
import type { EditorBlock } from './BlockNavigator'
import HeroBlock from '@/components/blocks/HeroBlock'
import CatalogBlock from '@/components/blocks/CatalogBlock'
import ContactBlock from '@/components/blocks/ContactBlock'
import TextBlock from '@/components/blocks/TextBlock'

const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  HERO: 'Hero',
  CATALOG: 'Katalog',
  CONTACT: 'Kontak',
  TEXT: 'Teks',
  GALLERY: 'Galeri',
}

const BLOCK_TYPE_COLORS: Record<BlockType, string> = {
  HERO: 'bg-violet-500',
  CATALOG: 'bg-blue-500',
  CONTACT: 'bg-green-500',
  TEXT: 'bg-slate-500',
  GALLERY: 'bg-orange-500',
}

function BlockWrapper({
  block,
  isSelected,
  onClick,
  primaryColor,
}: {
  block: EditorBlock
  isSelected: boolean
  onClick: () => void
  primaryColor: string
}) {
  const content = block.content

  const renderBlock = () => {
    switch (block.type as BlockType) {
      case 'HERO':
        return (
          <HeroBlock
            content={content as Parameters<typeof HeroBlock>[0]['content']}
            primaryColor={primaryColor}
            isEditing
          />
        )
      case 'CATALOG':
        return (
          <CatalogBlock
            content={content as Parameters<typeof CatalogBlock>[0]['content']}
            primaryColor={primaryColor}
          />
        )
      case 'CONTACT':
        return (
          <ContactBlock
            content={content as Parameters<typeof ContactBlock>[0]['content']}
            primaryColor={primaryColor}
          />
        )
      case 'TEXT':
        return (
          <TextBlock
            content={content as Parameters<typeof TextBlock>[0]['content']}
            primaryColor={primaryColor}
          />
        )
      default:
        return (
          <div className="p-8 text-center text-slate-400 bg-slate-100">
            Block type: {block.type}
          </div>
        )
    }
  }

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-200 rounded-lg overflow-hidden ${
        isSelected
          ? 'ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/20'
          : 'ring-1 ring-transparent hover:ring-slate-300 hover:shadow-md'
      }`}
      onClick={onClick}
    >
      {/* Type badge */}
      <div
        className={`absolute top-2 right-2 z-20 flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-white ${BLOCK_TYPE_COLORS[block.type as BlockType]} ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        } transition-opacity`}
      >
        {BLOCK_TYPE_LABELS[block.type as BlockType]}
      </div>

      {/* Click overlay */}
      {!isSelected && (
        <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 bg-indigo-500/5 transition-opacity" />
      )}

      {/* Block content — pointer-events-none so click goes to wrapper */}
      <div className="pointer-events-none select-none">{renderBlock()}</div>
    </div>
  )
}

type CanvasPreviewProps = {
  blocks: EditorBlock[]
  selectedId: string | null
  onSelect: (id: string) => void
  primaryColor: string
}

export default function CanvasPreview({
  blocks,
  selectedId,
  onSelect,
  primaryColor,
}: CanvasPreviewProps) {
  return (
    <div className="h-full overflow-y-auto bg-slate-200">
      {/* Canvas frame */}
      <div className="min-h-full py-8 px-4 flex flex-col items-center">
        <div
          className="w-full bg-white shadow-2xl rounded-lg overflow-hidden"
          style={{ maxWidth: '768px' }}
        >
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400">
              <svg className="w-16 h-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">Tambahkan block dari panel kiri</p>
            </div>
          ) : (
            blocks.map((block) => (
              <BlockWrapper
                key={block.id}
                block={block}
                isSelected={selectedId === block.id}
                onClick={() => onSelect(block.id)}
                primaryColor={primaryColor}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
