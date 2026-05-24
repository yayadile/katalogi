'use client'

import { useCallback } from 'react'
import { updatePageBlock } from '@/lib/actions/blocks'
import type { SaveStatus } from '../SaveStatusIndicator'
import { Field } from './SharedComponents'

export function TextSettings({
  blockId,
  content,
  onChange,
  onSaveStatus,
}: {
  blockId: string
  content: Record<string, unknown>
  onChange: (updated: Record<string, unknown>) => void
  onSaveStatus: (status: SaveStatus) => void
}) {
  const save = useCallback(async (updated: Record<string, unknown>) => {
    onSaveStatus('saving')
    try {
      onChange(updated)
      await updatePageBlock(blockId, updated)
      onSaveStatus('saved')
    } catch {
      onSaveStatus('error')
    }
  }, [blockId, onChange, onSaveStatus])

  const update = (key: string, val: string) => ({ ...content, [key]: val })

  return (
    <div className="space-y-4">
      <Field label="Judul">
        <input className="settings-input" defaultValue={String(content.title ?? '')} placeholder="Tentang Kami"
          onBlur={(e) => save(update('title', e.target.value))} />
      </Field>
      <Field label="Konten">
        <textarea className="settings-input resize-none" rows={6} defaultValue={String(content.body ?? '')} placeholder="Tuliskan deskripsi di sini..."
          onBlur={(e) => save(update('body', e.target.value))} />
      </Field>
      <Field label="Align">
        <select 
          className="settings-input" 
          defaultValue={String(content.align ?? 'left')}
          onChange={(e) => save(update('align', e.target.value))}
        >
          <option value="left">Kiri</option>
          <option value="center">Tengah</option>
          <option value="right">Kanan</option>
        </select>
      </Field>
    </div>
  )
}