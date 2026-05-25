'use client'



import type { BlockType } from '@prisma/client'
import type { EditorBlock, BlockPosition } from './BlockNavigator'
import HeroBlock from '@/components/blocks/HeroBlock'
import CatalogBlock from '@/components/blocks/CatalogBlock'
import ContactBlock from '@/components/blocks/ContactBlock'
import TextBlock from '@/components/blocks/TextBlock'
import { HeadingBlock, ParagraphBlock, QuoteBlock } from '@/components/blocks/TypographyBlocks'
import { VideoBlock, GalleryBlock } from '@/components/blocks/MediaBlocks'
import { DivBlock, ColumnBlock, GridBlock, ListBlock, LinkBlock, CMSBlock, ButtonBlock } from '@/components/blocks/StructureBlocks'
import DraggableWrapper from './DraggableWrapper'

const BLOCK_TYPE_LABELS: Record<string, string> = {
  HERO: 'Hero',
  CATALOG: 'Katalog',
  CONTACT: 'Kontak',
  TEXT: 'Teks',
  GALLERY: 'Galeri',
  DIV: 'Div Block',
  CMS: 'CMS',
  COLUMN: 'Kolom',
  GRID: 'Grid',
  LINK_BLOCK: 'Link Block',
  LIST: 'List',
  HEADING: 'Heading',
  PARAGRAPH: 'Paragraph',
  QUOTE: 'Quote',
  BUTTON: 'Tombol',
  VIDEO: 'Video',
}

const BLOCK_TYPE_COLORS: Record<string, string> = {
  HERO: 'bg-violet-500',
  CATALOG: 'bg-blue-500',
  CONTACT: 'bg-green-500',
  TEXT: 'bg-slate-500',
  GALLERY: 'bg-orange-500',
  DIV: 'bg-gray-500',
  CMS: 'bg-indigo-500',
  COLUMN: 'bg-sky-500',
  GRID: 'bg-cyan-500',
  LINK_BLOCK: 'bg-pink-500',
  LIST: 'bg-teal-500',
  HEADING: 'bg-amber-500',
  PARAGRAPH: 'bg-orange-400',
  QUOTE: 'bg-yellow-500',
  VIDEO: 'bg-red-500',
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
    switch (block.type as string) {
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
      case 'HEADING':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <HeadingBlock content={content as any} theme={theme} />
      case 'PARAGRAPH':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <ParagraphBlock content={content as any} theme={theme} />
      case 'QUOTE':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <QuoteBlock content={content as any} theme={theme} />
      case 'VIDEO':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <VideoBlock content={content as any} theme={theme} />
      case 'GALLERY':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <GalleryBlock content={content as any} />
      case 'DIV':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <DivBlock content={content as any} />
      case 'COLUMN':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <ColumnBlock content={content as any} />
      case 'GRID':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <GridBlock content={content as any} />
      case 'LIST':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <ListBlock content={content as any} theme={theme} />
      case 'LINK_BLOCK':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <LinkBlock content={content as any} />
      case 'BUTTON':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <ButtonBlock content={content as any} theme={theme} />
      case 'CMS':
        return <CMSBlock />
      default:
        return (
          <div className="p-8 text-center text-slate-400 bg-slate-100">
            Block type: {block.type}
          </div>
        )
    }
  }

  const styles = (block.content?.styles || {}) as React.CSSProperties

  return (
    <div
      id={block.content?.htmlId ? String(block.content.htmlId) : undefined}
      className={`relative group cursor-pointer transition-all duration-200 overflow-hidden w-full ${
        isSelected
          ? 'ring-2 ring-indigo-600'
          : 'ring-1 ring-transparent hover:ring-gray-300'
      }`}
      style={styles}
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
      <div className="pointer-events-none select-none w-full">{renderBlock()}</div>
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
    <div className="h-full w-full overflow-y-auto overflow-x-hidden flex flex-col items-center py-8 px-4 relative">

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
        className={`bg-white relative shrink-0 overflow-hidden transition-all duration-500 ease-in-out shadow-xl ring-1 ring-black/5 ${
          previewMode === 'mobile' 
            ? 'w-[375px] min-h-[812px] border-[14px] border-gray-900 rounded-[3rem] mt-4 mb-16 mx-auto'
            : 'w-full max-w-[1280px] min-h-[800px] rounded-lg mt-0 mb-16'
        } preview-content`}
        style={{ fontFamily: `"${theme.fontFamily}", sans-serif` }}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(null)
        }}
      >
        {/* Device specific UI (Notch for mobile, Browser Bar for desktop) */}
        {previewMode === 'mobile' ? (
          <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
            <div className="w-32 h-7 bg-gray-900 rounded-b-3xl"></div>
          </div>
        ) : null}

        {/* Content Area */}
        <div 
          className="flex flex-col w-full min-h-full relative transition-colors duration-300"
          style={{ backgroundColor: theme.backgroundColor || '#FFFFFF' }}
        >

          {blocks.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center py-32 text-gray-400">
              <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Area Kanvas Kosong</p>
            </div>
          ) : (
            blocks.map((block, index) => {
              const pos = block.position as Record<string, unknown> | null
              const position = {
                x: (pos?.x as number) ?? 0,
                y: (pos?.y as number) ?? 0,
                width: (pos?.width as string | number) ?? '100%',
                height: (pos?.height as string | number) ?? 'auto',
                zIndex: (pos?.zIndex as number) ?? index + 1
              }
              return (
                <DraggableWrapper
                  key={block.id}
                  id={block.id}
                  position={position as BlockPosition}
                  isSelected={selectedId === block.id}
                  onSelect={onSelect}
                  onDragStop={() => {}} // Disabled
                  onResizeStop={() => {}} // Disabled
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