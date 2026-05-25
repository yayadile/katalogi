'use client'

import { useState } from 'react'

import type { BlockType } from '@prisma/client'
import type { EditorBlock, BlockPosition } from './BlockNavigator'
import HeroBlock from '@/components/blocks/HeroBlock'
import CatalogBlock from '@/components/blocks/CatalogBlock'
import ContactBlock from '@/components/blocks/ContactBlock'
import TextBlock from '@/components/blocks/TextBlock'
import DraggableWrapper from './DraggableWrapper'

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
  theme,
}: {
  block: EditorBlock
  isSelected: boolean
  onClick: () => void
  theme: {
    primaryColor: string
    secondaryColor: string
    backgroundColor?: string
    buttonStyle?: 'sharp' | 'rounded' | 'pill'
    fontFamily: string
    headingFont?: string
  }
}) {
  const content = block.content

  const renderBlock = () => {
    switch (block.type as BlockType) {
      case 'HERO':
        return (
          <HeroBlock
            content={content as Parameters<typeof HeroBlock>[0]['content']}
            theme={theme}
            isEditing
          />
        )
      case 'CATALOG':
        return (
          <CatalogBlock
            content={content as Parameters<typeof CatalogBlock>[0]['content']}
            theme={theme}
          />
        )
      case 'CONTACT':
        return (
          <ContactBlock
            content={content as Parameters<typeof ContactBlock>[0]['content']}
            theme={theme}
          />
        )
      case 'TEXT':
        return (
          <TextBlock
            content={content as Parameters<typeof TextBlock>[0]['content']}
            theme={theme}
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
      className={`relative group cursor-pointer transition-all duration-200 rounded-lg overflow-hidden w-full h-full ${
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
      <div className="pointer-events-none select-none h-full">{renderBlock()}</div>
    </div>
  )
}

type CanvasPreviewProps = {
  blocks: EditorBlock[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onPositionChange?: (id: string, position: Partial<BlockPosition>) => void
  theme: {
    primaryColor: string
    secondaryColor: string
    backgroundColor?: string
    buttonStyle?: 'sharp' | 'rounded' | 'pill'
    fontFamily: string
    headingFont?: string
  }
  previewMode?: 'desktop' | 'mobile'
}

export default function CanvasPreview({
  blocks,
  selectedId,
  onSelect,
  onPositionChange,
  theme,
  previewMode = 'desktop',
}: CanvasPreviewProps) {

  return (
    <div className="h-full overflow-y-auto bg-slate-950 flex flex-col items-center py-8 px-4 relative">


      {/* Dynamic Font Style Injection for the preview */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=${theme.fontFamily.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap');
        ${theme.headingFont && theme.headingFont !== theme.fontFamily ? `@import url('https://fonts.googleapis.com/css2?family=${theme.headingFont.replace(/\s+/g, '+')}:wght@500;600;700;800&display=swap');` : ''}
        
        .preview-content h1, .preview-content h2, .preview-content h3, .preview-content h4 {
          font-family: "${theme.headingFont || theme.fontFamily}", sans-serif !important;
        }
      `}</style>

      {/* Mockup Frame / Canvas Area */}
      <div 
        className={`bg-white shadow-2xl relative overflow-hidden transition-all duration-500 ease-in-out ${
          previewMode === 'mobile' 
            ? 'w-[375px] min-h-[812px] rounded-[3rem] border-8 border-slate-900 ring-1 ring-white/10 mt-8 mb-16 mx-auto'
            : 'w-full min-h-full border border-slate-800'
        } preview-content`}
        style={{ fontFamily: `"${theme.fontFamily}", sans-serif` }}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(null)
        }}
      >
        {/* Device specific UI (Notch for mobile, Browser Bar for desktop) */}
        {previewMode === 'mobile' ? (
          <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
            <div className="w-32 h-6 bg-slate-900 rounded-b-3xl"></div>
          </div>
        ) : (
          <div className="bg-slate-100 h-8 flex items-center px-4 gap-2 border-b border-slate-200">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
        )}

        {/* Content Area */}
        <div 
          className="h-full relative transition-colors duration-300"
          style={{ backgroundColor: theme.backgroundColor || '#F8FAFC' }}
        >
          {/* Grid Background for Canvas */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
               style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          {blocks.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center py-32 text-slate-400">
              <svg className="w-16 h-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">Tambahkan block dari panel kiri</p>
            </div>
          ) : (
            blocks.map((block, index) => {
              const pos = block.position as Record<string, any> | null
              const position = {
                x: pos?.x ?? 0,
                y: pos?.y ?? index * 500, // Cascade Y coordinate for empty positions
                width: pos?.width ?? '100%',
                height: pos?.height ?? 'auto',
                zIndex: pos?.zIndex ?? index + 1
              }
              return (
                <DraggableWrapper
                  key={block.id}
                  id={block.id}
                  position={position as BlockPosition}
                  isSelected={selectedId === block.id}
                  onSelect={onSelect}
                  onDragStop={(id, x, y) => onPositionChange?.(id, { x, y })}
                  onResizeStop={(id, width, height, x, y) => onPositionChange?.(id, { width, height, x, y })}
                >
                  <BlockWrapper
                    block={block}
                    isSelected={selectedId === block.id}
                    onClick={() => onSelect(block.id)}
                    theme={theme}
                  />
                </DraggableWrapper>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}