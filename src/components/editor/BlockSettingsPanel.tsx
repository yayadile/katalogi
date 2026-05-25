'use client'

import { useState, useEffect } from 'react'
import type { EditorBlock, BlockPosition } from './BlockNavigator'
import type { BlockType } from '@prisma/client'
import type { SaveStatus } from './SaveStatusIndicator'
import { updatePageBlock } from '@/lib/actions/blocks'

import { HeroSettings } from './settings/HeroSettings'
import { CatalogSettings } from './settings/CatalogSettings'
import { ContactSettings } from './settings/ContactSettings'
import { TextSettings } from './settings/TextSettings'
import { ThemeSettings } from './settings/ThemeSettings'
import { HeadingSettings, ParagraphSettings, QuoteSettings } from './settings/TypographySettings'
import { VideoSettings, GallerySettings } from './settings/MediaSettings'
import { ColumnSettings, GridSettings, LinkBlockSettings, ListSettings, DivSettings, CMSSettings, ButtonSettings } from './settings/StructureSettings'
import { UniversalSettings } from './settings/UniversalSettings'

type BlockSettingsPanelProps = {
  selectedBlock: EditorBlock | null
  websiteId: string
  userId: string
  theme: { primaryColor: string; secondaryColor: string; backgroundColor?: string; buttonStyle?: 'sharp' | 'rounded' | 'pill'; fontFamily: string }
  onBlockContentChange: (blockId: string, content: Record<string, unknown>) => void
  onBlockPositionChange?: (blockId: string, position: Partial<BlockPosition>) => void
  onThemeChange: (theme: BlockSettingsPanelProps['theme']) => void
  onSaveStatusChange: (status: SaveStatus) => void
}

export default function BlockSettingsPanel({
  selectedBlock,
  websiteId,
  userId,
  theme,
  onBlockContentChange,
  onBlockPositionChange,
  onThemeChange,
  onSaveStatusChange,
}: BlockSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'block' | 'theme'>('block')
  const [activeBlockTab, setActiveBlockTab] = useState<'style' | 'settings'>('style')
  // Auto-save effect
  useEffect(() => {
    if (!selectedBlock) return

    const saveChanges = async () => {
      onSaveStatusChange('saving')
      
      try {
        const result = await updatePageBlock(
          selectedBlock.id, 
          selectedBlock.content,
          selectedBlock.position as Record<string, unknown> | undefined
        )
        if (result.success) {
          onSaveStatusChange('saved')
        } else {
          onSaveStatusChange('error')
        }
      } catch (error) {
        console.error(error)
        onSaveStatusChange('error')
      }
    }

    const timer = setTimeout(saveChanges, 1000)
    return () => clearTimeout(timer)
  }, [selectedBlock, userId, onSaveStatusChange])

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab('block')}
          className={`flex-1 py-1.5 px-2 rounded-sm text-[11px] font-semibold transition-colors ${
            activeTab === 'block'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Blok
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`flex-1 py-1.5 px-2 rounded-sm text-[11px] font-semibold transition-colors ${
            activeTab === 'theme'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Tema
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'theme' ? (
          <ThemeSettings
            pageId={websiteId}
            userId={userId}
            theme={theme}
            onChange={onThemeChange}
            onSaveStatus={onSaveStatusChange}
          />
        ) : selectedBlock ? (
          <div>
            <div className="mb-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {selectedBlock.type}
              </span>
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
            </div>

            {activeBlockTab === 'style' && (
              <div className="flex flex-col p-2 space-y-4">
                <UniversalSettings 
                  styles={(selectedBlock.content?.styles || {}) as Record<string, string | number>} 
                  onChange={(updatedStyles) => {
                    onBlockContentChange(selectedBlock.id, {
                      ...selectedBlock.content,
                      styles: updatedStyles
                    })
                  }} 
                />
              </div>
            )}

            {activeBlockTab === 'settings' && (
              <div className="space-y-6">
                {(selectedBlock.type as BlockType) === 'HERO' && (
                  <HeroSettings
                    blockId={selectedBlock.id}
                    content={selectedBlock.content}
                    onChange={(c) => onBlockContentChange(selectedBlock.id, c)}
                    onSaveStatus={onSaveStatusChange}
                  />
                )}
                {(selectedBlock.type as BlockType) === 'CATALOG' && (
                  <CatalogSettings
                    blockId={selectedBlock.id}
                    content={selectedBlock.content}
                    onChange={(c) => onBlockContentChange(selectedBlock.id, c)}
                    onSaveStatus={onSaveStatusChange}
                  />
                )}
                {(selectedBlock.type as BlockType) === 'CONTACT' && (
                  <ContactSettings
                    blockId={selectedBlock.id}
                    content={selectedBlock.content}
                    onChange={(c) => onBlockContentChange(selectedBlock.id, c)}
                    onSaveStatus={onSaveStatusChange}
                  />
                )}
                {(selectedBlock.type as BlockType) === 'TEXT' && (
                  <TextSettings
                    blockId={selectedBlock.id}
                    content={selectedBlock.content}
                    onChange={(c) => onBlockContentChange(selectedBlock.id, c)}
                    onSaveStatus={onSaveStatusChange}
                  />
                )}
                {(selectedBlock.type as string) === 'HEADING' && (
                  <HeadingSettings
                    blockId={selectedBlock.id}
                    content={selectedBlock.content}
                    onChange={(c) => onBlockContentChange(selectedBlock.id, c)}
                    onSaveStatus={onSaveStatusChange}
                  />
                )}
                {(selectedBlock.type as string) === 'PARAGRAPH' && (
                  <ParagraphSettings
                    blockId={selectedBlock.id}
                    content={selectedBlock.content}
                    onChange={(c) => onBlockContentChange(selectedBlock.id, c)}
                    onSaveStatus={onSaveStatusChange}
                  />
                )}
                {(selectedBlock.type as string) === 'QUOTE' && (
                  <QuoteSettings
                    blockId={selectedBlock.id}
                    content={selectedBlock.content}
                    onChange={(c) => onBlockContentChange(selectedBlock.id, c)}
                    onSaveStatus={onSaveStatusChange}
                  />
                )}
                {(selectedBlock.type as string) === 'VIDEO' && (
                  <VideoSettings
                    blockId={selectedBlock.id}
                    content={selectedBlock.content}
                    onChange={(c) => onBlockContentChange(selectedBlock.id, c)}
                    onSaveStatus={onSaveStatusChange}
                  />
                )}
                {(selectedBlock.type as string) === 'GALLERY' && (
                  <GallerySettings
                    blockId={selectedBlock.id}
                    content={selectedBlock.content}
                    onChange={(c) => onBlockContentChange(selectedBlock.id, c)}
                    onSaveStatus={onSaveStatusChange}
                  />
                )}
                {(selectedBlock.type as string) === 'COLUMN' && (
                  <ColumnSettings
                    blockId={selectedBlock.id}
                    content={selectedBlock.content}
                    onChange={(c) => onBlockContentChange(selectedBlock.id, c)}
                    onSaveStatus={onSaveStatusChange}
                  />
                )}
                {(selectedBlock.type as string) === 'GRID' && (
                  <GridSettings
                    blockId={selectedBlock.id}
                    content={selectedBlock.content}
                    onChange={(c) => onBlockContentChange(selectedBlock.id, c)}
                    onSaveStatus={onSaveStatusChange}
                  />
                )}
                {(selectedBlock.type as string) === 'DIV' && (
                  <DivSettings
                    blockId={selectedBlock.id}
                    content={selectedBlock.content}
                    onChange={(c) => onBlockContentChange(selectedBlock.id, c)}
                    onSaveStatus={onSaveStatusChange}
                  />
                )}
                {(selectedBlock.type as string) === 'CMS' && (
                  <CMSSettings
                    blockId={selectedBlock.id}
                    content={selectedBlock.content}
                    onChange={(c) => onBlockContentChange(selectedBlock.id, c)}
                    onSaveStatus={onSaveStatusChange}
                  />
                )}
                {(selectedBlock.type as string) === 'LINK_BLOCK' && (
                  <LinkBlockSettings
                    blockId={selectedBlock.id}
                    content={selectedBlock.content}
                    onChange={(c) => onBlockContentChange(selectedBlock.id, c)}
                    onSaveStatus={onSaveStatusChange}
                  />
                )}
                {(selectedBlock.type as string) === 'LIST' && (
                  <ListSettings
                    blockId={selectedBlock.id}
                    content={selectedBlock.content}
                    onChange={(c) => onBlockContentChange(selectedBlock.id, c)}
                    onSaveStatus={onSaveStatusChange}
                  />
                )}
                {(selectedBlock.type as string) === 'BUTTON' && (
                  <ButtonSettings
                    blockId={selectedBlock.id}
                    content={selectedBlock.content}
                    onChange={(c) => onBlockContentChange(selectedBlock.id, c)}
                    onSaveStatus={onSaveStatusChange}
                  />
                )}

                {/* Empty State Fallback */}
                {['HERO', 'CATALOG', 'CONTACT', 'TEXT', 'HEADING', 'PARAGRAPH', 'QUOTE', 'VIDEO', 'GALLERY', 'COLUMN', 'GRID', 'DIV', 'CMS', 'LINK_BLOCK', 'LIST', 'BUTTON'].indexOf(selectedBlock.type) === -1 && (
                  <div className="text-center py-10 px-4 text-gray-400">
                    <svg className="w-8 h-8 mx-auto mb-2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-[11px]">Elemen ini tidak memiliki pengaturan spesifik. Silakan gunakan tab <b>GAYA</b> untuk mengubah tampilannya.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 text-sm">
            <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
            </svg>
            Klik blok di kanvas untuk mulai mengedit
          </div>
        )}
      </div>
    </div>
  )
}
