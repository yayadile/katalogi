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

export type EditorBlock = {
  id: string
  type: BlockType
  content: Record<string, unknown>
  sortOrder: number
}

const BLOCK_ICONS: Record<BlockType, React.ReactNode> = {
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
}

const BLOCK_LABELS: Record<BlockType, string> = {
  HERO: 'Hero',
  CATALOG: 'Katalog',
  CONTACT: 'Kontak',
  TEXT: 'Teks',
  GALLERY: 'Galeri',
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
      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer group transition-all ${
        isSelected
          ? 'bg-indigo-500/15 border border-indigo-500/40 text-indigo-300'
          : 'hover:bg-white/5 border border-transparent text-slate-400'
      }`}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing opacity-30 group-hover:opacity-60 hover:!opacity-100 transition-opacity flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
        aria-label="Drag to reorder"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>

      {/* Icon */}
      <span className={isSelected ? 'text-indigo-400' : 'text-slate-500'}>
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
        className="opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:text-red-400 transition-all flex-shrink-0"
        aria-label="Delete block"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
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
        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-white/20 text-slate-400 hover:text-slate-200 hover:border-white/40 transition-all text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Tambah Block
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          {blockTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleAdd(type)}
              disabled={!!loading}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-slate-300 hover:bg-white/5 transition-colors text-sm disabled:opacity-50"
            >
              <span className="text-slate-400">{BLOCK_ICONS[type]}</span>
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

  const handleBlockAdded = useCallback(
    (block: EditorBlock) => {
      const updated = [...blocks, block]
      setBlocks(updated)
      onBlocksChange(updated)
      onSelect(block.id)
    },
    [blocks, onBlocksChange, onSelect]
  )

  return (
    <div className="flex flex-col gap-1 h-full">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1 mb-2">
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
              <p className="text-xs text-slate-600 text-center py-8">
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

      <div className="mt-3 pt-3 border-t border-white/5">
        <AddBlockMenu
          websiteId={websiteId}
          currentCount={blocks.length}
          onBlockAdded={handleBlockAdded}
        />
      </div>
    </div>
  )
}
