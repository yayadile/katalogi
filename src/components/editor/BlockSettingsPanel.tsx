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
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-4">
        <button
          onClick={() => setActiveTab('block')}
          className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
            activeTab === 'block'
              ? 'text-indigo-400 border-b-2 border-indigo-500'
              : 'text-slate-500 hover:text-slate-400'
          }`}
        >
          Block
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
            activeTab === 'theme'
              ? 'text-indigo-400 border-b-2 border-indigo-500'
              : 'text-slate-500 hover:text-slate-400'
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
          <div className="space-y-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {selectedBlock.type}
              </span>
            </div>

            {/* Panel Tabs */}
            <div className="flex items-center gap-4 border-b border-white/5 mb-6 pb-2">
              <button 
                onClick={() => setActiveTab('block')}
                className={`text-sm font-medium ${activeTab === 'block' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Style
              </button>
              <button 
                onClick={() => setActiveTab('theme')}
                className={`text-sm font-medium ${activeTab === 'theme' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Settings
              </button>
            </div>

            {activeTab === 'block' && (
              <div className="space-y-6">
                {/* Common Position & Size Settings (Layout & Sizing equivalent) */}
                <section className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                  <h3 className="text-white font-semibold text-sm mb-4">
                    Layout & Sizing
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Position X</label>
                      <input 
                        type="number"
                        value={Math.round(selectedBlock.position?.x || 0)}
                        onChange={(e) => onBlockPositionChange?.(selectedBlock.id, { x: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Position Y</label>
                      <input 
                        type="number"
                        value={Math.round(selectedBlock.position?.y || 0)}
                        onChange={(e) => onBlockPositionChange?.(selectedBlock.id, { y: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Width</label>
                      <input 
                        type="text"
                        value={selectedBlock.position?.width || '100%'}
                        onChange={(e) => onBlockPositionChange?.(selectedBlock.id, { width: e.target.value })}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Height</label>
                      <input 
                        type="text"
                        value={selectedBlock.position?.height || 'auto'}
                        onChange={(e) => onBlockPositionChange?.(selectedBlock.id, { height: e.target.value })}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'theme' && (
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
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-600 text-sm">
            <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
            </svg>
            Klik block di canvas untuk edit
          </div>
        )}
      </div>
    </div>
  )
}