'use client'

import React, { useState } from 'react'
import type { BlockType } from '@prisma/client'
import { useEditorStore } from './store'
import { 
  Type, 
  Image as ImageIcon, 
  LayoutTemplate, 
  Mail, 
  Box, 
  Search,
  LayoutGrid,
  Columns,
  List,
  Heading1,
  AlignLeft,
  Quote,
  Video,
  Link2,
  MousePointerClick
} from 'lucide-react'

// Real elements grouped by category
const MAIN_BLOCKS: { type: string; label: string; icon: React.ReactNode }[] = [
  { type: 'HERO', label: 'Hero', icon: <LayoutTemplate className="w-5 h-5" /> },
  { type: 'CATALOG', label: 'Katalog', icon: <Box className="w-5 h-5" /> },
  { type: 'GALLERY', label: 'Galeri', icon: <ImageIcon className="w-5 h-5" /> },
  { type: 'CONTACT', label: 'Kontak', icon: <Mail className="w-5 h-5" /> },
  { type: 'BUTTON', label: 'Tombol', icon: <MousePointerClick className="w-5 h-5" /> },
]

const TYPOGRAPHY_BLOCKS: { type: string; label: string; icon: React.ReactNode }[] = [
  { type: 'HEADING', label: 'Judul', icon: <Heading1 className="w-5 h-5" /> },
  { type: 'PARAGRAPH', label: 'Paragraf', icon: <AlignLeft className="w-5 h-5" /> },
  { type: 'LIST', label: 'Daftar', icon: <List className="w-5 h-5" /> },
  { type: 'QUOTE', label: 'Kutipan', icon: <Quote className="w-5 h-5" /> },
]

const MEDIA_BLOCKS: { type: string; label: string; icon: React.ReactNode }[] = [
  { type: 'VIDEO', label: 'Video', icon: <Video className="w-5 h-5" /> },
]

export default function ElementsPanel() {
  const [searchQuery, setSearchQuery] = useState('')
  const addBlock = useEditorStore(state => state.addBlock)
  const currentCount = useEditorStore(state => state.blocks.length)

  const handleAddElement = (type: string) => {
    addBlock({
      id: `temp-${crypto.randomUUID()}`, // Would be replaced by actual ID upon saving to DB
      type: type as BlockType,
      content: { style: {} },
      sortOrder: currentCount + 1,
    })
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between mb-2 border-b border-gray-200 px-3 py-2 bg-white">
        <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Tambah Blok</h2>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5 bg-white">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari elemen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded text-[11px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div>
            <h3 className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider mb-2">Komponen Utama</h3>
            <div className="grid grid-cols-2 gap-1.5 mb-4">
              {MAIN_BLOCKS.filter(b => b.label.toLowerCase().includes(searchQuery.toLowerCase())).map((block) => (
                <button
                  key={block.type}
                  onClick={() => handleAddElement(block.type)}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:ring-1 hover:ring-indigo-100 hover:bg-gray-50 transition-all group shadow-sm"
                >
                  <div className="text-gray-400 group-hover:text-indigo-500 transition-colors">
                    {block.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-gray-600 group-hover:text-indigo-700 text-center leading-tight">
                    {block.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Tipografi</h3>
            <div className="grid grid-cols-2 gap-1.5">
              {TYPOGRAPHY_BLOCKS.filter(b => b.label.toLowerCase().includes(searchQuery.toLowerCase())).map((block) => (
                <button
                  key={block.type}
                  onClick={() => handleAddElement(block.type)}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:ring-1 hover:ring-indigo-100 hover:bg-gray-50 transition-all group shadow-sm"
                >
                  <div className="text-gray-400 group-hover:text-indigo-500 transition-colors">
                    {block.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-gray-600 group-hover:text-indigo-700 text-center leading-tight">
                    {block.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

      </div>
    </div>
  )
}