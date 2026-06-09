'use client'

import { useState } from 'react'
import type { BlockType } from '@prisma/client'
import { useEditorStore } from './store'
import { UniversalSettings } from './settings/UniversalSettings'

import { HeroSettings } from './settings/HeroSettings'
import { CatalogSettings } from './settings/CatalogSettings'
import { ContactSettings } from './settings/ContactSettings'
import { TextSettings } from './settings/TextSettings'
import { HeadingSettings, ParagraphSettings, QuoteSettings } from './settings/TypographySettings'
import { VideoSettings, GallerySettings } from './settings/MediaSettings'
import { ColumnSettings, GridSettings, LinkBlockSettings, ListSettings, DivSettings, CMSSettings, ButtonSettings } from './settings/StructureSettings'

export default function BlockSettingsPanel() {
  const [activeTab, setActiveTab] = useState<'style' | 'content'>('style')

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
      <div className="flex flex-col h-full bg-white/50 backdrop-blur-xl border-l border-white shadow-[-4px_0_30px_rgb(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 px-5 py-4">
          <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">Pengaturan Blok</h2>
        </div>
        <div className="text-center py-20 px-6 text-slate-400 text-sm flex flex-col items-center justify-center flex-1">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
            </svg>
          </div>
          <p className="font-bold text-slate-500 max-w-[200px] leading-relaxed">Klik blok di kanvas untuk mulai mengedit detailnya.</p>
        </div>
      </div>
    )
  }

  const handleContentChange = (newContent: Record<string, unknown>) => {
    updateBlockContent(selectedBlock.id, newContent)
    setSaveStatus('idle')
  }

  const currentStyles = selectedSubId
    ? ((selectedBlock.content?.subStyles as Record<string, unknown>)?.[selectedSubId] || {})
    : (selectedBlock.content?.style || {})

  return (
    <div className="flex flex-col h-full bg-white/50 backdrop-blur-xl border-l border-white shadow-[-4px_0_30px_rgb(0,0,0,0.02)]">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-white/40">
        <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest truncate">
          {selectedBlock.type} {selectedSubId ? `> ${selectedSubId}` : ''}
        </h2>
      </div>

      <div className="flex items-center p-2 border-b border-slate-100 bg-slate-50/50 gap-1">
        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-2 px-2 text-[10px] font-extrabold tracking-widest uppercase rounded-xl transition-all ${activeTab === 'style' ? 'bg-white shadow-[0_2px_10px_rgb(0,0,0,0.04)] text-indigo-600 border border-slate-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
        >
          Tampilan
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-2 px-2 text-[10px] font-extrabold tracking-widest uppercase rounded-xl transition-all ${activeTab === 'content' ? 'bg-white shadow-[0_2px_10px_rgb(0,0,0,0.04)] text-indigo-600 border border-slate-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
        >
          Konten
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-transparent">
        {activeTab === 'style' && (
          <div className="flex flex-col p-4 space-y-6">
            {selectedSubId && (
              <div className="bg-indigo-50/50 border border-indigo-100 text-indigo-700 text-[10px] font-bold px-4 py-3 rounded-xl mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                Mengedit gaya khusus: <span className="font-extrabold uppercase tracking-widest">{selectedSubId}</span>
              </div>
            )}
            <UniversalSettings
              styles={currentStyles as Record<string, string | number>}
              htmlId={!selectedSubId ? (selectedBlock.content?.htmlId as string) : undefined}
              onChange={(updatedStyles, htmlId) => {
                if (selectedSubId) {
                  updateSubElementStyle(selectedBlock.id, selectedSubId, updatedStyles)
                } else {
                  updateBlockStyle(selectedBlock.id, updatedStyles)
                  if (htmlId !== undefined) {
                    updateBlockContent(selectedBlock.id, { htmlId })
                  }
                }
              }}
            />
          </div>
        )}

        {activeTab === 'content' && (
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

            {['HERO', 'CATALOG', 'CONTACT', 'TEXT', 'HEADING', 'PARAGRAPH', 'BUTTON', 'QUOTE', 'VIDEO', 'GALLERY', 'COLUMN', 'GRID', 'DIV', 'CMS', 'LINK_BLOCK', 'LIST', 'CONTAINER'].indexOf(selectedBlock.type) === -1 && (
              <div className="text-center py-10 px-4 text-gray-400">
                <p className="text-[11px]">Elemen ini tidak memiliki pengaturan konten spesifik.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
