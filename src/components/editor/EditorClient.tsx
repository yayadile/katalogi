'use client'

import { useState, useCallback, useTransition, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import BlockNavigator, { type EditorBlock, type BlockPosition } from '@/components/editor/BlockNavigator'
import CanvasPreview from '@/components/editor/CanvasPreview'
import BlockSettingsPanel from '@/components/editor/BlockSettingsPanel'
import ElementsPanel from '@/components/editor/ElementsPanel'
import { publishWebsite } from '@/lib/actions/website'
import EditorGuide from '@/components/editor/EditorGuide'
import SaveStatusIndicator, { type SaveStatus } from '@/components/editor/SaveStatusIndicator'

type ThemeConfig = {
  primaryColor: string
  secondaryColor: string
  backgroundColor?: string
  buttonStyle?: 'sharp' | 'rounded' | 'pill'
  fontFamily: string
}

type EditorClientProps = {
  websiteId: string
  userId: string
  websiteTitle: string
  websiteSlug: string
  isPublished: boolean
  initialBlocks: EditorBlock[]
  initialTheme: ThemeConfig
}

export default function EditorClient({
  websiteId,
  userId,
  websiteTitle,
  websiteSlug,
  isPublished: initialPublished,
  initialBlocks,
  initialTheme,
}: EditorClientProps) {
  const router = useRouter()
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [theme, setTheme] = useState<ThemeConfig>(initialTheme)
  const [isPublished, setIsPublished] = useState(initialPublished)
  const [isPending, startTransition] = useTransition()
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [leftPanel, setLeftPanel] = useState<'elements' | 'layers' | 'settings'>('elements')
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('desktop')
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const selectedBlock = blocks.find((b) => b.id === selectedId) ?? null

  // Callback buat nge-report status simpan
  const handleSaveStatusChange = useCallback((status: SaveStatus) => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
    setSaveStatus(status)
    // Sembunyikan otomatis setelah 2.5 detik kalau udah tersimpan atau error
    if (status === 'saved' || status === 'error') {
      hideTimerRef.current = setTimeout(() => {
        setSaveStatus('idle')
      }, 2500)
    }
  }, [])

  // Kasih peringatan ke user sebelum nutup tab pas lagi nyimpan
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'saving') {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [saveStatus])

  const handleBlocksChange = useCallback((updated: EditorBlock[]) => {
    setBlocks(updated)
  }, [])

  const handleBlockAdded = useCallback((block: EditorBlock) => {
    setBlocks((prev) => [...prev, block])
    setSelectedId(block.id)
  }, [])



  const handleBlockContentChange = useCallback((blockId: string, content: Record<string, unknown>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, content } : b))
    )
  }, [])

  const handleBlockPositionChange = useCallback((blockId: string, position: Partial<EditorBlock['position']>) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id === blockId) {
          const currentPos = b.position || { x: 0, y: 0, width: '100%', height: 'auto', zIndex: 1 }
          return {
            ...b,
            position: { ...currentPos, ...position } as BlockPosition
          }
        }
        return b
      })
    )
  }, [])

  const handlePublishToggle = useCallback(() => {
    startTransition(async () => {
      const result = await publishWebsite(websiteId, userId, !isPublished)
      if (result.success) {
        setIsPublished(!isPublished)
      }
    })
  }, [isPublished, websiteId, userId])

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* ──────────────── Top Bar ──────────────── */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0 z-30">
        {/* Left: back + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
            aria-label="Back to dashboard"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="w-px h-4 bg-gray-200 mx-1" />
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <div className="min-w-0">
              <p className="text-gray-900 font-semibold text-sm truncate">{websiteTitle}</p>
              <p className="text-gray-400 text-xs truncate">/{websiteSlug}</p>
            </div>
          </div>
        </div>

        {/* Center: Device Toggles (Absolute Center) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-gray-100/80 rounded-md p-0.5 border border-gray-200">
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`p-1.5 rounded transition-colors ${previewMode === 'desktop' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            title="Desktop"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`p-1.5 rounded transition-colors ${previewMode === 'mobile' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            title="Mobile"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Save status indicator */}
          <div className="scale-90 origin-right">
            <SaveStatusIndicator status={saveStatus} />
          </div>

          <div className="w-px h-4 bg-gray-200" />

          {/* Published status badge */}
          {isPublished && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Live
            </span>
          )}

          {/* Guidance */}
          <EditorGuide />

          {/* Preview link */}
          {isPublished && (
            <a
              href={`/${websiteSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all text-xs font-medium"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Preview
            </a>
          )}

          {/* Publish toggle */}
          <button
            onClick={handlePublishToggle}
            disabled={isPending}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold transition-all border ${
              isPublished
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20'
            } disabled:opacity-50`}
          >
            {isPending ? (
              'Memproses...'
            ) : isPublished ? (
              'Unpublish'
            ) : (
              'Publish'
            )}
          </button>

          {/* Preview link */}
          {isPublished && (
            <a
              href={`/${websiteSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-7 h-7 rounded border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              title="Lihat Website"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </header>

      {/* ──────────────── 3-Panel Layout ──────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar (Thin Navigation) */}
        <nav className="w-12 shrink-0 bg-white border-r border-gray-200 flex flex-col items-center py-3 gap-2 z-20">
          <button 
            onClick={() => setLeftPanel('elements')}
            className={`relative p-2 rounded transition-colors ${leftPanel === 'elements' ? 'text-gray-900 bg-gray-100' : 'text-gray-400 hover:text-gray-800'}`}
            title="Add Elements"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button 
            onClick={() => setLeftPanel('layers')}
            className={`relative p-2 rounded transition-colors ${leftPanel === 'layers' ? 'text-gray-900 bg-gray-100' : 'text-gray-400 hover:text-gray-800'}`}
            title="Lapisan"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </button>
          <div className="mt-auto">
            <button 
              onClick={() => setLeftPanel('settings')}
              className={`relative p-2 rounded transition-colors ${leftPanel === 'settings' ? 'text-gray-900 bg-gray-100' : 'text-gray-400 hover:text-gray-800'}`}
              title="Site Settings"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </nav>

        {/* Secondary Left Panel: Dynamic Content (240px) */}
        <aside className="w-[240px] shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden relative">
          <div className="flex-1 overflow-y-auto">
            {leftPanel === 'layers' && (
              <div className="p-3 h-full">
                <BlockNavigator
                  websiteId={websiteId}
                  initialBlocks={blocks}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onBlocksChange={handleBlocksChange}
                  onBlockAdded={handleBlockAdded}
                />
              </div>
            )}
            {leftPanel === 'elements' && (
              <ElementsPanel 
                websiteId={websiteId}
                currentCount={blocks.length}
                onBlockAdded={handleBlockAdded}
              />
            )}
            {leftPanel === 'settings' && (
              <div className="p-4 text-gray-500 text-xs">
                <h3 className="font-semibold text-gray-900 mb-2">Site Settings</h3>
                <p>Pengaturan global website Anda.</p>
              </div>
            )}
          </div>
        </aside>

        {/* Center Panel: Canvas Preview */}
        <main className="flex-1 overflow-hidden relative grid-overlay flex flex-col">
          <div className="flex-1 w-full p-4 md:p-8 overflow-y-auto overflow-x-hidden flex justify-center">
            <CanvasPreview
              blocks={blocks}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onPositionChange={handleBlockPositionChange}
              theme={theme}
              previewMode={previewMode}
            />
          </div>
        </main>

        {/* Right Panel: Settings (280px) */}
        <aside className="w-70 shrink-0 bg-gray-50 border-l border-gray-200 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            <BlockSettingsPanel
              selectedBlock={selectedBlock}
              websiteId={websiteId}
              userId={userId}
              theme={theme}
              onBlockContentChange={handleBlockContentChange}
              onBlockPositionChange={handleBlockPositionChange}
              onThemeChange={setTheme}
              onSaveStatusChange={handleSaveStatusChange}
            />
          </div>
        </aside>
      </div>
    </div>
  )
}
