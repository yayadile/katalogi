import React from 'react'
import type { EditorBlock } from '../store'
import { useEditorStore } from '../store'
import { HeroRenderer } from './HeroRenderer'
import { CatalogRenderer } from './CatalogRenderer'
import { ContactRenderer } from './ContactRenderer'
import { GalleryRenderer } from './GalleryRenderer'
import { EditableText } from '../EditableText'

export function TextRenderer({ block, isPreview = false, animationStyle, breakpointStyle, hoverClass = '' }: { block: EditorBlock; isPreview?: boolean; animationStyle?: React.CSSProperties; breakpointStyle?: React.CSSProperties; hoverClass?: string }) {
   const { content = 'Ketik isi teks blok Anda di sini...', style = {} } = block.content
   const selectBlock = useEditorStore(state => state.selectBlock)
   const updateBlockContent = useEditorStore(state => state.updateBlockContent)
   
   return (
      <div 
        className={hoverClass}
        style={{ padding: '20px', cursor: isPreview ? 'default' : 'pointer', ...style, ...animationStyle, ...breakpointStyle }}
        onClick={(e) => {
         if (!isPreview) {
           e.stopPropagation()
           selectBlock(block.id)
         }
       }}
     >
       <EditableText 
         value={content as string}
         disabled={isPreview}
         onChange={(newVal) => updateBlockContent(block.id, { content: newVal })}
         tagName="div"
       />
     </div>
   )
 }

export function BlockRenderer({ block, isPreview = false }: { block: EditorBlock; isPreview?: boolean }) {
  const { type, content } = block
  const selectBlock = useEditorStore(state => state.selectBlock)
  
  // Generic fallback styles
  const baseStyle = content.style || {}
  
  // Animation styles
  const anim = (content.animation || {}) as Record<string, unknown>
  const animationStyle: React.CSSProperties = {}
  let hoverClass = ''
  
  if (anim.preset && anim.preset !== 'none' && !isPreview) {
    const preset = anim.preset as string
    const durationMs = (anim.duration as number) || 600
    const delayMs = (anim.delay as number) || 0
    const easing = (anim.easing as string) || 'ease-out'
    
    const cssName = `katalogi-${preset}`
    animationStyle.animation = `${cssName} ${durationMs}ms ${easing} ${delayMs}ms 1 normal both`
    
    if (anim.triggerOnce !== false) {
      animationStyle.animationFillMode = 'both'
    }
  }
  
  if (anim.hover && anim.hover !== 'none' && !isPreview) {
    hoverClass = `katalogi-hover-${anim.hover}`
  }
  
  // Breakpoint styles
  const previewMode = useEditorStore(state => state.previewMode)
  const breakpointStyle = (block.content.breakpointStyles || {})[previewMode] || {}
  
  const handleBlockClick = (e: React.MouseEvent) => {
    if (!isPreview) {
      e.stopPropagation()
      selectBlock(block.id)
    }
  }
  
  switch (type) {
    case 'HERO':
      return <HeroRenderer block={block} isPreview={isPreview} animationStyle={animationStyle} hoverClass={hoverClass} />
    case 'CATALOG':
      return <CatalogRenderer block={block} isPreview={isPreview} animationStyle={animationStyle} hoverClass={hoverClass} />
    case 'CONTACT':
      return <ContactRenderer block={block} isPreview={isPreview} animationStyle={animationStyle} hoverClass={hoverClass} />
    case 'GALLERY':
      return <GalleryRenderer block={block} isPreview={isPreview} animationStyle={animationStyle} hoverClass={hoverClass} />
     case 'TEXT':
       return <TextRenderer block={block} isPreview={isPreview} animationStyle={animationStyle} breakpointStyle={breakpointStyle} hoverClass={hoverClass} />
      
      case 'HEADING': {
       const Tag = `h${content.level ?? 1}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
       const updateBlockContent = useEditorStore.getState().updateBlockContent
       
       // Font sizing based on tag level
       let defaultSize = '2.25rem'
       if (content.level === 2) defaultSize = '1.75rem'
       else if (content.level === 3) defaultSize = '1.5rem'
       else if (content.level === 4) defaultSize = '1.25rem'
       else if (content.level === 5) defaultSize = '1.125rem'
       else if (content.level === 6) defaultSize = '1rem'
 
       return (
        <div className={hoverClass} style={{ padding: '10px 20px', ...animationStyle, ...breakpointStyle }} onClick={handleBlockClick}>
          <EditableText
            value={content.text as string || ''}
            disabled={isPreview}
            onChange={(newVal) => updateBlockContent(block.id, { text: newVal })}
            tagName={Tag}
            style={{ 
              fontSize: defaultSize, 
              fontWeight: 'bold', 
              margin: 0, 
              color: '#0f172a',
              ...baseStyle as any 
            }}
            placeholder="Judul Heading"
          />
        </div>
       )
     }
    
    case 'PARAGRAPH': {
      const updateBlockContent = useEditorStore.getState().updateBlockContent
      return (
        <div className={hoverClass} style={{ padding: '10px 20px', ...animationStyle, ...breakpointStyle }} onClick={handleBlockClick}>
          <EditableText
            value={content.text as string || ''}
            disabled={isPreview}
            onChange={(newVal) => updateBlockContent(block.id, { text: newVal })}
            tagName="p"
            style={{ 
              margin: 0, 
              color: '#334155',
              lineHeight: '1.6',
              ...baseStyle as any 
            }}
            placeholder="Ketik paragraf teks Anda di sini..."
          />
        </div>
      )
    }
      
    case 'QUOTE': {
      const updateBlockContent = useEditorStore.getState().updateBlockContent
      return (
        <div className={hoverClass} style={{ padding: '10px 20px', ...animationStyle, ...breakpointStyle }} onClick={handleBlockClick}>
          <blockquote style={{ 
            borderLeft: '4px solid #cbd5e1', 
            fontStyle: 'italic', 
            color: '#64748b', 
            margin: '20px 0',
            padding: '10px 20px',
            backgroundColor: '#f8fafc',
            borderRadius: '0 8px 8px 0',
            ...baseStyle as any 
          }}>
            <EditableText
              value={content.text as string || ''}
              disabled={isPreview}
              onChange={(newVal) => updateBlockContent(block.id, { text: newVal })}
              tagName="p"
              style={{ margin: 0, fontSize: '1.1rem' }}
              placeholder="Kutipan inspiratif di sini..."
            />
            {(!isPreview || content.author) && (
              <cite style={{ 
                display: 'block', 
                textAlign: 'right', 
                fontSize: '0.85rem', 
                fontWeight: '600',
                color: '#94a3b8',
                marginTop: '8px',
                fontStyle: 'normal'
              }}>
                — <EditableText
                    value={content.author as string || ''}
                    disabled={isPreview}
                    onChange={(newVal) => updateBlockContent(block.id, { author: newVal })}
                    tagName="cite"
                    style={{ display: 'inline', fontStyle: 'normal' }}
                    placeholder="Nama Penulis"
                  />
              </cite>
            )}
          </blockquote>
        </div>
      )
    }  
    case 'LIST': {
      const items = (content.items as string[]) || ['Item Daftar 1', 'Item Daftar 2', 'Item Daftar 3']
      const updateBlockContent = useEditorStore.getState().updateBlockContent
      return (
        <div className={hoverClass} style={{ padding: '10px 20px', ...animationStyle, ...breakpointStyle }} onClick={handleBlockClick}>
          <ul style={{ 
            paddingLeft: '24px', 
            listStyleType: 'disc', 
            margin: 0,
            color: '#334155',
            ...baseStyle as any 
          }}>
            {items.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>
                <EditableText
                  value={item}
                  disabled={isPreview}
                  onChange={(newVal) => {
                    const newItems = [...items]
                    newItems[idx] = newVal
                    updateBlockContent(block.id, { items: newItems })
                  }}
                  tagName="span"
                  placeholder={`Item Daftar ${idx + 1}`}
                />
              </li>
            ))}
          </ul>
        </div>
      )
    }
    
    case 'LINK_BLOCK': {
      const updateBlockContent = useEditorStore.getState().updateBlockContent
      return (
        <div className={hoverClass} style={{ padding: '10px 20px', ...animationStyle, ...breakpointStyle }} onClick={handleBlockClick}>
          <a 
            href={(content.url as string) || '#'} 
            target={(content.target as string) || '_self'}
            onClick={(e) => !isPreview && e.preventDefault()}
            style={{ 
              display: 'inline-block', 
              color: '#4f46e5', 
              textDecoration: 'underline', 
              fontWeight: '500',
              ...baseStyle as any 
            }}
          >
            <EditableText
              value={content.text as string || ''}
              disabled={isPreview}
              onChange={(newVal) => updateBlockContent(block.id, { text: newVal })}
              tagName="span"
              placeholder="Teks Tautan Link"
            />
          </a>
        </div>
      )
    }
      
    case 'BUTTON': {
      const variant = (content.variant as string) || 'solid'
      const size = (content.size as string) || 'md'
      const updateBlockContent = useEditorStore.getState().updateBlockContent
      
      let padding = '10px 20px'
      let fontSize = '0.875rem'
      if (size === 'sm') { padding = '6px 12px'; fontSize = '0.75rem' }
      else if (size === 'lg') { padding = '14px 28px'; fontSize = '1rem' }

      const buttonStyle: React.CSSProperties = {
        padding,
        fontSize,
        fontWeight: '600',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'inline-block',
        textAlign: 'center',
        border: '1px solid transparent',
        textDecoration: 'none',
      }

      if (variant === 'solid') {
        buttonStyle.backgroundColor = '#4f46e5'
        buttonStyle.color = '#ffffff'
      } else if (variant === 'outline') {
        buttonStyle.backgroundColor = 'transparent'
        buttonStyle.borderColor = '#4f46e5'
        buttonStyle.color = '#4f46e5'
      } else if (variant === 'ghost') {
        buttonStyle.backgroundColor = 'transparent'
        buttonStyle.color = '#4f46e5'
      }

      return (
        <div className={hoverClass} style={{ padding: '10px 20px', ...animationStyle, ...breakpointStyle }} onClick={handleBlockClick}>
          <button style={{ ...buttonStyle, ...baseStyle as any }}>
            <EditableText
              value={content.text as string || ''}
              disabled={isPreview}
              onChange={(newVal) => updateBlockContent(block.id, { text: newVal })}
              tagName="span"
              placeholder="Tombol Aksi"
            />
          </button>
        </div>
      )
    }
    
    case 'CONTAINER': {
      const containerStyle: React.CSSProperties = {
        padding: '20px',
        border: isPreview ? 'none' : '2px dashed #6366f1',
        minHeight: '80px',
        backgroundColor: '#faf5ff',
        ...baseStyle as any,
        ...animationStyle,
        ...breakpointStyle
      }
      return (
        <div className={hoverClass} style={containerStyle} onClick={handleBlockClick}>
          {!isPreview && (
            <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              Container
            </div>
          )}
        </div>
      )
    }
    
    case 'DIV': {
      const flexDir = (content.flexDirection as string) === 'row' ? 'row' : 'column'
      const justify = (content.justifyContent as string) || 'start'
      const align = (content.alignItems as string) || 'stretch'
      const gap = Number(content.gap ?? 0) * 4

      const divStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: flexDir,
        justifyContent: justify === 'start' ? 'flex-start' : justify === 'end' ? 'flex-end' : justify === 'between' ? 'space-between' : justify === 'around' ? 'space-around' : 'center',
        alignItems: align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : align === 'stretch' ? 'stretch' : 'center',
        gap: `${gap}px`,
        padding: '20px',
        border: isPreview ? 'none' : '1px dashed #cbd5e1',
        minHeight: '60px',
        ...baseStyle as any,
        ...animationStyle,
        ...breakpointStyle
      }

      return (
        <div className={hoverClass} style={divStyle} onClick={handleBlockClick}>
          {content.text ? (
            <span>{content.text as string}</span>
          ) : (
            !isPreview && (
              <span style={{ fontSize: '10px', color: '#94a3b8', fontStyle: 'italic' }}>
                Wadah Div Block (Flexbox) - Jatuhkan elemen di sini
              </span>
            )
          )}
        </div>
      )
    }
    
    case 'COLUMN': {
      const cols = Number(content.columns ?? 2)
      const gap = Number(content.gap ?? 4) * 4

      const colStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: `${gap}px`,
        padding: '20px',
        border: isPreview ? 'none' : '1px dashed #cbd5e1',
        minHeight: '60px',
        ...baseStyle as any,
        ...animationStyle,
        ...breakpointStyle
      }

      return (
        <div className={hoverClass} style={colStyle} onClick={handleBlockClick}>
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} style={{ 
              border: '1px dashed #e2e8f0', 
              padding: '12px', 
              minHeight: '50px', 
              backgroundColor: '#f8fafc', 
              borderRadius: '6px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '10px', 
              color: '#94a3b8' 
            }}>
              Kolom {i + 1}
            </div>
          ))}
        </div>
      )
    }
    
    case 'GRID': {
      const cols = Number(content.columns ?? 3)
      const gap = Number(content.gap ?? 4) * 4
      const isCard = (content.layout as string) === 'card'

      const gridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: `${gap}px`,
        padding: '20px',
        border: isPreview ? 'none' : '1px dashed #cbd5e1',
        minHeight: '60px',
        ...baseStyle as any,
        ...animationStyle,
        ...breakpointStyle
      }

      return (
        <div className={hoverClass} style={gridStyle} onClick={handleBlockClick}>
          {Array.from({ length: cols * 2 }).map((_, i) => (
            <div key={i} style={{ 
              border: isCard ? '1px solid #e2e8f0' : '1px dashed #e2e8f0', 
              padding: '16px', 
              minHeight: '60px', 
              backgroundColor: '#ffffff', 
              borderRadius: isCard ? '8px' : '4px', 
              boxShadow: isCard ? '0 1px 3px 0 rgba(0, 0, 0, 0.05)' : 'none', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '11px', 
              color: '#64748b' 
            }}>
              Item Grid {i + 1}
            </div>
          ))}
        </div>
      )
    }
    
    case 'VIDEO': {
      const platform = (content.platform as string) || 'youtube'
      const url = (content.url as string) || ''
      
      let embedUrl = ''
      if (platform === 'youtube' && url) {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
        if (match) {
          embedUrl = `https://www.youtube.com/embed/${match[1]}`
        }
      } else if (platform === 'vimeo' && url) {
        const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]+)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/)
        if (match) {
          embedUrl = `https://player.vimeo.com/video/${match[1]}`
        }
      }

      return (
        <div className={hoverClass} style={{ padding: '20px', ...baseStyle as any, ...animationStyle, ...breakpointStyle }} onClick={handleBlockClick}>
          {embedUrl ? (
            <div style={{ 
              position: 'relative', 
              paddingBottom: '56.25%', 
              height: 0, 
              overflow: 'hidden', 
              borderRadius: '8px', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
            }}>
              <iframe
                src={embedUrl}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : platform === 'custom' && url ? (
            <video 
              src={url} 
              controls 
              style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
            />
          ) : (
            <div style={{ 
              height: '200px', 
              backgroundColor: '#f1f5f9', 
              borderRadius: '8px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              border: '2px dashed #cbd5e1', 
              color: '#64748b' 
            }}>
              <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-xs font-semibold">Video Placeholder</p>
              <p className="text-[10px] text-gray-400 mt-1">Masukkan URL YouTube atau Vimeo di panel properti</p>
            </div>
          )}
        </div>
      )
    }

    default:
      return (
        <div 
          className={hoverClass}
          onClick={handleBlockClick}
          style={{ padding: '20px', border: '1px dashed #cbd5e1', backgroundColor: '#f1f5f9', color: '#64748b', ...baseStyle as any, ...animationStyle, ...breakpointStyle }}
        >
          Elemen Tidak Didukung: {type}
        </div>
      )
  }
}
