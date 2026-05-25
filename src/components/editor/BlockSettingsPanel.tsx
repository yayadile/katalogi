'use client'

import { useState } from 'react'
import type { EditorBlock } from './BlockNavigator'
import type { BlockType } from '@prisma/client'
import type { SaveStatus } from './SaveStatusIndicator'

import { HeroSettings } from './settings/HeroSettings'
import { CatalogSettings } from './settings/CatalogSettings'
import { ContactSettings } from './settings/ContactSettings'
import { TextSettings } from './settings/TextSettings'
import { ThemeSettings } from './settings/ThemeSettings'

type BlockSettingsPanelProps = {
  selectedBlock: EditorBlock | null
  websiteId: string
  userId: string
  theme: { primaryColor: string; secondaryColor: string; fontFamily: string }
  onBlockContentChange: (blockId: string, content: Record<string, unknown>) => void
  onThemeChange: (theme: BlockSettingsPanelProps['theme']) => void
  onSaveStatusChange: (status: SaveStatus) => void
}

export default function BlockSettingsPanel({
  selectedBlock,
  websiteId,
  userId,
  theme,
  onBlockContentChange,
  onThemeChange,
  onSaveStatusChange,
}: BlockSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'block' | 'theme'>('block')

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab('block')}
          className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
            activeTab === 'block'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Block
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
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
        ) : (
          <div className="text-center py-16 text-gray-400 text-sm">
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
