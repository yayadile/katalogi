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
          ? 'bg-indigo-50 border border-indigo-200 text-indigo-700'
          : 'hover:bg-gray-100 border border-transparent text-gray-500'
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

      {/* Icon */}
      <span className={isSelected ? 'text-indigo-600' : 'text-gray-400'}>
        {BLOCK_ICONS[block.type]}
      </span>

      {/* Label */}
      <span className="text-sm font-medium flex-1 min-w-0 truncate">
        {BLOCK_LABELS[block.type]}
      </span>

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:text-red-500 transition-all shrink-0"
        aria-label="Delete block"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      </div>
    </div>
  )
}

// ─── Add Block Menu ────────────────────────────────────────────────────────────

function AddBlockMenu({
  websiteId,
  currentCount,
  onBlockAdded,
}: {
  websiteId: string
  currentCount: number
  onBlockAdded: (block: EditorBlock) => void
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<BlockType | null>(null)

  const blockTypes: BlockType[] = ['HERO', 'CATALOG', 'CONTACT', 'TEXT', 'GALLERY']

  const handleAdd = async (type: BlockType) => {
    setLoading(type)
    const result = await addPageBlock(websiteId, type, currentCount + 1)
    setLoading(null)
    setOpen(false)
    if (result.success && result.data) {
      onBlockAdded({
        id: result.data.id,
        type: result.data.type,
        content: result.data.content as Record<string, unknown>,
        sortOrder: result.data.sortOrder,
      })
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-all text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Tambah Block
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
          {blockTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleAdd(type)}
              disabled={!!loading}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-gray-700 hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
            >
              <span className="text-gray-400">{BLOCK_ICONS[type]}</span>
              {loading === type ? 'Menambahkan...' : BLOCK_LABELS[type]}
            </button>
          ))}
        </div>
      )}
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

  const handleBlockAdded = useCallback((newBlock: EditorBlock) => {
    const updated = [...blocks, newBlock]
    setBlocks(updated)
    onBlocksChange(updated)
    onSelect(newBlock.id)
  }, [blocks, onBlocksChange, onSelect])

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
    <div className="flex flex-col gap-1 h-full">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-2">
        Blocks ({blocks.length})
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
            {blocks.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-8">
                Belum ada block. Tambahkan block pertama!
              </p>
            )}
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
        </SortableContext>
      </DndContext>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <AddBlockMenu
          websiteId={websiteId}
          currentCount={blocks.length}
          onBlockAdded={handleBlockAdded}
        />
      </div>
    </div>
  )
}
