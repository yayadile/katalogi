'use client'

import { useState } from 'react'
import { addPageBlock } from '@/lib/actions/blocks'
import type { BlockType } from '@prisma/client'
import { type EditorBlock } from './BlockNavigator'
import { SECTION_LAYOUTS } from '@/lib/templates'
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
]

const STRUCTURE_BLOCKS: { type: string; label: string; icon: React.ReactNode }[] = [
  { type: 'DIV', label: 'Div Block', icon: <Box className="w-5 h-5" /> },
  { type: 'COLUMN', label: 'Kolom', icon: <Columns className="w-5 h-5" /> },
  { type: 'GRID', label: 'Grid', icon: <LayoutGrid className="w-5 h-5" /> },
  { type: 'LINK_BLOCK', label: 'Link Block', icon: <Link2 className="w-5 h-5" /> },
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

export default function ElementsPanel({
  websiteId,
  currentCount,
  onBlockAdded,
}: {
  websiteId: string
  currentCount: number
  onBlockAdded: (block: EditorBlock) => void
}) {
  const [activeTab, setActiveTab] = useState<'elements' | 'layouts'>('elements')
  const [loading, setLoading] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleAdd = async (type: string) => {
    setLoading(type)
    try {
      const result = await addPageBlock(websiteId, type as unknown as BlockType, currentCount + 1)
      if (result.success && result.data) {
        onBlockAdded({
          ...result.data,
          position: (result.data.position || {}) as unknown as EditorBlock['position'],
        } as unknown as EditorBlock)
      } else {
        alert(result.error || 'Terjadi kesalahan saat menambahkan elemen.')
      }
    } catch (e) {
      console.error(e)
      alert('Sistem mengalami gangguan saat menambahkan elemen.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between mb-2 border-b border-gray-200 px-3 py-2 bg-white">
        <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Tambah Blok</h2>
      </div>

      {/* Tabs */}
      <div className="flex p-2 gap-1 border-b border-gray-100 bg-gray-50/50">
        <button 
          className={`flex-1 py-1.5 px-2 rounded-sm text-[11px] font-semibold transition-colors ${
            activeTab === 'elements' ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('elements')}
        >
          Elemen
        </button>
        <button 
          className={`flex-1 py-1.5 px-2 rounded-sm text-[11px] font-semibold transition-colors ${
            activeTab === 'layouts' ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('layouts')}
        >
          Tata Letak
        </button>
      </div>

      {activeTab === 'elements' ? (
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
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

          {/* Main Components Section */}
          <div>
            <h3 className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider mb-2">Komponen Utama</h3>
            <div className="grid grid-cols-2 gap-1.5 mb-4">
              {MAIN_BLOCKS.filter(b => b.label.toLowerCase().includes(searchQuery.toLowerCase())).map((block) => (
                <button
                  key={block.type}
                  onClick={() => handleAdd(block.type)}
                  disabled={!!loading}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:ring-1 hover:ring-indigo-100 hover:bg-gray-50 transition-all group disabled:opacity-50 shadow-sm"
                >
                  <div className={`text-gray-400 group-hover:text-indigo-500 transition-colors ${loading === block.type ? 'animate-pulse' : ''}`}>
                    {block.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-gray-600 group-hover:text-indigo-700 text-center leading-tight">
                    {loading === block.type ? '...' : block.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Structure Section */}
          <div>
            <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Struktur</h3>
            <div className="grid grid-cols-2 gap-1.5">
              {STRUCTURE_BLOCKS.filter(b => b.label.toLowerCase().includes(searchQuery.toLowerCase())).map((block) => (
                <button
                  key={block.type}
                  onClick={() => handleAdd(block.type)}
                  disabled={!!loading}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:ring-1 hover:ring-indigo-100 hover:bg-gray-50 transition-all group disabled:opacity-50 shadow-sm"
                >
                  <div className={`text-gray-400 group-hover:text-indigo-500 transition-colors ${loading === block.type ? 'animate-pulse' : ''}`}>
                    {block.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-gray-600 group-hover:text-indigo-700 text-center leading-tight">
                    {loading === block.type ? '...' : block.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Typography Section */}
          <div>
            <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Tipografi</h3>
            <div className="grid grid-cols-2 gap-1.5">
              {TYPOGRAPHY_BLOCKS.filter(b => b.label.toLowerCase().includes(searchQuery.toLowerCase())).map((block) => (
                <button
                  key={block.type}
                  onClick={() => handleAdd(block.type)}
                  disabled={!!loading}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:ring-1 hover:ring-indigo-100 hover:bg-gray-50 transition-all group disabled:opacity-50 shadow-sm"
                >
                  <div className={`text-gray-400 group-hover:text-indigo-500 transition-colors ${loading === block.type ? 'animate-pulse' : ''}`}>
                    {block.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-gray-600 group-hover:text-indigo-700 text-center leading-tight">
                    {loading === block.type ? '...' : block.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Media Section */}
          <div className="pb-4">
            <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Media</h3>
            <div className="grid grid-cols-2 gap-1.5">
              {MEDIA_BLOCKS.filter(b => b.label.toLowerCase().includes(searchQuery.toLowerCase())).map((block) => (
                <button
                  key={block.type}
                  onClick={() => handleAdd(block.type)}
                  disabled={!!loading}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:ring-1 hover:ring-indigo-100 hover:bg-gray-50 transition-all group disabled:opacity-50 shadow-sm"
                >
                  <div className={`text-gray-400 group-hover:text-indigo-500 transition-colors ${loading === block.type ? 'animate-pulse' : ''}`}>
                    {block.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-gray-600 group-hover:text-indigo-700 text-center leading-tight">
                    {loading === block.type ? '...' : block.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-white">
          <div className="flex items-center gap-1.5 mb-2">
            <LayoutTemplate className="w-3.5 h-3.5 text-gray-400" />
            <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Tata Letak Jadi</h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {SECTION_LAYOUTS.map((layout) => (
              <button
                key={layout.id}
                onClick={async () => {
                  setLoading(layout.id as string)
                  try {
                    for (const block of layout.blocks) {
                      const res = await addPageBlock(
                        websiteId,
                        block.type as unknown as BlockType,
                        currentCount + 1,
                        block.content
                      )
                      if (res.success && res.data) {
                        onBlockAdded({
                          ...res.data,
                          position: (res.data.position || {}) as unknown as EditorBlock['position'],
                        } as unknown as EditorBlock)
                      } else {
                        alert(res.error || `Terjadi kesalahan saat menambahkan block ${block.type}.`)
                      }
                    }
                  } catch (e) {
                    console.error(e)
                    alert('Sistem mengalami gangguan saat menambahkan layout.')
                  } finally {
                    setLoading(null)
                  }
                }}
                disabled={!!loading}
                className="text-left p-4 bg-white border border-gray-300 rounded-xl hover:border-indigo-600 hover:ring-1 hover:ring-indigo-600 transition-all group disabled:opacity-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{layout.name}</span>
                  {loading === layout.id && <span className="text-xs text-indigo-600 animate-pulse font-bold">Menambahkan...</span>}
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">{layout.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
