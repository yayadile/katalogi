'use client'

import React from 'react'

type ThemeProps = {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
}

export type DivContent = {
  style?: React.CSSProperties
  flexDirection?: 'row' | 'col'
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around'
  alignItems?: 'start' | 'center' | 'end' | 'stretch'
  gap?: string | number
}

export function DivBlock({ content, children }: { content: DivContent; children?: React.ReactNode }) {
  const flexDirection = content.flexDirection === 'row' ? 'flex-row' : 'flex-col'
  
  const justifyMap: Record<string, string> = {
    'start': 'justify-start',
    'center': 'justify-center',
    'end': 'justify-end',
    'between': 'justify-between',
    'around': 'justify-around'
  }
  const justifyContent = justifyMap[content.justifyContent || 'start']

  const alignMap: Record<string, string> = {
    'start': 'items-start',
    'center': 'items-center',
    'end': 'items-end',
    'stretch': 'items-stretch'
  }
  const alignItems = alignMap[content.alignItems || 'stretch']

  const gap = content.gap ? Number(content.gap) * 4 : 0

  return (
    <div 
      style={{ ...content.style, gap: `${gap}px` }} 
      className={`flex ${flexDirection} ${justifyContent} ${alignItems} min-h-[50px] w-full`}
    >
      {children || <div className="p-4 border border-dashed border-gray-200 text-gray-400 text-xs text-center w-full">Div Block (Flex)</div>}
    </div>
  )
}

export type ColumnContent = {
  columns: number
  gap: number
}

export function ColumnBlock({ content }: { content: ColumnContent }) {
  return (
    <div 
      className="grid py-4 px-4 w-full" 
      style={{ 
        gridTemplateColumns: `repeat(${content.columns || 2}, minmax(0, 1fr))`,
        gap: `${(content.gap || 4) * 4}px`
      }}
    >
      {Array.from({ length: content.columns || 2 }).map((_, i) => (
        <div key={i} className="min-h-[100px] bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
          Column {i + 1}
        </div>
      ))}
    </div>
  )
}

export type GridContent = {
  columns: number
  gap: number
  layout?: 'transparent' | 'card'
}

export function GridBlock({ content }: { content: GridContent }) {
  const layout = content.layout || 'transparent'
  const isCard = layout === 'card'

  return (
    <div 
      className="grid py-4 px-4 w-full" 
      style={{ 
        gridTemplateColumns: `repeat(${content.columns || 3}, minmax(0, 1fr))`,
        gap: `${(content.gap || 4) * 4}px`
      }}
    >
      {Array.from({ length: (content.columns || 3) * 2 }).map((_, i) => (
        <div 
          key={i} 
          className={`aspect-square flex items-center justify-center text-xs ${
            isCard 
              ? 'bg-white shadow-sm border border-gray-100 rounded-2xl hover:shadow-md transition-shadow' 
              : 'bg-gray-50 border border-dashed border-gray-200 rounded-lg text-gray-400'
          }`}
        >
          {isCard ? `Card ${i + 1}` : `Grid Item ${i + 1}`}
        </div>
      ))}
    </div>
  )
}

export type ListContent = {
  items: string[]
}

export function ListBlock({ content, theme }: { content: ListContent; theme?: ThemeProps }) {
  const primaryColor = theme?.primaryColor || '#4f46e5'
  return (
    <div className="py-4 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <ul className="space-y-2">
          {content.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: primaryColor }} />
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export type LinkBlockContent = {
  url: string
  target: string
}

export function LinkBlock({ content, children }: { content: LinkBlockContent; children?: React.ReactNode }) {
  return (
    <a 
      href={content.url || '#'} 
      target={content.target || '_self'}
      className="block w-full min-h-[50px] transition-opacity hover:opacity-90"
    >
      {children || <div className="p-4 border border-dashed border-gray-200 text-indigo-500 text-xs text-center">Link Block (Klik untuk Navigasi)</div>}
    </a>
  )
}

export type ButtonContent = {
  text: string
  url: string
  target: string
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  style?: React.CSSProperties
}

export function ButtonBlock({ content, theme }: { content: ButtonContent; theme?: ThemeProps }) {
  const primaryColor = theme?.primaryColor || '#4f46e5'
  
  let buttonClass = 'font-semibold transition-all inline-block text-center w-auto '
  const buttonStyle: React.CSSProperties = { ...content.style }

  // Size classes
  if (content.size === 'sm') {
    buttonClass += 'px-4 py-2 text-sm '
  } else if (content.size === 'lg') {
    buttonClass += 'px-8 py-4 text-lg '
  } else {
    buttonClass += 'px-6 py-3 ' // md default
  }

  if (content.variant === 'outline') {
    buttonClass += 'border-2 bg-transparent '
    buttonStyle.borderColor = primaryColor
    buttonStyle.color = primaryColor
  } else if (content.variant === 'ghost') {
    buttonClass += 'bg-transparent '
    buttonStyle.color = primaryColor
  } else {
    // solid
    buttonClass += 'text-white '
    buttonStyle.backgroundColor = primaryColor
  }

  // Handle rounded styles based on theme
  const roundedClass = theme?.fontFamily === 'Inter' ? 'rounded-md' : 'rounded-full'
  buttonClass += roundedClass

  return (
    <div className="w-full flex" style={{ justifyContent: content.style?.textAlign || 'center' }}>
      <a 
        href={content.url || '#'} 
        target={content.target || '_self'}
        className={buttonClass}
        style={buttonStyle}
      >
        {content.text || 'Klik Disini'}
      </a>
    </div>
  )
}

export function CMSBlock() {
  return (
    <div className="py-8 px-4 bg-white">
      <div className="max-w-4xl mx-auto p-8 border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-indigo-900 mb-1">CMS Collection</h3>
        <p className="text-indigo-600/70 text-sm max-w-xs">Hubungkan dengan koleksi data untuk menampilkan konten dinamis.</p>
      </div>
    </div>
  )
}