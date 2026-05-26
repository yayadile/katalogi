'use client'

import { useCallback } from 'react'
import { updatePageBlock } from '@/lib/actions/blocks'
import type { SaveStatus } from '../SaveStatusIndicator'
import { Field, ImageField } from './SharedComponents'

export function HeroSettings({
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
      await updatePageBlock(blockId, updated)
      onSaveStatus('saved')
    } catch {
      onSaveStatus('error')
    }
  }, [blockId, onSaveStatus])

  const update = (key: string, val: string) => {
    const updated = { ...content, [key]: val }
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <Field label="Tampilan / Layout">
        <select
          className="settings-input"
          value={String(content.variant ?? 'centered')}
          onChange={(e) => {
            update('variant', e.target.value)
            save({ ...content, variant: e.target.value })
          }}
        >
          <option value="centered">Teks di Tengah (Centered)</option>
          <option value="split-left">Terbagi (Teks di Kiri)</option>
          <option value="split-right">Terbagi (Teks di Kanan)</option>
        </select>
      </Field>
      <Field label="Judul Utama">
        <input
          className="settings-input"
          defaultValue={String(content.headline ?? '')}
          placeholder="Judul hero"
          onChange={(e) => update('headline', e.target.value)}
          onBlur={(e) => save({ ...content, headline: e.target.value })}
        />
      </Field>
      <Field label="Sub-judul">
        <textarea
          className="settings-input resize-none"
          rows={2}
          defaultValue={String(content.subtext ?? '')}
          placeholder="Deskripsi singkat"
          onChange={(e) => update('subtext', e.target.value)}
          onBlur={(e) => save({ ...content, subtext: e.target.value })}
        />
      </Field>
      <Field label="Teks Tombol CTA">
        <input
          className="settings-input"
          defaultValue={String(content.ctaText ?? '')}
          placeholder="Mis: Lihat Produk"
          onChange={(e) => update('ctaText', e.target.value)}
          onBlur={(e) => save({ ...content, ctaText: e.target.value })}
        />
      </Field>
      <Field label="Tautan / Link CTA">
        <input
          className="settings-input"
          defaultValue={String(content.ctaLink ?? '')}
          placeholder="URL atau #id-elemen"
          onChange={(e) => update('ctaLink', e.target.value)}
          onBlur={(e) => save({ ...content, ctaLink: e.target.value })}
        />
        <p className="text-[9px] text-gray-400 mt-1">Gunakan #id untuk gulir ke elemen lain (contoh: #katalog), atau http://... untuk link luar.</p>
      </Field>
      <ImageField 
        label="Background Hero"
        value={String(content.bgImage ?? '')}
        onChange={(val) => {
          update('bgImage', val)
          save({ ...content, bgImage: val })
        }}
      />
    </div>
  )
}