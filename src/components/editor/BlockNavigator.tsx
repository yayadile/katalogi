'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { BlockType } from '@prisma/client'
import { reorderBlocks, addPageBlock, deletePageBlock } from '@/lib/actions/blocks'

export type BlockPosition = {
  x: number
  y: number
  width: number | string
  height: number | string
  zIndex: number
}

export type EditorBlock = {
  id: string
  type: BlockType
  content: Record<string, unknown>
  sortOrder: number
  position?: BlockPosition
}

const BLOCK_ICONS: Record<string, React.ReactNode> = {
  HERO: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  CATALOG: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  CONTACT: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  TEXT: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  ),
  GALLERY: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  DIV: <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center text-[8px]">D</div>,
  CMS: <div className="w-4 h-4 bg-indigo-200 rounded-sm" />,
  COLUMN: <div className="w-4 h-4 border-l border-r border-gray-400" />,
  GRID: <div className="w-4 h-4 grid grid-cols-2 gap-[2px] p-[2px] border border-gray-400"><div className="bg-gray-400"/><div className="bg-gray-400"/><div className="bg-gray-400"/><div className="bg-gray-400"/></div>,
  LINK_BLOCK: <div className="w-4 h-4 flex items-center justify-center text-[10px] font-bold">L</div>,
  LIST: <div className="w-4 h-4 flex flex-col justify-center gap-[2px]"><div className="w-full h-[2px] bg-gray-400"/><div className="w-3/4 h-[2px] bg-gray-400"/></div>,
  HEADING: <div className="w-4 h-4 flex items-center justify-center font-bold text-xs">H</div>,
  PARAGRAPH: <div className="w-4 h-4 flex items-center justify-center font-serif text-xs">P</div>,
  QUOTE: <div className="w-4 h-4 flex items-center justify-center font-bold text-xs">&quot;</div>,
  BUTTON: <div className="w-4 h-4 flex items-center justify-center bg-indigo-100 text-indigo-500 rounded-sm text-[8px]">B</div>,
  VIDEO: <div className="w-4 h-4 flex items-center justify-center bg-red-100 text-red-500 rounded-sm text-[8px]">▶</div>,
}

const BLOCK_LABELS: Record<string, string> = {
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
  HEADING: 'Judul (Heading)',
  PARAGRAPH: 'Paragraf',
  QUOTE: 'Kutipan',
  BUTTON: 'Tombol',
  VIDEO: 'Video',
}

// ─── Sortable Item ─────────────────────────────────────────────────────────────

function SortableBlockItem({
  block,
  isSelected,
  onSelect,
  onDelete,
}: {
  block: EditorBlock
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer group transition-all text-xs border-b border-gray-100 last:border-0 ${
        isSelected
          ? 'bg-indigo-50/50 text-indigo-700'
          : 'hover:bg-gray-50 text-gray-600'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          onClick={(e) => e.stopPropagation()}
          aria-label="Drag to reorder"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>

        <span className={`truncate ${isSelected ? 'font-semibold text-indigo-900' : 'text-gray-700'}`}>
          {BLOCK_LABELS[block.type as string] || block.type}
        </span>
      </div>

      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-0.5 ml-auto">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Hapus blok"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}



// ─── Block Navigator ───────────────────────────────────────────────────────────

export default function BlockNavigator({
  websiteId,
  initialBlocks,
  selectedId,
  onSelect,
  onBlocksChange,
}: {
  websiteId: string
  initialBlocks: EditorBlock[]
  selectedId: string | null
  onSelect: (id: string) => void
  onBlocksChange: (blocks: EditorBlock[]) => void
}) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)
      const reordered = arrayMove(blocks, oldIndex, newIndex)

      setBlocks(reordered)
      onBlocksChange(reordered)

      await reorderBlocks(
        websiteId,
        reordered.map((b) => b.id)
      )
    },
    [blocks, websiteId, onBlocksChange]
  )

  const handleDelete = useCallback(
    async (blockId: string) => {
      const updated = blocks.filter((b) => b.id !== blockId)
      setBlocks(updated)
      onBlocksChange(updated)
      await deletePageBlock(blockId)
    },
    [blocks, onBlocksChange]
  )



  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2 border-b border-gray-200 px-3 py-2 bg-white">
        <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Lapisan (Layers)</h2>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="px-2 pb-2">
            {blocks.length === 0 ? (
              <div className="text-center p-4 border border-dashed border-gray-200 rounded-sm bg-gray-50">
                <p className="text-[11px] text-gray-400">Belum ada layer.</p>
              </div>
            ) : (
              <div className="flex flex-col bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
                {blocks.map((block) => (
                  <SortableBlockItem
                    key={block.id}
                    block={block}
                    isSelected={selectedId === block.id}
                    onSelect={() => onSelect(block.id)}
                    onDelete={() => handleDelete(block.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

    </div>
  )
}
