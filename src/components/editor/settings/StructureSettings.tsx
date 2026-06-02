'use client'

import type { SaveStatus } from '../SaveStatusIndicator'
import { Field } from './SharedComponents'

type BaseSettingsProps = {
  blockId: string
  content: Record<string, unknown>
  onChange: (updated: Record<string, unknown>) => void
  onSaveStatus: (status: SaveStatus) => void
}

export function ColumnSettings({ content, onChange }: BaseSettingsProps) {
  const update = (key: string, val: number | string) => {
    onChange({ ...content, [key]: val })
  }

  return (
    <div className="space-y-4">
      <Field label="Jumlah Kolom">
        <input 
          type="number" 
          className="settings-input" 
          min={1} 
          max={6}
          value={Number(content.columns ?? 2)} 
          onChange={(e) => update('columns', Number(e.target.value))} 
        />
      </Field>
      <Field label="Gap (Spasi)">
        <input 
          type="number" 
          className="settings-input" 
          min={0} 
          max={12}
          value={Number(content.gap ?? 4)} 
          onChange={(e) => update('gap', Number(e.target.value))} 
        />
      </Field>
    </div>
  )
}

export function GridSettings({ content, onChange }: BaseSettingsProps) {
  const update = (key: string, val: number | string) => {
    onChange({ ...content, [key]: val })
  }

  return (
    <div className="space-y-4">
      <Field label="Tampilan / Layout">
        <select 
          className="settings-input" 
          value={String(content.layout ?? 'transparent')}
          onChange={(e) => update('layout', e.target.value)}
        >
          <option value="transparent">Transparan (Default)</option>
          <option value="card">Kartu (Card)</option>
        </select>
      </Field>
      <Field label="Kolom Grid">
        <input 
          type="number" 
          className="settings-input" 
          min={1} 
          max={12}
          value={Number(content.columns ?? 3)} 
          onChange={(e) => update('columns', Number(e.target.value))} 
        />
      </Field>
      <Field label="Gap (Spasi)">
        <input 
          type="number" 
          className="settings-input" 
          min={0} 
          max={12}
          value={Number(content.gap ?? 4)} 
          onChange={(e) => update('gap', Number(e.target.value))} 
        />
      </Field>
    </div>
  )
}

export function LinkBlockSettings({ content, onChange }: BaseSettingsProps) {
  const update = (key: string, val: string) => {
    onChange({ ...content, [key]: val })
  }

  return (
    <div className="space-y-4">
      <Field label="URL Tujuan">
        <input 
          className="settings-input" 
          placeholder="https://..."
          value={String(content.url ?? '')} 
          onChange={(e) => update('url', e.target.value)} 
        />
      </Field>
      <Field label="Target">
        <select 
          className="settings-input" 
          value={String(content.target ?? '_self')}
          onChange={(e) => update('target', e.target.value)}
        >
          <option value="_self">Tab yang sama</option>
          <option value="_blank">Tab baru</option>
        </select>
      </Field>
    </div>
  )
}

export function ButtonSettings({ content, onChange }: BaseSettingsProps) {
  const update = (key: string, val: string) => {
    onChange({ ...content, [key]: val })
  }

  return (
    <div className="space-y-4">
      <Field label="Teks Tombol">
        <input 
          className="settings-input" 
          value={String(content.text ?? '')} 
          onChange={(e) => update('text', e.target.value)} 
        />
      </Field>
      <Field label="URL / ID Target (Anchor)">
        <input 
          className="settings-input" 
          placeholder="https://... atau #namabagian"
          value={String(content.url ?? '')} 
          onChange={(e) => update('url', e.target.value)} 
        />
        <p className="text-[9px] text-gray-400 mt-1">Gunakan # untuk scroll (contoh: #katalogku)</p>
      </Field>
      <Field label="Target">
        <select 
          className="settings-input" 
          value={String(content.target ?? '_self')}
          onChange={(e) => update('target', e.target.value)}
        >
          <option value="_self">Tab yang sama</option>
          <option value="_blank">Tab baru</option>
        </select>
      </Field>
      <Field label="Gaya (Variant)">
        <select 
          className="settings-input" 
          value={String(content.variant ?? 'solid')}
          onChange={(e) => update('variant', e.target.value)}
        >
          <option value="solid">Padat (Solid)</option>
          <option value="outline">Garis (Outline)</option>
          <option value="ghost">Transparan (Ghost)</option>
        </select>
      </Field>
      <Field label="Ukuran">
        <select 
          className="settings-input" 
          value={String(content.size ?? 'md')}
          onChange={(e) => update('size', e.target.value)}
        >
          <option value="sm">Kecil (Small)</option>
          <option value="md">Sedang (Medium)</option>
          <option value="lg">Besar (Large)</option>
        </select>
      </Field>
    </div>
  )
}

export function ListSettings({ content, onChange }: BaseSettingsProps) {
  const items = (content.items as string[]) || []
  
  const updateItems = (newItems: string[]) => {
    onChange({ ...content, items: newItems })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase">Daftar Item</label>
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input 
              className="settings-input" 
              value={item} 
              onChange={(e) => {
                const newItems = [...items]
                newItems[i] = e.target.value
                updateItems(newItems)
              }} 
            />
            <button 
              onClick={() => updateItems(items.filter((_, idx) => idx !== i))}
              className="p-2 text-red-500 hover:bg-red-50 rounded"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
        <button 
          onClick={() => updateItems([...items, 'Item baru'])}
          className="w-full py-2 border-2 border-dashed border-gray-200 rounded text-xs text-gray-500 hover:border-purple-500 hover:text-purple-800"
        >
          + Tambah Item
        </button>
      </div>
    </div>
  )
}

export function DivSettings({ content, onChange }: BaseSettingsProps) {
  const update = (key: string, val: string) => {
    onChange({ ...content, [key]: val })
  }

  return (
    <div className="space-y-4">
      <Field label="Arah Susunan (Flex Direction)">
        <select 
          className="settings-input" 
          value={String(content.flexDirection ?? 'col')}
          onChange={(e) => update('flexDirection', e.target.value)}
        >
          <option value="col">Menurun (Column)</option>
          <option value="row">Mendatar (Row)</option>
        </select>
      </Field>

      <Field label="Perataan Utama (Justify Content)">
        <select 
          className="settings-input" 
          value={String(content.justifyContent ?? 'start')}
          onChange={(e) => update('justifyContent', e.target.value)}
        >
          <option value="start">Awal (Start)</option>
          <option value="center">Tengah (Center)</option>
          <option value="end">Akhir (End)</option>
          <option value="between">Renggang (Space Between)</option>
          <option value="around">Sekitar (Space Around)</option>
        </select>
      </Field>

      <Field label="Perataan Silang (Align Items)">
        <select 
          className="settings-input" 
          value={String(content.alignItems ?? 'stretch')}
          onChange={(e) => update('alignItems', e.target.value)}
        >
          <option value="stretch">Penuh (Stretch)</option>
          <option value="start">Atas/Kiri (Start)</option>
          <option value="center">Tengah (Center)</option>
          <option value="end">Bawah/Kanan (End)</option>
        </select>
      </Field>

      <Field label="Jarak Antar Item (Gap)">
        <input 
          type="number"
          className="settings-input" 
          min={0}
          max={20}
          value={Number(content.gap ?? 0)}
          onChange={(e) => update('gap', e.target.value)}
        />
      </Field>
    </div>
  )
}

export function CMSSettings({ content, onChange }: BaseSettingsProps) {
  const update = (key: string, val: string | number) => {
    onChange({ ...content, [key]: val })
  }

  return (
    <div className="space-y-4">
      <Field label="ID Koleksi Database">
        <input 
          className="settings-input" 
          placeholder="col_12345"
          value={String(content.collectionId ?? '')} 
          onChange={(e) => update('collectionId', e.target.value)} 
        />
        <p className="text-[9px] text-gray-400 mt-1">
          Masukkan ID Koleksi dari database Anda. Fitur ini masih dalam tahap persiapan.
        </p>
      </Field>

      <Field label="Batas Item (Limit)">
        <input 
          type="number"
          className="settings-input" 
          min={1}
          max={100}
          value={Number(content.limit ?? 10)} 
          onChange={(e) => update('limit', Number(e.target.value))} 
        />
      </Field>
    </div>
  )
}