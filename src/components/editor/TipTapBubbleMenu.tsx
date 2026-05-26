'use client'

import React, { useCallback, useState } from 'react'
import { BubbleMenu } from '@tiptap/extension-bubble-menu'
import type { Editor } from '@tiptap/react'

// Re-export BubbleMenu extension for use in TipTapEditor
export { BubbleMenu as BubbleMenuExtension }

interface TipTapBubbleMenuProps {
  editor: Editor
  minimal?: boolean
}

/**
 * Custom floating toolbar that shows when text is selected in TipTap.
 * Uses manual positioning based on editor selection state instead of
 * BubbleMenu component (which was removed in TipTap v3).
 */
export function TipTapBubbleToolbar({ editor, minimal = false }: TipTapBubbleMenuProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  const setLink = useCallback(() => {
    const chain = editor.chain().focus().extendMarkRange('link') as any
    if (linkUrl === '') {
      chain.unsetLink().run()
    } else {
      const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`
      chain.setLink({ href: url }).run()
    }
    setShowLinkInput(false)
    setLinkUrl('')
  }, [editor, linkUrl])

  // Check if there's a text selection
  const { from, to } = editor.state.selection
  const hasSelection = from !== to && !editor.state.selection.empty

  if (!hasSelection || !editor.isFocused) {
    return null
  }

  // Get position for the toolbar
  const { view } = editor
  const startCoords = view.coordsAtPos(from)
  const endCoords = view.coordsAtPos(to)
  
  // Find the iframe container to calculate relative position
  const editorElement = view.dom.closest('.ProseMirror')
  if (!editorElement) return null
  
  const editorRect = editorElement.getBoundingClientRect()
  const toolbarTop = startCoords.top - editorRect.top - 45
  const toolbarLeft = (startCoords.left + endCoords.left) / 2 - editorRect.left

  const colors = [
    '#000000', '#334155', '#64748b', '#dc2626', '#ea580c', '#d97706',
    '#16a34a', '#2563eb', '#7c3aed', '#db2777', '#ffffff',
  ]

  const btnClass = (active: boolean) =>
    `p-1 rounded text-xs w-7 h-7 flex items-center justify-center transition-colors cursor-pointer ${
      active
        ? 'bg-white/20 text-white'
        : 'text-white/80 hover:bg-white/10 hover:text-white'
    }`

  // Cast chain to any to work with v3 dynamic command types
  const chain = () => editor.chain().focus() as any

  return (
    <div
      className="absolute z-[9999] flex items-center bg-slate-900 text-white rounded-lg px-1.5 py-1 shadow-xl gap-0.5 border border-slate-700"
      style={{
        top: `${Math.max(0, toolbarTop)}px`,
        left: `${toolbarLeft}px`,
        transform: 'translateX(-50%)',
        pointerEvents: 'auto',
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Bold */}
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); chain().toggleBold().run() }}
        className={btnClass(editor.isActive('bold'))}
        title="Tebal (Ctrl+B)"
      >
        <strong>B</strong>
      </button>

      {/* Italic */}
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); chain().toggleItalic().run() }}
        className={btnClass(editor.isActive('italic'))}
        title="Miring (Ctrl+I)"
      >
        <em className="font-serif">I</em>
      </button>

      {/* Underline */}
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); chain().toggleUnderline().run() }}
        className={btnClass(editor.isActive('underline'))}
        title="Garis Bawah (Ctrl+U)"
      >
        <span className="underline">U</span>
      </button>

      {/* Strikethrough */}
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); chain().toggleStrike().run() }}
        className={btnClass(editor.isActive('strike'))}
        title="Coretan"
      >
        <span className="line-through">S</span>
      </button>

      {!minimal && (
        <>
          {/* Separator */}
          <div className="w-px h-4 bg-slate-600 mx-0.5" />

          {/* Text Color */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setShowColorPicker(!showColorPicker); setShowLinkInput(false) }}
              className={btnClass(false)}
              title="Warna Teks"
            >
              <span style={{ borderBottom: '2px solid currentColor' }}>A</span>
            </button>
            {showColorPicker && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-slate-800 rounded-lg p-2 shadow-xl border border-slate-600 grid grid-cols-6 gap-1 z-[10000]"
                onMouseDown={(e) => e.preventDefault()}
              >
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-5 h-5 rounded border border-slate-500 hover:scale-110 transition-transform cursor-pointer"
                    style={{ backgroundColor: color }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      chain().setColor(color).run()
                      setShowColorPicker(false)
                    }}
                  />
                ))}
                <button
                  type="button"
                  className="w-5 h-5 rounded border border-slate-500 hover:scale-110 transition-transform text-[8px] flex items-center justify-center text-white cursor-pointer"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    chain().unsetColor().run()
                    setShowColorPicker(false)
                  }}
                  title="Reset warna"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Highlight */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); chain().toggleHighlight({ color: '#fef08a' }).run() }}
            className={btnClass(editor.isActive('highlight'))}
            title="Stabilo"
          >
            <span className="bg-yellow-200/60 text-black px-0.5 rounded-sm text-[10px]">H</span>
          </button>

          {/* Separator */}
          <div className="w-px h-4 bg-slate-600 mx-0.5" />

          {/* Alignment */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); chain().setTextAlign('left').run() }}
            className={btnClass(editor.isActive({ textAlign: 'left' }))}
            title="Rata Kiri"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2 3h12v1H2zm0 4h8v1H2zm0 4h10v1H2z"/>
            </svg>
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); chain().setTextAlign('center').run() }}
            className={btnClass(editor.isActive({ textAlign: 'center' }))}
            title="Rata Tengah"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2 3h12v1H2zm2 4h8v1H4zm-1 4h10v1H3z"/>
            </svg>
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); chain().setTextAlign('right').run() }}
            className={btnClass(editor.isActive({ textAlign: 'right' }))}
            title="Rata Kanan"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2 3h12v1H2zm4 4h8v1H6zm2 4h6v1H8z"/>
            </svg>
          </button>

          {/* Separator */}
          <div className="w-px h-4 bg-slate-600 mx-0.5" />

          {/* Link */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                if (editor.isActive('link')) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (editor.chain().focus() as any).unsetLink().run()
                } else {
                  setShowLinkInput(!showLinkInput)
                  setShowColorPicker(false)
                  setLinkUrl(editor.getAttributes('link').href || '')
                }
              }}
              className={btnClass(editor.isActive('link'))}
              title="Tautan"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
            {showLinkInput && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-slate-800 rounded-lg p-2 shadow-xl border border-slate-600 flex items-center gap-1 z-[10000]"
                onMouseDown={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setLink()}
                  placeholder="https://..."
                  className="bg-slate-700 text-white text-xs rounded px-2 py-1 w-40 outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); setLink() }}
                  className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-500 cursor-pointer"
                >
                  OK
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}