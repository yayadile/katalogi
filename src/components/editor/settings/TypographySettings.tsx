'use client'

import type { SaveStatus } from '../SaveStatusIndicator'
import { Field } from './SharedComponents'

type BaseSettingsProps = {
  blockId: string
  content: Record<string, unknown>
  onChange: (updated: Record<string, unknown>) => void
  onSaveStatus: (status: SaveStatus) => void
}

export function HeadingSettings({ content, onChange }: BaseSettingsProps) {
  const update = (key: string, val: string | number) => {
    onChange({ ...content, [key]: val })
  }

  return (
    <div className="space-y-4">
      <Field label="Teks Heading">
        <input 
          className="settings-input" 
          value={String(content.text ?? '')} 
          onChange={(e) => update('text', e.target.value)} 
        />
      </Field>
      <Field label="Level">
        <select 
          className="settings-input" 
          value={Number(content.level ?? 1)}
          onChange={(e) => update('level', Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6].map(l => (
            <option key={l} value={l}>H{l}</option>
          ))}
        </select>
      </Field>
    </div>
  )
}

export function ParagraphSettings({ content, onChange }: BaseSettingsProps) {
  const update = (key: string, val: string | number) => {
    onChange({ ...content, [key]: val })
  }

  return (
    <div className="space-y-4">
      <Field label="Teks Paragraf">
        <textarea 
          className="settings-input resize-none" 
          rows={5}
          value={String(content.text ?? '')} 
          onChange={(e) => update('text', e.target.value)} 
        />
      </Field>
    </div>
  )
}

export function QuoteSettings({ content, onChange }: BaseSettingsProps) {
  const update = (key: string, val: string | number) => {
    onChange({ ...content, [key]: val })
  }

  return (
    <div className="space-y-4">
      <Field label="Kutipan">
        <textarea 
          className="settings-input resize-none" 
          rows={3}
          value={String(content.text ?? '')} 
          onChange={(e) => update('text', e.target.value)} 
        />
      </Field>
      <Field label="Penulis">
        <input 
          className="settings-input" 
          value={String(content.author ?? '')} 
          onChange={(e) => update('author', e.target.value)} 
        />
      </Field>
    </div>
  )
}