'use client'

import { useCallback } from 'react'
import { updateThemeConfig } from '@/lib/actions/website'
import type { SaveStatus } from '../SaveStatusIndicator'
import { Field } from './SharedComponents'

type ThemeConfig = { primaryColor: string; secondaryColor: string; fontFamily: string }

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
      <Field label="Font Family">
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
    </div>
  )
}