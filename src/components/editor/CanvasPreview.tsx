'use client'

import React, { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEditorStore } from './store'
import { BlockRenderer } from './renderers/BlockRenderer'
import { IFrameWrapper } from './IFrameWrapper'

function NestedSortableBlock({ 
  id,
  depth = 0
}: { 
  id: string 
  depth?: number
}) {
  const block = useEditorStore((state) => state.blocks.find(b => b.id === id))
  const allBlocks = useEditorStore((state) => state.blocks)
  const selectedId = useEditorStore((state) => state.selectedId)
  const selectBlock = useEditorStore((state) => state.selectBlock)
  const duplicateBlock = useEditorStore((state) => state.duplicateBlock)
  const setBlocks = useEditorStore((state) => state.setBlocks)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const childBlocks = allBlocks
    .filter(b => b.parentId === id)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const [blockToDelete, setBlockToDelete] = useState<{ id: string; type: string } | null>(null)

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const currentBlocks = useEditorStore.getState().blocks
      const children = currentBlocks.filter(b => b.parentId === id)
      const oldIndex = children.findIndex(b => b.id === active.id)
      const newIndex = children.findIndex(b => b.id === over.id)
      
      if (oldIndex === -1 || newIndex === -1) return
      
      const reordered = [...children]
      const [removed] = reordered.splice(oldIndex, 1)
      reordered.splice(newIndex, 0, removed!)
      reordered.forEach((b, i) => { b.sortOrder = i + 1 })
      
      const otherBlocks = currentBlocks.filter(b => b.parentId !== id)
      setBlocks([...otherBlocks, ...reordered].sort((a, b) => a.sortOrder - b.sortOrder))
    }
  }

  if (!block) return null

  const isSelected = selectedId === id

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation()
        selectBlock(id)
      }}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
        useEditorStore.getState().selectBlock(id)
      }}
      className={`relative group cursor-pointer transition-all duration-200 w-full ${
        isSelected ? 'ring-2 ring-indigo-600 ring-inset' : 'hover:ring-1 hover:ring-indigo-300 ring-inset ring-transparent'
      } ${depth > 0 ? 'ml-4 border-l-2 border-indigo-200' : ''}`}
    >
      <div className="w-full">
        <BlockRenderer block={block} isPreview={false} />
      </div>
      
      {/* Children List (for CONTAINER blocks) */}
      {childBlocks.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={childBlocks.map(b => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col w-full border-t border-dashed border-indigo-200 bg-indigo-50/30">
              {childBlocks.map(child => (
                <NestedSortableBlock key={child.id} id={child.id} depth={depth + 1} />
              ))}
              {isSelected && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const newId = `temp-child-${Date.now()}`
                    useEditorStore.getState().addChildBlock({
                      id: newId,
                      type: 'TEXT',
                      content: { text: 'Elemen baru' },
                      sortOrder: childBlocks.length + 1,
                    }, id)
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold text-indigo-600 hover:bg-indigo-100 transition-colors uppercase tracking-wider"
                >
                  + Tambah Elemen
                </button>
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}
      
      {/* Controls Overlay */}
      <div
        className={`absolute top-2 right-2 z-20 flex items-center gap-1.5 p-1 rounded-lg bg-white border border-gray-200 shadow-sm transition-opacity ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold text-white bg-indigo-600 cursor-grab active:cursor-grabbing hover:bg-indigo-700 select-none"
          {...attributes}
          {...listeners}
        >
          <svg className="w-3 h-3 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>{block.type}</span>
        </div>
        
        {childBlocks.length === 0 && block.type !== 'CONTAINER' && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                duplicateBlock(block.id)
              }}
              className="p-1 rounded text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
              title="Duplikat Blok"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setBlockToDelete({ id: block.id, type: block.type })
              }}
              className="p-1 rounded text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Hapus Block"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </>
        )}
      </div>

      {blockToDelete && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 text-center max-w-sm">
            <h3 className="text-sm font-extrabold text-slate-900">Hapus Blok {blockToDelete.type}?</h3>
            <p className="text-xs text-slate-500 font-semibold mt-2">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="mt-4 flex gap-3">
              <button onClick={() => setBlockToDelete(null)} className="flex-1 py-2.5 px-4 border border-slate-200 rounded-xl text-xs font-bold">Batal</button>
              <button onClick={() => { useEditorStore.getState().deleteBlock(blockToDelete.id); setBlockToDelete(null) }} className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-xl text-xs font-bold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CanvasPreview() {
  const blocks = useEditorStore((state) => state.blocks)
  const pages = useEditorStore((state) => state.pages)
  const currentPageId = useEditorStore((state) => state.currentPageId)
  const selectedId = useEditorStore((state) => state.selectedId)
  const selectBlock = useEditorStore((state) => state.selectBlock)
  const deleteBlock = useEditorStore((state) => state.deleteBlock)
  const duplicateBlock = useEditorStore((state) => state.duplicateBlock)
  const setBlocks = useEditorStore((state) => state.setBlocks)
  const theme = useEditorStore((state) => state.theme)
  const previewMode = useEditorStore((state) => state.previewMode)
  
  // Only render root blocks (no parentId) at the top level
  const rootBlocks = blocks.filter(b => !b.parentId).sort((a, b) => a.sortOrder - b.sortOrder)

  // Custom delete modal state
  const [blockToDelete, setBlockToDelete] = useState<{ id: string; type: string } | null>(null)

  // Custom context menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    blockId: string
    blockType: string
  } | null>(null)

  React.useEffect(() => {
    const handleClose = () => setContextMenu(null)
    window.addEventListener('click', handleClose)
    return () => window.removeEventListener('click', handleClose)
  }, [])

  const handleContextMenu = (e: React.MouseEvent, id: string, type: string) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      blockId: id,
      blockType: type
    })
  }

  const moveBlockUp = (id: string) => {
    const rootBlockIds = blocks.filter(b => !b.parentId).map(b => b.id)
    const index = rootBlockIds.indexOf(id)
    if (index > 0) {
      const targetId = rootBlockIds[index - 1]
      if (!targetId) return
      const oldIndex = blocks.findIndex((b) => b.id === id)
      const newIndex = blocks.findIndex((b) => b.id === targetId)
      const newBlocks = [...blocks]
      const [removed] = newBlocks.splice(oldIndex, 1)
      newBlocks.splice(newIndex, 0, removed!)
      newBlocks.forEach((b, idx) => { b.sortOrder = idx + 1 })
      setBlocks(newBlocks)
    }
  }

  const moveBlockDown = (id: string) => {
    const rootBlockIds = blocks.filter(b => !b.parentId).map(b => b.id)
    const index = rootBlockIds.indexOf(id)
    if (index < rootBlockIds.length - 1) {
      const targetId = rootBlockIds[index + 1]
      if (!targetId) return
      const oldIndex = blocks.findIndex((b) => b.id === id)
      const newIndex = blocks.findIndex((b) => b.id === targetId)
      const newBlocks = [...blocks]
      const [removed] = newBlocks.splice(oldIndex, 1)
      newBlocks.splice(newIndex, 0, removed!)
      newBlocks.forEach((b, idx) => { b.sortOrder = idx + 1 })
      setBlocks(newBlocks)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const current = useEditorStore.getState().blocks
      const rootIds = current.filter(b => !b.parentId).map(b => b.id)
      const oldIndex = rootIds.indexOf(active.id as string)
      const newIndex = rootIds.indexOf(over.id as string)
      
      if (oldIndex === -1 || newIndex === -1) return
      
      const rootBlocks = current.filter(b => !b.parentId)
      rootBlocks.sort((a, b) => a.sortOrder - b.sortOrder)
      const [removed] = rootBlocks.splice(oldIndex, 1)
      rootBlocks.splice(newIndex, 0, removed!)
      rootBlocks.forEach((b, i) => { b.sortOrder = i + 1 })
      
      const childBlocks = current.filter(b => b.parentId)
      setBlocks([...rootBlocks, ...childBlocks].sort((a, b) => a.sortOrder - b.sortOrder))
    }
  }

  const handleTriggerDelete = (id: string, type: string) => {
    setBlockToDelete({ id, type })
  }

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden flex flex-col items-center py-8 px-4 relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=${theme.fontFamily.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap');
        ${theme.headingFont && theme.headingFont !== theme.fontFamily ? `@import url('https://fonts.googleapis.com/css2?family=${theme.headingFont.replace(/\s+/g, '+')}:wght@500;600;700;800&display=swap');` : ''}

        .preview-content h1, .preview-content h2, .preview-content h3, .preview-content h4 {
          font-family: "${theme.headingFont || theme.fontFamily}", sans-serif !important;
        }
      `}</style>

      <div 
        className={`bg-white relative shrink-0 overflow-hidden transition-all duration-500 ease-in-out shadow-xl ring-1 ring-black/5 ${
          previewMode === 'mobile' 
            ? 'w-[375px] min-h-[812px] border-[14px] border-gray-900 rounded-[3rem] mt-4 mb-16 mx-auto'
            : 'w-full max-w-[1280px] min-h-[800px] rounded-lg mt-0 mb-16'
        } preview-content`}
      >
        <IFrameWrapper theme={theme}>
          <div onClick={() => selectBlock(null)} className="min-h-screen flex flex-col w-full font-sans" style={{ fontFamily: `"${theme.fontFamily}", sans-serif` }}>
            {pages.length > 1 && (
              <nav className="flex items-center justify-center gap-4 py-4 px-6 border-b border-slate-200/50 bg-white/80 sticky top-0 z-50 backdrop-blur-sm pointer-events-none">
                {pages.map((page) => {
                  const isActive = currentPageId === page.id
                  return (
                    <div
                      key={page.id}
                      className={`text-sm font-semibold transition-colors uppercase tracking-wider ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}
                    >
                      {page.title}
                    </div>
                  )
                })}
              </nav>
            )}
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={rootBlocks.map(b => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col w-full min-h-full" style={{ backgroundColor: theme.backgroundColor || '#ffffff' }}>
                  {rootBlocks.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-32 text-gray-400">
                       <p className="text-sm font-bold uppercase tracking-widest">Area Kanvas Kosong</p>
                    </div>
                  ) : (
                    rootBlocks.map((block) => (
                      <NestedSortableBlock 
                        key={block.id} 
                        id={block.id}
                      />
                    ))
                  )}
                </div>
              </SortableContext>
            </DndContext>
            
            <footer 
              className="py-6 text-center border-t border-slate-200/50 pointer-events-none mt-auto"
              style={{ backgroundColor: theme.backgroundColor || '#F8FAFC' }}
            >
              <div className="inline-flex items-center gap-1.5 text-slate-400 text-xs transition-colors">
                <span className="w-4 h-4 rounded flex items-center justify-center text-[9px] text-white font-bold" style={{ backgroundColor: theme.primaryColor }}>K</span>
                Dibuat dengan <strong className="text-slate-600">Katalogi</strong>
              </div>
            </footer>
          </div>
        </IFrameWrapper>
      </div>

      {/* ──────────────── Custom Delete Confirmation Modal ──────────────── */}
      {blockToDelete && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-gray-100 w-full max-w-sm rounded-[2rem] shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200 relative">
            
            {/* Red Warning Trash Icon */}
            <div className="w-12 h-12 mx-auto mb-4 bg-red-50 text-red-500 border border-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
              Hapus Blok {blockToDelete.type}?
            </h3>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-xs mx-auto mt-2">
              Tindakan ini tidak dapat dibatalkan. Blok beserta konten di dalamnya akan dihapus secara permanen.
            </p>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setBlockToDelete(null)}
                className="flex-1 py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteBlock(blockToDelete.id)
                  setBlockToDelete(null)
                }}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-red-600/10"
              >
                Hapus
              </button>
            </div>

          </div>
        </div>
      )}
      {/* ──────────────── Custom Context Menu ──────────────── */}
      {contextMenu && (
        <div
          className="fixed z-[999] min-w-[180px] bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-xl py-1.5 px-1 animate-in fade-in zoom-in-95 duration-100 ease-out"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Duplikat */}
          <button
            onClick={() => {
              duplicateBlock(contextMenu.blockId)
              setContextMenu(null)
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors text-left"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            <span>Duplikat Blok</span>
          </button>

          {/* Pindahkan Ke Atas */}
          <button
            onClick={() => {
              moveBlockUp(contextMenu.blockId)
              setContextMenu(null)
            }}
            disabled={blocks.filter(b => !b.parentId).findIndex(b => b.id === contextMenu.blockId) === 0}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors text-left disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-700"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <span>Pindahkan ke Atas</span>
          </button>

          {/* Pindahkan Ke Bawah */}
          <button
            onClick={() => {
              moveBlockDown(contextMenu.blockId)
              setContextMenu(null)
            }}
            disabled={blocks.filter(b => !b.parentId).findIndex(b => b.id === contextMenu.blockId) === blocks.filter(b => !b.parentId).length - 1}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors text-left disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-700"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span>Pindahkan ke Bawah</span>
          </button>

          {/* Divider */}
          <div className="my-1 border-t border-slate-100" />

          {/* Hapus */}
          <button
            onClick={() => {
              handleTriggerDelete(contextMenu.blockId, contextMenu.blockType)
              setContextMenu(null)
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Hapus Blok</span>
          </button>
        </div>
      )}
    </div>
  )
}