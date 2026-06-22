import { create } from 'zustand'
import type { CSSProperties } from 'react'
import type { BlockType } from '@prisma/client'

export type ThemeConfig = {
  primaryColor: string
  secondaryColor: string
  backgroundColor?: string
  buttonStyle?: 'sharp' | 'rounded' | 'pill'
  fontFamily: string
  headingFont?: string
}

export type BreakpointStyles = Record<'desktop' | 'tablet' | 'mobile', Record<string, string>>

export function getBreakpointStyle(content: Record<string, unknown>, mode: 'desktop' | 'tablet' | 'mobile'): CSSProperties {
  return ((content.breakpointStyles as BreakpointStyles | undefined) || {})[mode] || {}
}

export type EditorBlock = {
  id: string
  type: BlockType
  content: Record<string, unknown>
  sortOrder: number
  position?: Record<string, unknown>
  parentId?: string | null
}

export type PageInfo = {
  id: string
  slug: string
  title: string
  sortOrder: number
}

type EditorState = {
  blocks: EditorBlock[]
  selectedId: string | null
  selectedSubId: string | null
  theme: ThemeConfig
  leftPanel: 'elements' | 'layers' | 'settings'
  previewMode: 'desktop' | 'tablet' | 'mobile'
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'

  // Multi-page
  pages: PageInfo[]
  currentPageId: string | null

  // History states
  past: EditorBlock[][]
  future: EditorBlock[][]

  // Actions
  setBlocks: (blocks: EditorBlock[]) => void
  addBlock: (block: EditorBlock) => void
  addChildBlock: (block: EditorBlock, parentId: string) => void
  updateBlockContent: (id: string, content: Record<string, unknown>) => void
  updateBlockStyle: (id: string, style: Record<string, unknown>) => void
  updateSubElementStyle: (blockId: string, subId: string, style: Record<string, unknown>) => void
  deleteBlock: (id: string) => void
  duplicateBlock: (id: string) => void
  selectBlock: (id: string | null, subId?: string | null) => void
  setTheme: (theme: ThemeConfig) => void
  setLeftPanel: (panel: 'elements' | 'layers' | 'settings') => void
  setPreviewMode: (mode: 'desktop' | 'mobile') => void
  setSaveStatus: (status: 'idle' | 'saving' | 'saved' | 'error') => void
  setPages: (pages: PageInfo[], currentPageId: string) => void
  setCurrentPage: (pageId: string) => void
  
  // History Actions
  undo: () => void
  redo: () => void
}

export const useEditorStore = create<EditorState>((set) => ({
  blocks: [],
  selectedId: null,
  selectedSubId: null,
  theme: {
    primaryColor: '#4f46e5',
    secondaryColor: '#f3f4f6',
    fontFamily: 'Outfit',
  },
  leftPanel: 'elements',
  previewMode: 'desktop',
  saveStatus: 'idle',

  pages: [],
  currentPageId: null,
  
  past: [],
  future: [],

  setBlocks: (blocks) => set((state) => {
    // Avoid pushing to history if initial load or no blocks
    if (state.blocks.length === 0) {
      return { blocks }
    }
    return {
      past: [...state.past.slice(-49), state.blocks],
      future: [],
      blocks
    }
  }),
  
    addBlock: (block) => set((state) => ({ 
      past: [...state.past.slice(-49), state.blocks],
      future: [],
      blocks: [...state.blocks, { 
        ...block, 
        content: { 
          ...block.content, 
          breakpointStyles: {} 
        } 
      }], 
      selectedId: block.id, 
      selectedSubId: null 
    })),
    
    addChildBlock: (block, parentId) => set((state) => ({
      past: [...state.past.slice(-49), state.blocks],
      future: [],
      blocks: [...state.blocks, {
        ...block,
        parentId,
        content: {
          ...block.content,
          breakpointStyles: {}
        }
      }],
      selectedId: block.id,
      selectedSubId: null
    })),
  
  updateBlockContent: (id, content) =>
    set((state) => ({
      past: [...state.past.slice(-49), state.blocks],
      future: [],
      blocks: state.blocks.map((b) =>
        b.id === id ? { ...b, content: { ...b.content, ...content } } : b
      ),
    })),
    
  updateBlockStyle: (id, style) =>
    set((state) => ({
      past: [...state.past.slice(-49), state.blocks],
      future: [],
      blocks: state.blocks.map((b) =>
        b.id === id
          ? {
              ...b,
              content: { ...b.content, style: { ...(b.content.style as Record<string, unknown> || {}), ...style } },
            }
          : b
      ),
    })),
    
  updateSubElementStyle: (blockId, subId, style) => 
    set((state) => ({
      past: [...state.past.slice(-49), state.blocks],
      future: [],
      blocks: state.blocks.map((b) => 
        b.id === blockId 
          ? {
              ...b,
              content: {
                ...b.content,
                subStyles: {
                  ...(b.content.subStyles as Record<string, Record<string, unknown>> || {}),
                  [subId]: {
                    ...((b.content.subStyles as Record<string, Record<string, unknown>> || {})[subId] || {}),
                    ...style
                  }
                }
              }
          }
          : b
      )
    })),
    
  deleteBlock: (id) =>
    set((state) => {
      const idsToDelete = new Set<string>()
      const collectChildren = (parentId: string) => {
        idsToDelete.add(parentId)
        state.blocks.filter(b => b.parentId === parentId).forEach(c => collectChildren(c.id))
      }
      collectChildren(id)
      return {
        past: [...state.past.slice(-49), state.blocks],
        future: [],
        blocks: state.blocks.filter((b) => !idsToDelete.has(b.id)),
        selectedId: idsToDelete.has(state.selectedId || '') ? null : state.selectedId,
        selectedSubId: idsToDelete.has(state.selectedId || '') ? null : state.selectedSubId,
      }
    }),
    
  duplicateBlock: (id) =>
    set((state) => {
      const idx = state.blocks.findIndex(b => b.id === id)
      if (idx === -1) return {}
      const block = state.blocks[idx]
      if (!block) return {}
      
      const idMap = new Map<string, string>()
      const dupBlock = (original: EditorBlock): EditorBlock => {
        const newId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        idMap.set(original.id, newId)
        return {
          id: newId,
          type: original.type,
          content: JSON.parse(JSON.stringify(original.content)),
          sortOrder: original.sortOrder,
          parentId: original.parentId ? idMap.get(original.parentId) || original.parentId : original.parentId
        }
      }
      
      const newBlock = dupBlock(block)
      const newBlocks = [...state.blocks]
      const insertIdx = state.blocks.findLastIndex(b => (b.parentId || null) === (block.parentId || null) && b.sortOrder > block.sortOrder)
      const atIndex = insertIdx === -1 ? idx + 1 : insertIdx
      newBlocks.splice(atIndex, 0, newBlock)
      
      // Also duplicate children
      const childBlocks = state.blocks.filter(b => b.parentId === id)
      const duplicatedChildren = childBlocks.map(dupBlock)
      newBlocks.push(...duplicatedChildren)
      
      // adjust sort orders for siblings
      const parentId = block.parentId || null
      const siblings = newBlocks.filter(b => (b.parentId || null) === parentId)
      siblings.sort((a, b) => a.sortOrder - b.sortOrder)
      siblings.forEach((sib, i) => { sib.sortOrder = i + 1 })

      return {
        past: [...state.past.slice(-49), state.blocks],
        future: [],
        blocks: newBlocks,
        selectedId: newBlock.id,
        selectedSubId: null
      }
    }),
    
  selectBlock: (id, subId = null) => set({ selectedId: id, selectedSubId: subId }),
  setTheme: (theme) => set({ theme }),
  setLeftPanel: (panel) => set({ leftPanel: panel }),
  setPreviewMode: (mode) => set({ previewMode: mode }),
  setSaveStatus: (status) => set({ saveStatus: status }),
  setPages: (pages, currentPageId) => set({ pages, currentPageId }),
  setCurrentPage: (currentPageId) => set({ currentPageId }),
  
  undo: () =>
    set((state) => {
      if (state.past.length === 0) return {}
      const previous = state.past[state.past.length - 1]
      const newPast = state.past.slice(0, state.past.length - 1)
      if (!previous) return {}
      return {
        past: newPast,
        future: [state.blocks, ...state.future],
        blocks: previous,
        selectedId: null,
        selectedSubId: null
      }
    }),
    
  redo: () =>
    set((state) => {
      if (state.future.length === 0) return {}
      const next = state.future[0]
      const newFuture = state.future.slice(1)
      if (!next) return {}
      return {
        past: [...state.past, state.blocks],
        future: newFuture,
        blocks: next,
        selectedId: null,
        selectedSubId: null
      }
    })
}))
