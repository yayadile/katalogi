'use client'

import { useCallback } from 'react'
import { updatePageBlock } from '@/lib/actions/blocks'
import type { SaveStatus } from '../SaveStatusIndicator'
import { Field } from './SharedComponents'

export function ContactSettings({
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
      <Field label="Tampilan / Layout">
        <select
          className="settings-input"
          value={String(content.layout ?? 'split')}
          onChange={(e) => {
            const updated = update('layout', e.target.value)
            onChange(updated)
            save(updated)
          }}
        >
          <option value="split">Terbagi (Kiri-Kanan)</option>
          <option value="stacked">Bertumpuk (Tengah)</option>
        </select>
      </Field>
      <Field label="Judul Seksi">
        <input className="settings-input" defaultValue={String(content.title ?? '')} placeholder="Hubungi Kami"
          onBlur={(e) => save(update('title', e.target.value))} />
      </Field>
      <Field label="Email">
        <input className="settings-input" type="email" defaultValue={String(content.email ?? '')} placeholder="hello@toko.com"
          onBlur={(e) => save(update('email', e.target.value))} />
      </Field>
      <Field label="WhatsApp (format: 628xxx)">
        <input className="settings-input" defaultValue={String(content.whatsapp ?? '')} placeholder="6281234567890"
          onBlur={(e) => save(update('whatsapp', e.target.value))} />
      </Field>
      <Field label="Alamat">
        <textarea className="settings-input resize-none" rows={2} defaultValue={String(content.address ?? '')} placeholder="Kota, Provinsi"
          onBlur={(e) => save(update('address', e.target.value))} />
      </Field>
    </div>
  )
}