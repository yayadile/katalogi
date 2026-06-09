import React from 'react'
import type { EditorBlock } from '../store'
import { useEditorStore } from '../store'

export function GalleryRenderer({ block, isPreview = false, animationStyle, hoverClass = '' }: { block: EditorBlock; isPreview?: boolean; animationStyle?: React.CSSProperties; hoverClass?: string }) {
  const { title = 'Galeri', images = [], style = {} } = block.content
  const previewMode = useEditorStore(state => state.previewMode)
  const breakpointStyle = (block.content.breakpointStyles || {})[previewMode] || {}

  const safeImages = Array.isArray(images) && images.length > 0 ? images : ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg']
  const subStyles = (block.content.subStyles as Record<string, Record<string, string>>) || {}
  const selectBlock = useEditorStore(state => state.selectBlock)

  const cols = Number(block.content.columns ?? 3)
  const layout = String(block.content.layout ?? 'square')
  const aspectRatio = layout === 'video' ? '16/9' : '1/1'

  return (
    <div className={hoverClass} style={{ padding: '60px 20px', backgroundColor: '#ffffff', ...style, ...animationStyle, ...breakpointStyle }} onClick={() => selectBlock(block.id, null)}>
      {title && (
        <h2 
          style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', color: '#0f172a', cursor: 'pointer', ...(subStyles['title'] || {}) }}
          onClick={(e) => { e.stopPropagation(); selectBlock(block.id, 'title') }}
        >
          {title as string}
        </h2>
      )}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${cols}, 1fr)`, 
        gap: '1rem', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        {safeImages.map((img: string, idx) => {
          const itemStyle = subStyles[`image-${idx}`] || {}
          return (
            <div 
              key={idx} 
              style={{ 
                width: '100%', 
                aspectRatio: aspectRatio, 
                backgroundColor: '#e2e8f0', 
                borderRadius: '12px', 
                backgroundImage: img && img !== '/placeholder.jpg' ? `url(${img})` : 'none', 
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                border: '1px solid #e2e8f0', 
                cursor: 'pointer', 
                ...itemStyle 
              }}
              onClick={(e) => { e.stopPropagation(); selectBlock(block.id, `image-${idx}`) }}
            >
               {(!img || img === '/placeholder.jpg') && (
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontSize: '11px', fontWeight: 'semibold' }}>
                   Foto {idx + 1}
                 </div>
               )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
