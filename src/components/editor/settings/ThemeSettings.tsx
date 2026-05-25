'use client'

import { useCallback } from 'react'
import { updateThemeConfig } from '@/lib/actions/website'
import type { SaveStatus } from '../SaveStatusIndicator'
import { Field } from './SharedComponents'

type ThemeConfig = { 
  primaryColor: string; 
  secondaryColor: string; 
  backgroundColor?: string; 
  buttonStyle?: 'sharp' | 'rounded' | 'pill'; 
  fontFamily: string;
  headingFont?: string;
}

export function ThemeSettings({
  pageId,
  userId,
  theme,
  onChange,
  onSaveStatus,
}: {
  pageId: string
  userId: string
  theme: ThemeConfig
  onChange: (updated: ThemeConfig) => void
  onSaveStatus: (status: SaveStatus) => void
}) {
  const save = useCallback(async (updated: ThemeConfig) => {
    onSaveStatus('saving')
    try {
      onChange(updated)
      await updateThemeConfig(pageId, userId, updated)
      onSaveStatus('saved')
    } catch {
      onSaveStatus('error')
    }
  }, [pageId, userId, onChange, onSaveStatus])

  const update = (key: string, val: string) => ({ ...theme, [key]: val } as ThemeConfig)

  return (
    <div className="space-y-4">
      <Field label="Warna Primer">
        <div className="flex gap-2">
          <input 
            type="color" 
            className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer"
            value={String(theme.primaryColor ?? '#8b5cf6')}
            onChange={(e) => save(update('primaryColor', e.target.value))}
          />
          <input 
            className="settings-input flex-1" 
            value={String(theme.primaryColor ?? '#8b5cf6')}
            onChange={(e) => save(update('primaryColor', e.target.value))}
          />
        </div>
      </Field>
      <Field label="Font Utama (Body)">
        <select 
          className="settings-input" 
          value={String(theme.fontFamily ?? 'Inter')}
          onChange={(e) => save(update('fontFamily', e.target.value))}
        >
          <option value="Inter">Inter (Modern)</option>
          <option value="Plus Jakarta Sans">Jakarta Sans (Clean)</option>
          <option value="Playfair Display">Playfair (Elegant)</option>
          <option value="Outfit">Outfit (Geometric)</option>
        </select>
      </Field>
      <Field label="Font Judul (Heading)">
        <select 
          className="settings-input" 
          value={String(theme.headingFont ?? theme.fontFamily ?? 'Inter')}
          onChange={(e) => save(update('headingFont', e.target.value))}
        >
          <option value="Inter">Inter</option>
          <option value="Plus Jakarta Sans">Jakarta Sans</option>
          <option value="Playfair Display">Playfair Display</option>
          <option value="Outfit">Outfit</option>
          <option value="Merriweather">Merriweather (Serif)</option>
        </select>
      </Field>
      <Field label="Warna Background">
        <div className="flex gap-2">
          <input 
            type="color" 
            className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer"
            value={String(theme.backgroundColor ?? '#F8FAFC')}
            onChange={(e) => save(update('backgroundColor', e.target.value))}
          />
          <input 
            className="settings-input flex-1" 
            value={String(theme.backgroundColor ?? '#F8FAFC')}
            onChange={(e) => save(update('backgroundColor', e.target.value))}
          />
        </div>
      </Field>
      <Field label="Bentuk Tombol">
        <div className="flex gap-2">
          {(['sharp', 'rounded', 'pill'] as const).map((style) => (
            <button
              key={style}
              onClick={() => save(update('buttonStyle', style))}
              className={`flex-1 py-2 px-3 text-xs font-semibold border rounded-md transition-colors ${
                (theme.buttonStyle || 'rounded') === style
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-transparent border-gray-300 text-gray-500 hover:border-gray-400'
              }`}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>
      </Field>
    </div>
  )
}