import React from 'react'
import type { EditorBlock } from '../store'
import { useEditorStore } from '../store'

export function CatalogRenderer({ block, isPreview = false, animationStyle, hoverClass = '' }: { block: EditorBlock; isPreview?: boolean; animationStyle?: React.CSSProperties; hoverClass?: string }) {
  const { title = 'Our Products', items = [], style = {} } = block.content
  const previewMode = useEditorStore(state => state.previewMode)
  const breakpointStyle = (block.content.breakpointStyles || {})[previewMode] || {};

  const safeItems = Array.isArray(items) && items.length > 0 
    ? items 
    : [
        { id: '1', name: 'Sample Product 1', price: '$99' },
        { id: '2', name: 'Sample Product 2', price: '$149' },
        { id: '3', name: 'Sample Product 3', price: '$199' }
      ];
    const selectBlock = useEditorStore(state => state.selectBlock)
    const subStyles = (block.content.subStyles as Record<string, Record<string, string>>) || {}

    return (
      <div className={hoverClass} style={{ padding: '60px 20px', backgroundColor: '#ffffff', ...style, ...animationStyle, ...breakpointStyle }} onClick={() => !isPreview && selectBlock(block.id, null)}>
        {title && (
          <h2 
            style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', color: '#0f172a', cursor: isPreview ? 'default' : 'pointer', ...(subStyles['title'] || {}) }}
            onClick={(e) => { if(!isPreview) { e.stopPropagation(); selectBlock(block.id, 'title') } }}
          >
            {title as string}
          </h2>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {(safeItems as { id: string; name: string; price: string; image?: string; desc?: string; actionLink?: string }[]).map((item, index: number) => {
            const Wrapper = isPreview && item.actionLink ? 'a' : 'div'
            const wrapperProps = isPreview && item.actionLink ? { href: item.actionLink, target: '_blank', rel: 'noopener noreferrer' } : {}
            const itemStyle = subStyles[`item-${index}`] || {}
            
            return (
              <div 
                key={item.id} 
                style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', cursor: isPreview ? 'default' : 'pointer', ...itemStyle }}
                onClick={(e) => { if(!isPreview) { e.stopPropagation(); selectBlock(block.id, `item-${index}`) } }}
              >
                <div style={{ width: '100%', height: '200px', backgroundColor: '#e2e8f0', borderRadius: '8px', marginBottom: '1rem', backgroundImage: item.image ? `url(${item.image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{item.name}</h3>
                <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.875rem' }}>{item.desc}</p>
                <p style={{ color: '#10b981', marginTop: '0.5rem', fontWeight: 'bold', flex: 1 }}>{item.price}</p>
                <Wrapper {...wrapperProps} style={{ display: 'block', width: '100%', padding: '10px', backgroundColor: '#4f46e5', color: 'white', textAlign: 'center', borderRadius: '6px', fontWeight: 'bold', marginTop: '1rem', textDecoration: 'none', cursor: 'pointer' }}>
                  Beli / Kontak
                </Wrapper>
              </div>
            )
          })}
      </div>
    </div>
  )
}
