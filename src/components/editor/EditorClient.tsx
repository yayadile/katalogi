'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEditorStore } from './store'
import type { EditorBlock, ThemeConfig, PageInfo } from './store'
import BlockNavigator from '@/components/editor/BlockNavigator'
import CanvasPreview from '@/components/editor/CanvasPreview'
import BlockSettingsPanel from '@/components/editor/BlockSettingsPanel'
import ElementsPanel from '@/components/editor/ElementsPanel'
import { publishWebsite, updateWebsite } from '@/lib/actions/website'
import { updatePageBlock, reorderBlocks, addPageBlock, deletePageBlock } from '@/lib/actions/blocks'
import { ThemeSettings } from '@/components/editor/settings/ThemeSettings'
import { PageManager } from '@/components/editor/PageManager'
import EditorGuide from '@/components/editor/EditorGuide'
import SaveStatusIndicator from '@/components/editor/SaveStatusIndicator'
import { 
  Plus, 
  LayoutTemplate, 
  Palette, 
  ArrowLeft, 
  X, 
  Check, 
  Loader2,
  Undo,
  Redo
} from 'lucide-react'

type EditorClientProps = {
  websiteId: string
  userId: string
  websiteTitle: string
  websiteSlug: string
  isPublished: boolean
  initialBlocks: EditorBlock[]
  initialTheme: unknown
  initialPages?: PageInfo[]
  initialPageId?: string
}

export default function EditorClient({
  websiteId,
  userId,
  websiteTitle,
  websiteSlug,
  isPublished: initialPublished,
  initialBlocks,
  initialTheme,
  initialPages,
  initialPageId,
}: EditorClientProps) {
  const router = useRouter()
  const setBlocks = useEditorStore((state) => state.setBlocks)
  const setTheme = useEditorStore((state) => state.setTheme)
  const setPages = useEditorStore((state) => state.setPages)
  const theme = useEditorStore((state) => state.theme)
  const leftPanel = useEditorStore((state) => state.leftPanel)
  const setLeftPanel = useEditorStore((state) => state.setLeftPanel)
  const previewMode = useEditorStore((state) => state.previewMode)
  const setPreviewMode = useEditorStore((state) => state.setPreviewMode)
  const saveStatus = useEditorStore((state) => state.saveStatus)
  const setSaveStatus = useEditorStore((state) => state.setSaveStatus)
  const blocks = useEditorStore((state) => state.blocks)
  const past = useEditorStore((state) => state.past)
  const future = useEditorStore((state) => state.future)
  const undo = useEditorStore((state) => state.undo)
  const redo = useEditorStore((state) => state.redo)
  const duplicateBlock = useEditorStore((state) => state.duplicateBlock)
  const deleteBlock = useEditorStore((state) => state.deleteBlock)
  const selectedId = useEditorStore((state) => state.selectedId)

  // Local UX States
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(initialPublished)
  
  // Site settings local inputs
  const [siteTitle, setSiteTitle] = useState(websiteTitle)
  const [siteSlug, setSiteSlug] = useState(websiteSlug)
  const [isSavingIdentity, setIsSavingIdentity] = useState(false)
  const [activeSettingsTab, setActiveSettingsTab] = useState<'theme' | 'identity'>('theme')
  const [showCopySuccess, setShowCopySuccess] = useState(false)

  // Fix hydration mismatch for undo/redo buttons
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Initialize store on mount exactly once
  const isInitializedRef = useRef(false)
  const prevBlocksRef = useRef<string>('')
  useEffect(() => {
    if (isInitializedRef.current) return
    isInitializedRef.current = true

    const formattedBlocks = initialBlocks.map(b => ({
      ...b,
      content: b.content || { style: {} },
    }))
    setBlocks(formattedBlocks)
    setTheme(initialTheme as ThemeConfig)

    // Baseline the auto-saver with what's actually in the DB, so the FIRST block
    // added to an empty site is correctly detected as "new" and gets saved.
    prevBlocksRef.current = JSON.stringify(formattedBlocks)
    
    if (initialPages && initialPageId) {
      setPages(initialPages, initialPageId)
    }
  }, [initialBlocks, initialTheme, setBlocks, setTheme, initialPages, initialPageId, setPages])

  // Keyboard Shortcuts Listener for high-speed professional editing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts if the user is typing in input, textarea, or contenteditable fields
      const activeEl = document.activeElement
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true')
      ) {
        return
      }

      // Ctrl + Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        undo()
      }

      // Ctrl + Y / Ctrl + Shift + Z: Redo
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault()
        redo()
      }

      // Ctrl + D: Duplicate block (preventing default browser bookmark behavior)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        if (selectedId) {
          e.preventDefault()
          duplicateBlock(selectedId)
        }
      }

      // Backspace / Delete: Direct high-speed delete with Undo recovery support
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          e.preventDefault()
          deleteBlock(selectedId)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId, undo, redo, duplicateBlock, deleteBlock])

  // Seamless Debounced Background Auto-Saver
  useEffect(() => {
    if (blocks.length === 0) return

    const blocksJson = JSON.stringify(blocks)
    if (prevBlocksRef.current === '') {
      prevBlocksRef.current = blocksJson
      return
    }

    if (prevBlocksRef.current === blocksJson) return

    const timeout = setTimeout(async () => {
      setSaveStatus('saving')
      try {
        const prevBlocks = JSON.parse(prevBlocksRef.current) as EditorBlock[]
        
        // 1. Identify added and deleted blocks
        const addedBlocks = blocks.filter(b => !prevBlocks.some(pb => pb.id === b.id))
        const deletedBlocks = prevBlocks.filter(pb => !blocks.some(b => b.id === pb.id))
        const existingBlocks = blocks.filter(b => prevBlocks.some(pb => pb.id === b.id))

        // Target page for newly created blocks (falls back to the website's first page).
        const currentPageId = useEditorStore.getState().currentPageId || initialPageId || undefined
        
        // 2. Add new blocks to DB first (so reorder doesn't fail due to missing IDs)
        for (const block of addedBlocks) {
          const res = await addPageBlock(
            websiteId,
            block.type,
            block.sortOrder,
            block.content,
            currentPageId, // real Page id, not the website id
            block.id       // Keep the ID from local store so it matches
          )
          if (!res.success) {
            throw new Error(res.error || 'Gagal menyimpan block baru.')
          }
        }
        
        // 3. Delete removed blocks from DB
        for (const block of deletedBlocks) {
          await deletePageBlock(block.id)
        }

        // 4. Update modified existing blocks
        for (const block of existingBlocks) {
          const prevBlock = prevBlocks.find(pb => pb.id === block.id)
          if (prevBlock && JSON.stringify(prevBlock.content) !== JSON.stringify(block.content)) {
            await updatePageBlock(block.id, block.content)
          }
        }

        // 5. Persist block order changes if they differ
        const orderChanged = blocks.map(b => b.id).join(',') !== prevBlocks.map(b => b.id).join(',')
        if (orderChanged) {
          await reorderBlocks(websiteId, blocks.map(b => b.id))
        }

        prevBlocksRef.current = blocksJson
        setSaveStatus('saved')
      } catch (err) {
        console.error("Auto-save failed:", err)
        setSaveStatus('error')
      }
    }, 1200) // 1.2s debounce for highly fluid auto-saves

    return () => clearTimeout(timeout)
  }, [blocks, websiteId, setSaveStatus, initialPageId])

  // Publish site handler
  const handlePublish = async () => {
    setIsPublishing(true)
    setSaveStatus('saving')
    try {
      const res = await publishWebsite(websiteId, userId, true)
      if (res.success) {
        setIsPublished(true)
        setSaveStatus('saved')
        setIsPublishModalOpen(true)
      } else {
        setSaveStatus('error')
        alert(res.error || "Gagal mempublikasikan katalog")
      }
    } catch (err) {
      setSaveStatus('error')
      console.error(err)
    } finally {
      setIsPublishing(false)
    }
  };

  // Site Identity Save Handler
  const handleSaveIdentity = async () => {
    if (!siteTitle.trim() || !siteSlug.trim()) {
      alert("Judul dan slug tidak boleh kosong")
      return
    }
    setIsSavingIdentity(true)
    setSaveStatus('saving')
    try {
      const res = await updateWebsite(websiteId, userId, {
        title: siteTitle,
        slug: siteSlug
      })
      if (res.success) {
        setSaveStatus('saved')
        alert("Identitas katalog berhasil diperbarui!")
      } else {
        setSaveStatus('error')
        alert(res.error || "Gagal memperbarui identitas")
      }
    } catch (err) {
      setSaveStatus('error')
      console.error(err)
    } finally {
      setIsSavingIdentity(false)
    }
  }

  // Copy live link to clipboard
  const handleCopyLink = () => {
    const liveLink = `${window.location.protocol}//${window.location.host}/${siteSlug}`
    navigator.clipboard.writeText(liveLink)
    setShowCopySuccess(true)
    setTimeout(() => setShowCopySuccess(false), 2000)
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans overflow-hidden select-none relative text-slate-800">
      
      {/* ──────────────── Top Bar ──────────────── */}
      {!isPreviewMode && (
        <header className="flex items-center justify-between px-6 py-3.5 bg-white/60 backdrop-blur-xl border-b border-white shadow-[0_4px_20px_rgb(0,0,0,0.02)] shrink-0 z-30 text-slate-800">
          {/* Brand Info & Back Action */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 shrink-0"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-slate-200/60 mx-1" />
            
            {/* Undo / Redo Actions */}
            <div className="flex items-center bg-white/50 backdrop-blur-sm rounded-xl p-1 shadow-[0_2px_10px_rgb(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.8)] shrink-0 border border-slate-100">
              <button
                onClick={() => undo()}
                disabled={!isMounted || past.length === 0}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all duration-200"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={() => redo()}
                disabled={!isMounted || future.length === 0}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all duration-200"
                title="Redo (Ctrl+Y)"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>
            
            <div className="w-px h-5 bg-slate-200" />
            
            <div className="flex items-center gap-2 min-w-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-slate-900 font-bold text-xs uppercase tracking-wider truncate leading-none">{siteTitle}</p>
                  {isPublished ? (
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-200/50">Live</span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-slate-100 text-slate-500 border border-slate-200">Draf</span>
                  )}
                </div>
                <p className="text-slate-400 text-[10px] font-semibold truncate mt-0.5">/{siteSlug}</p>
              </div>
            </div>

            <div className="w-px h-5 bg-slate-200" />
            
            <PageManager
              websiteId={websiteId}
              userId={userId}
              onPagesChange={(newPages, newCurrentId) => {
                setPages(newPages, newCurrentId)
              }}
            />
          </div>

          {/* Device Toggles */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-white/50 backdrop-blur-sm rounded-full p-1 border border-white shadow-[0_4px_15px_rgb(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.8)] gap-1">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-2.5 rounded-full transition-all duration-500 ${
                previewMode === 'desktop' 
                  ? 'bg-white text-indigo-600 shadow-[0_2px_10px_rgb(99,102,241,0.1)] border border-slate-100 scale-105' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
              }`}
              title="Desktop Layout"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-2.5 rounded-full transition-all duration-500 ${
                previewMode === 'mobile' 
                  ? 'bg-white text-indigo-600 shadow-md border border-slate-200/50 scale-110' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
              }`}
              title="Mobile Layout"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          {/* Quick Actions (Right, static solid colors, minimal decoration) */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="scale-90 origin-right">
              <SaveStatusIndicator status={saveStatus} />
            </div>
            
            <div className="w-px h-5 bg-slate-200" />
            
            {/* Guide Button */}
            <EditorGuide />
            
            <button
              onClick={() => setIsPreviewMode(true)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all text-xs font-bold shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100"
            >
              Pratinjau
            </button>

            {/* Solid Publish Button */}
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all disabled:opacity-50 shadow-[0_4px_15px_rgb(99,102,241,0.3)] hover:shadow-[0_6px_20px_rgb(99,102,241,0.4)] active:scale-95"
            >
              {isPublishing ? (
                <div className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Menerbitkan...
                </div>
              ) : (
                'Publikasikan'
              )}
            </button>
          </div>
        </header>
      )}

      {/* ──────────────── Central Workspace ──────────────── */}
      <div className="flex flex-1 overflow-hidden relative bg-slate-100">
        
        {!isPreviewMode && (
          /* Left Side toolbox bar (Vertical Light Panel) */
          <nav className="w-[72px] shrink-0 bg-white/60 backdrop-blur-xl border-r border-white flex flex-col items-center py-5 gap-5 z-20 shadow-[4px_0_20px_rgb(0,0,0,0.02)]">
            <button 
              onClick={() => setLeftPanel('elements')}
              className={`relative p-3.5 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1.5 group ${
                leftPanel === 'elements' 
                  ? 'text-indigo-600 bg-white shadow-[0_4px_15px_rgb(99,102,241,0.1)] border border-white' 
                  : 'text-slate-400 hover:text-indigo-500 hover:bg-white/50'
              }`}
              title="Tambah Elemen & Blok"
            >
              <Plus className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="text-[9px] font-extrabold tracking-widest uppercase">Tambah</span>
            </button>
            
            <button 
              onClick={() => setLeftPanel('layers')}
              className={`relative p-3.5 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1.5 group ${
                leftPanel === 'layers' 
                  ? 'text-indigo-600 bg-white shadow-[0_4px_15px_rgb(99,102,241,0.1)] border border-white' 
                  : 'text-slate-400 hover:text-indigo-500 hover:bg-white/50'
              }`}
              title="Struktur Urutan Blok"
            >
              <LayoutTemplate className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="text-[9px] font-extrabold tracking-widest uppercase">Navigasi</span>
            </button>
            
            <button 
              onClick={() => setLeftPanel('settings')}
              className={`relative p-3.5 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1.5 group ${
                leftPanel === 'settings' 
                  ? 'text-indigo-600 bg-white shadow-[0_4px_15px_rgb(99,102,241,0.1)] border border-white' 
                  : 'text-slate-400 hover:text-indigo-500 hover:bg-white/50'
              }`}
              title="Desain & Tema Global"
            >
              <Palette className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="text-[9px] font-extrabold tracking-widest uppercase">Desain</span>
            </button>
          </nav>
        )}

        {/* Secondary Sliding Drawer Sidebar */}
        {!isPreviewMode && (
          <aside className="w-[300px] shrink-0 bg-white/70 backdrop-blur-xl border-r border-white flex flex-col overflow-hidden relative z-10 shadow-[4px_0_30px_rgb(0,0,0,0.02)]">
            <div className="flex-1 overflow-y-auto">
              
              {leftPanel === 'elements' && <ElementsPanel />}
              
              {leftPanel === 'layers' && (
                <div className="p-4 h-full">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">Navigasi Blok</h3>
                  </div>
                  <BlockNavigator
                    websiteId={websiteId}
                    initialBlocks={blocks}
                    selectedId={useEditorStore.getState().selectedId}
                    onSelect={useEditorStore.getState().selectBlock}
                    onBlocksChange={setBlocks}
                  />
                </div>
              )}
              
              {leftPanel === 'settings' && (
                <div className="flex flex-col h-full bg-white">
                  {/* Header title */}
                  <div className="flex items-center justify-between border-b border-gray-100 p-4 shrink-0">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">Desain & Identitas</h3>
                  </div>
                  
                  {/* Sub-tab switcher */}
                  <div className="flex border-b border-gray-100 p-2 gap-1 bg-gray-50/50 shrink-0">
                    <button 
                      onClick={() => setActiveSettingsTab('theme')}
                      className={`flex-1 py-1.5 px-2 rounded-md text-[10px] font-extrabold uppercase tracking-wide transition-all ${
                        activeSettingsTab === 'theme' 
                          ? 'bg-white shadow-sm border border-gray-200 text-indigo-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Tema Global
                    </button>
                    <button 
                      onClick={() => setActiveSettingsTab('identity')}
                      className={`flex-1 py-1.5 px-2 rounded-md text-[10px] font-extrabold uppercase tracking-wide transition-all ${
                        activeSettingsTab === 'identity' 
                          ? 'bg-white shadow-sm border border-gray-200 text-indigo-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Identitas Situs
                    </button>
                  </div>
                  
                  {/* Tab Body container */}
                  <div className="flex-1 overflow-y-auto p-4.5">
                    {activeSettingsTab === 'theme' ? (
                      <ThemeSettings
                        pageId={websiteId}
                        userId={userId}
                        theme={theme}
                        onChange={setTheme}
                        onSaveStatus={setSaveStatus}
                      />
                    ) : (
                      <div className="space-y-4">
                        {/* Site identity configs */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Judul Katalog</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-indigo-600 focus:outline-none font-medium text-slate-800 shadow-sm"
                            value={siteTitle}
                            onChange={(e) => setSiteTitle(e.target.value)}
                            placeholder="Katalog Saya"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">URL Slug</label>
                          <div className="flex items-center bg-gray-50 border border-gray-300 rounded px-3 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                            <span className="text-[11px] text-gray-400 select-none font-black mr-1">/</span>
                            <input
                              type="text"
                              className="bg-transparent border-none text-[11px] text-slate-800 font-bold p-2 w-full focus:outline-none"
                              value={siteSlug}
                              onChange={(e) => setSiteSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                              placeholder="toko-saya"
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleSaveIdentity}
                          disabled={isSavingIdentity}
                          className="w-full mt-4 flex items-center justify-center gap-1.5 bg-linear-to-br from-indigo-500 to-indigo-900 text-white font-bold py-2.5 rounded-lg text-xs hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
                        >
                          {isSavingIdentity ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Memperbarui...
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Simpan Perubahan
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </aside>
        )}

        {/* Central Canvas Frame preview wrapper */}
        <main className="flex-1 overflow-hidden relative bg-slate-100 flex flex-col">
          {/* Dynamic Floating Back button in Fullscreen Preview mode */}
          {isPreviewMode && (
            <button
              onClick={() => setIsPreviewMode(false)}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-100 flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-xl text-slate-800 rounded-full font-extrabold text-xs border border-white hover:bg-white transition-all shadow-[0_8px_30px_rgb(0,0,0,0.08)] active:scale-95 animate-in slide-in-from-top-4 duration-300 select-none"
            >
              <span>Keluar Pratinjau (Kembali ke Editor)</span>
            </button>
          )}

          <div className="flex-1 overflow-y-auto">
            <CanvasPreview />
          </div>
        </main>

        {/* Right Element-Style Property Panel Inspector */}
        {!isPreviewMode && (
          <aside className="w-80 shrink-0 bg-white/70 backdrop-blur-xl flex flex-col overflow-hidden relative z-10 shadow-[-4px_0_30px_rgb(0,0,0,0.02)] border-l border-white">
            <BlockSettingsPanel />
          </aside>
        )}
      </div>

      {/* ──────────────── Wix Confetti Success Publication Modal ──────────────── */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white border border-gray-100 w-full max-w-lg rounded-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 p-8 text-center relative">
            
            {/* Absolute close button */}
            <button 
              onClick={() => setIsPublishModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Sleek checkmark circle header */}
            <div className="w-12 h-12 mx-auto mb-4 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100">
              <Check className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              Katalog Toko Anda Berhasil Diterbitkan
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm mx-auto mt-2">
              Katalog online Anda sekarang aktif sepenuhnya dan dapat diakses oleh siapa saja di seluruh dunia.
            </p>

            {/* Links and Actions Container */}
            <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">
                Alamat Web Katalog
              </div>
              <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between gap-3 shadow-inner">
                <span className="text-xs font-semibold text-slate-800 truncate select-all">
                  {window.location.protocol}{'//'}{window.location.host}/{siteSlug}
                </span>
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-1 rounded-md font-semibold text-[10px] transition-all flex items-center gap-1 shrink-0 ${
                    showCopySuccess 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
                  }`}
                >
                  {showCopySuccess ? (
                    <>
                      <Check className="w-3 h-3" />
                      Tersalin
                    </>
                  ) : (
                    'Salin'
                  )}
                </button>
              </div>
            </div>

            {/* CTA actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="flex-1 py-2.5 px-4 border border-slate-200 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-semibold transition-all hover:bg-slate-50"
              >
                Tetap di Editor
              </button>
              <a
                href={`/${siteSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center py-2.5 px-4 bg-linear-to-br from-indigo-500 to-indigo-900 hover:from-indigo-600 hover:to-indigo-950 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                Buka Situs Live
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
