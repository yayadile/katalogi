'use client'

import { useState } from 'react'
import { useEditorStore, type PageInfo } from './store'
import { Plus, X, Check, Trash2, FileText } from 'lucide-react'

type PageManagerProps = {
  websiteId: string
  userId: string
  onPagesChange: (pages: PageInfo[], newCurrentId: string) => void
}

export function PageManager({ websiteId, userId, onPagesChange }: PageManagerProps) {
  const pages = useEditorStore(state => state.pages)
  const currentPageId = useEditorStore(state => state.currentPageId)
  const setCurrentPage = useEditorStore(state => state.setCurrentPage)
  const setBlocks = useEditorStore(state => state.setBlocks)

  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newSlug, setNewSlug] = useState('')

  const handleAddPage = () => {
    if (!newTitle.trim() || !newSlug.trim()) return
    const slug = newSlug.toLowerCase().replace(/[^a-z0-9-]/g, '')
    if (pages.some(p => p.slug === slug)) {
      alert('Slug halaman sudah digunakan')
      return
    }
    const newPage: PageInfo = {
      id: `page-${Date.now()}`,
      slug,
      title: newTitle.trim(),
      sortOrder: pages.length,
    }
    const updatedPages = [...pages, newPage]
    onPagesChange(updatedPages, newPage.id)
    setCurrentPage(newPage.id)
    setBlocks([])
    setIsAdding(false)
    setNewTitle('')
    setNewSlug('')
  }

  const handleDeletePage = (pageId: string) => {
    if (pages.length <= 1) {
      alert('Tidak dapat menghapus halaman terakhir')
      return
    }
    const updatedPages = pages.filter(p => p.id !== pageId).map((p, i) => ({ ...p, sortOrder: i }))
    const newCurrentId = pageId === currentPageId ? updatedPages[0]!.id : currentPageId
    onPagesChange(updatedPages, newCurrentId!)
    if (pageId === currentPageId) {
      setCurrentPage(newCurrentId!)
      setBlocks([])
    }
  }

  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200/60 shadow-sm">
      {pages.map(page => (
        <div
          key={page.id}
          onClick={() => {
            setCurrentPage(page.id)
            setBlocks([])
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded cursor-pointer text-[10px] font-bold uppercase tracking-wider transition-all ${
            currentPageId === page.id
              ? 'bg-white text-purple-800 shadow-sm border border-slate-200/30'
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
          }`}
        >
          <FileText className="w-3 h-3" />
          <span className="truncate max-w-[80px]">{page.title}</span>
          {pages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); handleDeletePage(page.id) }}
              className="p-0.5 rounded hover:bg-red-100 hover:text-red-500 ml-1"
              
            >
              <X className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      ))}
      
      {isAdding ? (
        <div className="flex items-center gap-1 px-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Judul"
            className="w-20 px-1.5 py-1 text-[10px] border border-slate-300 rounded font-medium"
            autoFocus
          />
          <input
            type="text"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="slug"
            className="w-16 px-1.5 py-1 text-[10px] border border-slate-300 rounded font-medium"
          />
          <button onClick={handleAddPage} className="p-1 rounded text-emerald-600 hover:bg-emerald-50">
            <Check className="w-3 h-3" />
          </button>
          <button onClick={() => setIsAdding(false)} className="p-1 rounded text-slate-400 hover:bg-slate-200">
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="p-1.5 rounded text-slate-400 hover:text-purple-800 hover:bg-white transition-all"
          title="Tambah Halaman"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
