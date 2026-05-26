'use client'

import React from 'react'
import { TipTapEditor } from './TipTapEditor'

type EditableTextProps = {
  value: string
  onChange: (newValue: string) => void
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  tagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'blockquote' | 'cite'
  placeholder?: string
}

/**
 * EditableText — now powered by TipTap rich text editor.
 * Maintains the same external API as the original contentEditable version.
 */
export function EditableText({
  value,
  onChange,
  disabled = false,
  className = '',
  style = {},
  tagName = 'div',
  placeholder = 'Ketik teks di sini...'
}: EditableTextProps) {
  // Inline tags use minimal toolbar (no color/alignment/link)
  const isInline = tagName === 'span' || tagName === 'cite'

  return (
    <div className="inline-block relative w-full group/editable">
      <TipTapEditor
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        tagName={tagName}
        minimal={isInline}
        className={`focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:bg-indigo-50/5 rounded px-1.5 py-0.5 transition-all w-full text-inherit ${className} ${!disabled ? 'hover:bg-slate-100/50 cursor-text' : ''}`}
        style={{
          minWidth: '40px',
          ...style
        }}
      />
    </div>
  )
}