import React from 'react'
import type { EditorBlock } from '../store'
import { useEditorStore, getBreakpointStyle } from '../store'

export function ContactRenderer({ block, isPreview = false, animationStyle, hoverClass = '' }: { block: EditorBlock; isPreview?: boolean; animationStyle?: React.CSSProperties; hoverClass?: string }) {
  const { title = 'Hubungi Kami', email = 'email@contoh.com', phone = '+62 812 3456 7890', style = {} } = block.content
  const subStyles = (block.content.subStyles as Record<string, Record<string, string>>) || {}
  const selectBlock = useEditorStore(state => state.selectBlock)
  const previewMode = useEditorStore(state => state.previewMode)
  const breakpointStyle = getBreakpointStyle(block.content, previewMode)

  return (
    <div className={hoverClass} style={{ padding: '60px 20px', backgroundColor: '#f8fafc', textAlign: 'center', ...style as React.CSSProperties, ...animationStyle, ...breakpointStyle as React.CSSProperties }} onClick={() => selectBlock(block.id, null)}>
      <h2 
        style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#0f172a', cursor: 'pointer', ...(subStyles['title'] || {}) }}
        onClick={(e) => { e.stopPropagation(); selectBlock(block.id, 'title') }}
      >
        {title as string}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <a 
          href={`mailto:${email}`} 
          style={{ 
            fontSize: '1.125rem', 
            color: '#4f46e5', 
            textDecoration: 'none', 
            fontWeight: 'bold', 
            cursor: 'pointer', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            ...(subStyles['email'] || {}) 
          }}
          onClick={(e) => { e.stopPropagation(); selectBlock(block.id, 'email') }}
        >
          <svg className="w-5 h-5 text-purple-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {email as string}
        </a>
        <a 
          href={`https://wa.me/${String(phone).replace(/[^0-9]/g, '')}`} 
          target="_blank" rel="noreferrer" 
          style={{ 
            fontSize: '1.125rem', 
            color: '#10b981', 
            textDecoration: 'none', 
            fontWeight: 'bold', 
            cursor: 'pointer', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            ...(subStyles['phone'] || {}) 
          }}
          onClick={(e) => { e.stopPropagation(); selectBlock(block.id, 'phone') }}
        >
          <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {phone as string}
        </a>
      </div>
    </div>
  )
}
