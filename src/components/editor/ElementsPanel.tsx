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
    <div className="flex flex-col h-full bg-white/50 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 px-5 py-4">
        <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">Tambah Blok</h2>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-8">
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Cari elemen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
            />
          </div>

          <div>
            <h3 className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest mb-4 ml-1">Komponen Utama</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {MAIN_BLOCKS.filter(b => b.label.toLowerCase().includes(searchQuery.toLowerCase())).map((block) => (
                <button
                  key={block.type}
                  onClick={() => handleAddElement(block.type)}
                  className="flex flex-col items-center justify-center gap-2.5 p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-[0_8px_20px_rgb(99,102,241,0.08)] transition-all duration-300 group relative overflow-hidden active:scale-95"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-slate-400 group-hover:text-indigo-600 transition-all duration-300 group-hover:scale-110 relative z-10">
                    {block.icon}
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 group-hover:text-indigo-900 text-center leading-tight relative z-10 uppercase tracking-widest">
                    {block.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-4 ml-1">Tipografi</h3>
            <div className="grid grid-cols-2 gap-3">
              {TYPOGRAPHY_BLOCKS.filter(b => b.label.toLowerCase().includes(searchQuery.toLowerCase())).map((block) => (
                <button
                  key={block.type}
                  onClick={() => handleAddElement(block.type)}
                  className="flex flex-col items-center justify-center gap-2.5 p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-[0_8px_20px_rgb(99,102,241,0.08)] transition-all duration-300 group relative overflow-hidden active:scale-95"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-slate-400 group-hover:text-indigo-600 transition-all duration-300 group-hover:scale-110 relative z-10">
                    {block.icon}
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 group-hover:text-indigo-900 text-center leading-tight relative z-10 uppercase tracking-widest">
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