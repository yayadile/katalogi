'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import BlockNavigator, { type EditorBlock } from '@/components/editor/BlockNavigator'
import CanvasPreview from '@/components/editor/CanvasPreview'
import BlockSettingsPanel from '@/components/editor/BlockSettingsPanel'
import { publishWebsite } from '@/lib/actions/website'

type ThemeConfig = {
  primaryColor: string
  secondaryColor: string
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

  const selectedBlock = blocks.find((b) => b.id === selectedId) ?? null

  const handleBlocksChange = useCallback((updated: EditorBlock[]) => {
    setBlocks(updated)
  }, [])

  const handleBlockContentChange = useCallback((blockId: string, content: Record<string, unknown>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, content } : b))
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
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden">
      {/* ──────────────── Top Bar ──────────────── */}
      <header className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-white/5 flex-shrink-0 z-30">
        {/* Left: back + title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
            aria-label="Back to dashboard"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{websiteTitle}</p>
              <p className="text-slate-500 text-xs truncate">/{websiteSlug}</p>
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Published status badge */}
          {isPublished && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Live
            </span>
          )}

          {/* Preview link */}
          {isPublished && (
            <a
              href={`/${websiteSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-medium"
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
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isPublished
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/20'
            } disabled:opacity-50`}
          >
            {isPending ? (
              'Memproses...'
            ) : isPublished ? (
              'Unpublish'
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Publish
              </>
            )}
          </button>
        </div>
      </header>

      {/* ──────────────── 3-Panel Layout ──────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Block Navigator (240px) */}
        <aside className="w-60 flex-shrink-0 bg-slate-900 border-r border-white/5 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-3">
            <BlockNavigator
              websiteId={websiteId}
              initialBlocks={blocks}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onBlocksChange={handleBlocksChange}
            />
          </div>
        </aside>

        {/* Center Panel: Canvas Preview */}
        <main className="flex-1 overflow-hidden">
          <CanvasPreview
            blocks={blocks}
            selectedId={selectedId}
            onSelect={setSelectedId}
            primaryColor={theme.primaryColor}
          />
        </main>

        {/* Right Panel: Settings (280px) */}
        <aside className="w-70 flex-shrink-0 bg-slate-900 border-l border-white/5 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            <BlockSettingsPanel
              selectedBlock={selectedBlock}
              websiteId={websiteId}
              userId={userId}
              theme={theme}
              onBlockContentChange={handleBlockContentChange}
              onThemeChange={setTheme}
            />
          </div>
        </aside>
      </div>
    </div>
  )
}
