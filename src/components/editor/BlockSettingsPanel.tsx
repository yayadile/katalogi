'use client'

import { useState } from 'react'
import type { BlockType } from '@prisma/client'
import { useEditorStore } from './store'
import { UniversalSettings } from './settings/UniversalSettings'
import { AnimationSettings } from './settings/AnimationSettings'
import type { BlockAnimation } from '@/types/animation'
import { DEFAULT_ANIMATION } from '@/types/animation'

// Import specific block settings
import { HeroSettings } from './settings/HeroSettings'
import { CatalogSettings } from './settings/CatalogSettings'
import { ContactSettings } from './settings/ContactSettings'
import { TextSettings } from './settings/TextSettings'
import { HeadingSettings, ParagraphSettings, QuoteSettings } from './settings/TypographySettings'
import { VideoSettings, GallerySettings } from './settings/MediaSettings'
import { ColumnSettings, GridSettings, LinkBlockSettings, ListSettings, DivSettings, CMSSettings, ButtonSettings } from './settings/StructureSettings'

export default function BlockSettingsPanel() {
  const [activeBlockTab, setActiveBlockTab] = useState<'style' | 'settings' | 'animation'>('style')
  const [editingBreakpoint, setEditingBreakpoint] = useState<'base' | 'desktop' | 'tablet' | 'mobile'>('base')
  
  const selectedId = useEditorStore(state => state.selectedId)
  const selectedSubId = useEditorStore(state => state.selectedSubId)
  const blocks = useEditorStore(state => state.blocks)
  const selectedBlock = blocks.find(b => b.id === selectedId) || null
  const updateBlockContent = useEditorStore(state => state.updateBlockContent)
  const updateBlockStyle = useEditorStore(state => state.updateBlockStyle)
  const updateSubElementStyle = useEditorStore(state => state.updateSubElementStyle)
  const setSaveStatus = useEditorStore(state => state.setSaveStatus)

  if (!selectedBlock) {
    return (
      <div className="flex flex-col h-full bg-gray-50 border-l border-gray-200">
        <div className="flex items-center justify-between mb-2 border-b border-gray-200 px-3 py-2 bg-white">
          <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Pengaturan Blok</h2>
        </div>
        <div className="text-center py-16 text-gray-400 text-sm">
          <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
          </svg>
          Klik blok di kanvas untuk mulai mengedit
        </div>
      </div>
    )
  }

  const handleContentChange = (newContent: Record<string, unknown>) => {
    updateBlockContent(selectedBlock.id, newContent)
    setSaveStatus('idle') // Would trigger auto-save logic in a higher component or effect
  }
  
  const breakpointStyles = (selectedBlock.content?.breakpointStyles as Record<string, any>) || {}
  
  const currentStyles = selectedSubId 
    ? ((selectedBlock.content?.subStyles as any)?.[selectedSubId] || {}) 
    : (editingBreakpoint === 'base' 
      ? (selectedBlock.content?.style || {}) 
      : (breakpointStyles[editingBreakpoint] || {}))

  return (
    <div className="flex flex-col h-full bg-gray-50 border-l border-gray-200">
      <div className="flex items-center justify-between mb-2 border-b border-gray-200 px-3 py-2 bg-white">
        <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
          {selectedBlock.type} {selectedSubId ? `> ${selectedSubId}` : ''}
        </h2>
      </div>

       {/* Panel Tabs */}
       <div className="flex items-center gap-3 px-3 py-1.5 border-b border-gray-200 bg-gray-50/30">
         <button 
           onClick={() => setActiveBlockTab('style')}
           className={`text-[10px] font-semibold tracking-wider uppercase ${activeBlockTab === 'style' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
         >
           Gaya
         </button>
         <button 
           onClick={() => setActiveBlockTab('settings')}
           className={`text-[10px] font-semibold tracking-wider uppercase ${activeBlockTab === 'settings' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
         >
           Properti
         </button>
         <button 
           onClick={() => setActiveBlockTab('animation')}
           className={`text-[10px] font-semibold tracking-wider uppercase ${activeBlockTab === 'animation' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
         >
           Animasi
         </button>
       </div>
       
       {/* Breakpoint Selector (inside Style tab) */}
       {activeBlockTab === 'style' && (
         <div className="flex items-center gap-3 px-3 py-1.5 border-b border-gray-200 bg-gray-50/20">
           <span className="text-[10px] font-semibold tracking-wider uppercase text-gray-600">Edit Breakpoint:</span>
           <div className="flex gap-1">
             <button 
               onClick={() => setEditingBreakpoint('base')}
               className={`px-3 py-1 rounded text-xs font-medium ${editingBreakpoint === 'base' ? 'bg-purple-100 text-purple-800' : 'text-gray-500 hover:bg-gray-50'}`}
             >
               Base
             </button>
             <button 
               onClick={() => setEditingBreakpoint('desktop')}
               className={`px-3 py-1 rounded text-xs font-medium ${editingBreakpoint === 'desktop' ? 'bg-purple-100 text-purple-800' : 'text-gray-500 hover:bg-gray-50'}`}
             >
               Desktop
             </button>
             <button 
               onClick={() => setEditingBreakpoint('tablet')}
               className={`px-3 py-1 rounded text-xs font-medium ${editingBreakpoint === 'tablet' ? 'bg-purple-100 text-purple-800' : 'text-gray-500 hover:bg-gray-50'}`}
             >
               Tablet
             </button>
             <button 
               onClick={() => setEditingBreakpoint('mobile')}
               className={`px-3 py-1 rounded text-xs font-medium ${editingBreakpoint === 'mobile' ? 'bg-purple-100 text-purple-800' : 'text-gray-500 hover:bg-gray-50'}`}
             >
               Mobile
             </button>
           </div>
         </div>
       )}

      <div className="flex-1 overflow-y-auto bg-gray-50">
        {activeBlockTab === 'style' && (
          <div className="flex flex-col p-2 space-y-4">
            {selectedSubId && (
              <div className="bg-purple-100 text-purple-900 text-[10px] font-medium px-3 py-2 rounded mb-2">
                Mengedit gaya khusus elemen: <b>{selectedSubId}</b>
              </div>
            )}
             <UniversalSettings 
               styles={currentStyles as Record<string, string | number>} 
               htmlId={!selectedSubId ? (selectedBlock.content?.htmlId as string) : undefined}
               onChange={(updatedStyles, htmlId) => {
                 if (selectedSubId) {
                   updateSubElementStyle(selectedBlock.id, selectedSubId, updatedStyles)
                 } else if (editingBreakpoint === 'base') {
                   updateBlockStyle(selectedBlock.id, updatedStyles)
                   if (htmlId !== undefined) {
                     updateBlockContent(selectedBlock.id, { htmlId })
                   }
                 } else {
                   updateBlockContent(selectedBlock.id, { 
                     breakpointStyles: {
                       ...breakpointStyles,
                       [editingBreakpoint]: updatedStyles
                     }
                   })
                 }
               }} 
             />
          </div>
        )}

        {activeBlockTab === 'settings' && (
          <div className="space-y-6 p-4">
            {(selectedBlock.type as BlockType) === 'HERO' && (
              <HeroSettings
                blockId={selectedBlock.id}
                content={selectedBlock.content}
                onChange={handleContentChange}
                onSaveStatus={setSaveStatus}
              />
            )}
            {(selectedBlock.type as BlockType) === 'CATALOG' && (
              <CatalogSettings
                blockId={selectedBlock.id}
                content={selectedBlock.content}
                onChange={handleContentChange}
                onSaveStatus={setSaveStatus}
              />
            )}
            {(selectedBlock.type as BlockType) === 'CONTACT' && (
              <ContactSettings
                blockId={selectedBlock.id}
                content={selectedBlock.content}
                onChange={handleContentChange}
                onSaveStatus={setSaveStatus}
              />
            )}
            {(selectedBlock.type as BlockType) === 'TEXT' && (
              <TextSettings
                blockId={selectedBlock.id}
                content={selectedBlock.content}
                onChange={handleContentChange}
                onSaveStatus={setSaveStatus}
              />
            )}
            {(selectedBlock.type as string) === 'HEADING' && (
              <HeadingSettings
                blockId={selectedBlock.id}
                content={selectedBlock.content}
                onChange={handleContentChange}
                onSaveStatus={setSaveStatus}
              />
            )}
            {(selectedBlock.type as string) === 'PARAGRAPH' && (
              <ParagraphSettings
                blockId={selectedBlock.id}
                content={selectedBlock.content}
                onChange={handleContentChange}
                onSaveStatus={setSaveStatus}
              />
            )}
            {(selectedBlock.type as string) === 'BUTTON' && (
              <ButtonSettings
                blockId={selectedBlock.id}
                content={selectedBlock.content}
                onChange={handleContentChange}
                onSaveStatus={setSaveStatus}
              />
            )}
            
            {(selectedBlock.type as string) === 'QUOTE' && (
              <QuoteSettings
                blockId={selectedBlock.id}
                content={selectedBlock.content}
                onChange={handleContentChange}
                onSaveStatus={setSaveStatus}
              />
            )}
            {(selectedBlock.type as string) === 'VIDEO' && (
              <VideoSettings
                blockId={selectedBlock.id}
                content={selectedBlock.content}
                onChange={handleContentChange}
                onSaveStatus={setSaveStatus}
              />
            )}
            {(selectedBlock.type as string) === 'GALLERY' && (
              <GallerySettings
                blockId={selectedBlock.id}
                content={selectedBlock.content}
                onChange={handleContentChange}
                onSaveStatus={setSaveStatus}
              />
            )}
            {(selectedBlock.type as string) === 'COLUMN' && (
              <ColumnSettings
                blockId={selectedBlock.id}
                content={selectedBlock.content}
                onChange={handleContentChange}
                onSaveStatus={setSaveStatus}
              />
            )}
            {(selectedBlock.type as string) === 'GRID' && (
              <GridSettings
                blockId={selectedBlock.id}
                content={selectedBlock.content}
                onChange={handleContentChange}
                onSaveStatus={setSaveStatus}
              />
            )}
            {(selectedBlock.type as string) === 'DIV' && (
              <DivSettings
                blockId={selectedBlock.id}
                content={selectedBlock.content}
                onChange={handleContentChange}
                onSaveStatus={setSaveStatus}
              />
            )}
            {(selectedBlock.type as string) === 'CMS' && (
              <CMSSettings
                blockId={selectedBlock.id}
                content={selectedBlock.content}
                onChange={handleContentChange}
                onSaveStatus={setSaveStatus}
              />
            )}
            {(selectedBlock.type as string) === 'LINK_BLOCK' && (
              <LinkBlockSettings
                blockId={selectedBlock.id}
                content={selectedBlock.content}
                onChange={handleContentChange}
                onSaveStatus={setSaveStatus}
              />
            )}
            {(selectedBlock.type as string) === 'LIST' && (
              <ListSettings
                blockId={selectedBlock.id}
                content={selectedBlock.content}
                onChange={handleContentChange}
                onSaveStatus={setSaveStatus}
              />
            )}
            
            {/* Fallback for blocks without specific settings panels */}
            {['HERO', 'CATALOG', 'CONTACT', 'TEXT', 'HEADING', 'PARAGRAPH', 'BUTTON', 'QUOTE', 'VIDEO', 'GALLERY', 'COLUMN', 'GRID', 'DIV', 'CMS', 'LINK_BLOCK', 'LIST', 'CONTAINER'].indexOf(selectedBlock.type) === -1 && (
              <div className="text-center py-10 px-4 text-gray-400">
                <p className="text-[11px]">Elemen ini tidak memiliki pengaturan spesifik. Silakan gunakan tab <b>GAYA</b> untuk mengubah tampilannya.</p>
              </div>
            )}
          </div>
        )}

        {activeBlockTab === 'animation' && (
          <div className="p-4">
            {(selectedBlock.content?.animation as BlockAnimation) ? (
              <AnimationSettings
                animation={(selectedBlock.content?.animation as BlockAnimation)}
                onChange={(newAnimation) => {
                  updateBlockContent(selectedBlock.id, { animation: newAnimation })
                  setSaveStatus('idle')
                }}
              />
            ) : (
              <AnimationSettings
                animation={DEFAULT_ANIMATION}
                onChange={(newAnimation) => {
                  updateBlockContent(selectedBlock.id, { animation: newAnimation })
                  setSaveStatus('idle')
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
