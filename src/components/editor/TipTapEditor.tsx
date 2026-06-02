'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import { TipTapBubbleToolbar } from './TipTapBubbleMenu'

export interface TipTapEditorProps {
  value: string
  onChange: (html: string) => void
  disabled?: boolean
  placeholder?: string
  tagName?: string
  style?: React.CSSProperties
  className?: string
  minimal?: boolean
}

/**
 * TipTap-based rich text editor that replaces the deprecated contentEditable/execCommand system.
 * Maintains the same external API as the old EditableText component.
 */
export function TipTapEditor({
  value,
  onChange,
  disabled = false,
  placeholder = '',
  tagName = 'div',
  style,
  className,
  minimal = false,
}: TipTapEditorProps) {
  const isInternalUpdate = useRef(false)
  const lastExternalValue = useRef(value)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-purple-800 underline cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
    ],
    content: value || '',
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      isInternalUpdate.current = true
      const html = ed.getHTML()
      // Don't send empty paragraph as content
      const cleanHtml = html === '<p></p>' ? '' : html
      onChange(cleanHtml)
    },
    // Prevent immediate re-render on creation
    immediatelyRender: false,
  })

  // Sync external value changes (e.g., from undo/redo)
  useEffect(() => {
    if (!editor) return
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false
      return
    }
    if (value !== lastExternalValue.current) {
      lastExternalValue.current = value
      const currentHtml = editor.getHTML()
      const cleanCurrent = currentHtml === '<p></p>' ? '' : currentHtml
      if (value !== cleanCurrent) {
        editor.commands.setContent(value || '', { emitUpdate: false })
      }
    }
  }, [value, editor])

  // Update editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled)
    }
  }, [disabled, editor])

  // Update last external value ref
  useEffect(() => {
    lastExternalValue.current = value
  }, [value])

  if (!editor) {
    // SSR / loading fallback — render static HTML
    return (
      <div
        style={style}
        className={className}
        dangerouslySetInnerHTML={{ __html: value || placeholder }}
      />
    )
  }

  return (
    <div className={`tiptap-editor-wrapper relative ${className || ''}`} style={style}>
      {/* Bubble toolbar for text selection */}
      {!disabled && editor && (
        <TipTapBubbleToolbar editor={editor} minimal={minimal} />
      )}
      <EditorContent
        editor={editor}
        className="tiptap-content"
        style={{
          outline: 'none',
          minHeight: '1em',
        }}
      />
      <style>{`
        .tiptap-content .ProseMirror {
          outline: none;
          min-height: 1em;
        }
        .tiptap-content .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
          font-style: italic;
        }
        .tiptap-content .ProseMirror p {
          margin: 0;
        }
        .tiptap-content .ProseMirror mark {
          padding: 0.1em 0.2em;
          border-radius: 2px;
        }
      `}</style>
    </div>
  )
}