'use client'

import { useState } from 'react'

type BaseSettingsProps = {
  styles: Record<string, string | number>
  htmlId?: string
  onChange: (updatedStyles: Record<string, string | number>, htmlId?: string) => void
}

export function UniversalSettings({ styles, htmlId, onChange }: BaseSettingsProps) {
  const updateStyle = (key: string, value: string | number) => {
    onChange({ ...styles, [key]: value }, htmlId)
  }

  const updateHtmlId = (newId: string) => {
    onChange(styles, newId)
  }

  const parseValue = (val: string | number | undefined) => {
    if (!val) return ''
    return String(val).replace('px', '')
  }

  return (
    <div className="flex flex-col gap-4">
      {/* SPACING */}
      <section className="bg-white border border-gray-200 rounded p-3">
        <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-3">Spacing</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Padding */}
          <div className="flex flex-col gap-2">
            <span className="text-[9px] text-gray-500 font-semibold uppercase">Padding (px)</span>
            <div className="grid grid-cols-2 gap-1">
              <input type="number" placeholder="Top" value={parseValue(styles.paddingTop)} onChange={(e) => updateStyle('paddingTop', e.target.value ? `${e.target.value}px` : '')} className="settings-input" title="Padding Top" />
              <input type="number" placeholder="Bottom" value={parseValue(styles.paddingBottom)} onChange={(e) => updateStyle('paddingBottom', e.target.value ? `${e.target.value}px` : '')} className="settings-input" title="Padding Bottom" />
              <input type="number" placeholder="Left" value={parseValue(styles.paddingLeft)} onChange={(e) => updateStyle('paddingLeft', e.target.value ? `${e.target.value}px` : '')} className="settings-input" title="Padding Left" />
              <input type="number" placeholder="Right" value={parseValue(styles.paddingRight)} onChange={(e) => updateStyle('paddingRight', e.target.value ? `${e.target.value}px` : '')} className="settings-input" title="Padding Right" />
            </div>
          </div>
          {/* Margin */}
          <div className="flex flex-col gap-2">
            <span className="text-[9px] text-gray-500 font-semibold uppercase">Margin (px)</span>
            <div className="grid grid-cols-2 gap-1">
              <input type="number" placeholder="Top" value={parseValue(styles.marginTop)} onChange={(e) => updateStyle('marginTop', e.target.value ? `${e.target.value}px` : '')} className="settings-input" title="Margin Top" />
              <input type="number" placeholder="Bottom" value={parseValue(styles.marginBottom)} onChange={(e) => updateStyle('marginBottom', e.target.value ? `${e.target.value}px` : '')} className="settings-input" title="Margin Bottom" />
              <input type="number" placeholder="Left" value={parseValue(styles.marginLeft)} onChange={(e) => updateStyle('marginLeft', e.target.value ? `${e.target.value}px` : '')} className="settings-input" title="Margin Left" />
              <input type="number" placeholder="Right" value={parseValue(styles.marginRight)} onChange={(e) => updateStyle('marginRight', e.target.value ? `${e.target.value}px` : '')} className="settings-input" title="Margin Right" />
            </div>
          </div>
        </div>
      </section>

      {/* BACKGROUND */}
      <section className="bg-white border border-gray-200 rounded p-3">
        <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-3">Background & Border</h3>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Background Color</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={(styles.backgroundColor as string) || '#ffffff'} onChange={(e) => updateStyle('backgroundColor', e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer" />
              <input type="text" value={(styles.backgroundColor as string) || ''} onChange={(e) => updateStyle('backgroundColor', e.target.value)} placeholder="transparent" className="settings-input flex-1" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Border Radius (px)</label>
            <input type="number" value={parseValue(styles.borderRadius)} onChange={(e) => updateStyle('borderRadius', e.target.value ? `${e.target.value}px` : '')} className="settings-input" placeholder="0" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Border Width</label>
              <input type="number" value={parseValue(styles.borderWidth)} onChange={(e) => updateStyle('borderWidth', e.target.value ? `${e.target.value}px` : '')} className="settings-input" placeholder="0" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Border Color</label>
              <input type="color" value={(styles.borderColor as string) || '#e5e7eb'} onChange={(e) => updateStyle('borderColor', e.target.value)} className="w-full h-7 p-0 border-0 rounded cursor-pointer" />
            </div>
          </div>
        </div>
      </section>

      {/* ADVANCED */}
      <section className="bg-white border border-gray-200 rounded p-3">
        <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-3">Lanjutan (Advanced)</h3>
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">HTML ID (Untuk Anchor Link)</label>
          <input 
            type="text" 
            value={htmlId || ''} 
            onChange={(e) => updateHtmlId(e.target.value)} 
            placeholder="contoh: bagian-katalog" 
            className="settings-input" 
          />
          <p className="text-[9px] text-gray-400 mt-1">Anda bisa melink ke bagian ini dengan #id (contoh: #bagian-katalog)</p>
        </div>
      </section>
    </div>
  )
}
