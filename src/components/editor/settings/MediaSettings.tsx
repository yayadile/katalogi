'use client'

import type { SaveStatus } from '../SaveStatusIndicator'
import { Field } from './SharedComponents'

type BaseSettingsProps = {
  blockId: string
  content: Record<string, unknown>
  onChange: (updated: Record<string, unknown>) => void
  onSaveStatus: (status: SaveStatus) => void
}

export function VideoSettings({ content, onChange }: BaseSettingsProps) {
  const update = (key: string, val: string) => {
    onChange({ ...content, [key]: val })
  }

  return (
    <div className="space-y-4">
      <Field label="Platform">
        <select 
          className="settings-input" 
          value={String(content.platform ?? 'youtube')}
          onChange={(e) => update('platform', e.target.value)}
        >
          <option value="youtube">YouTube</option>
          <option value="vimeo">Vimeo</option>
          <option value="custom">URL Langsung (MP4)</option>
        </select>
      </Field>
      <Field label="Video URL">
        <input 
          className="settings-input" 
          placeholder="https://www.youtube.com/watch?v=..."
          value={String(content.url ?? '')} 
          onChange={(e) => update('url', e.target.value)} 
        />
      </Field>
    </div>
  )
}

export function GallerySettings({ content, onChange }: BaseSettingsProps) {
  const images = (content.images as string[]) || []
  
  const updateImages = (newImages: string[]) => {
    onChange({ ...content, images: newImages })
  }

  const update = (key: string, val: string | number) => {
    onChange({ ...content, [key]: val })
  }

  return (
    <div className="space-y-4">
      <Field label="Judul Galeri (Opsional)">
        <input 
          className="settings-input" 
          placeholder="Galeri Saya"
          value={String(content.title ?? '')} 
          onChange={(e) => update('title', e.target.value)} 
        />
      </Field>

      <Field label="Tampilan / Rasio">
        <select 
          className="settings-input" 
          value={String(content.layout ?? 'square')}
          onChange={(e) => update('layout', e.target.value)}
        >
          <option value="square">Kotak (1:1)</option>
          <option value="video">Memanjang (16:9)</option>
        </select>
      </Field>

      <Field label="Kolom Grid">
        <select 
          className="settings-input" 
          value={String(content.columns ?? 3)}
          onChange={(e) => update('columns', Number(e.target.value))}
        >
          <option value="1">1 Kolom</option>
          <option value="2">2 Kolom</option>
          <option value="3">3 Kolom</option>
          <option value="4">4 Kolom</option>
        </select>
      </Field>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase">Daftar Gambar URL</label>
        {images.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input 
              className="settings-input" 
              placeholder="https://...image.jpg"
              value={item} 
              onChange={(e) => {
                const newImages = [...images]
                newImages[i] = e.target.value
                updateImages(newImages)
              }} 
            />
            <button 
              onClick={() => updateImages(images.filter((_, idx) => idx !== i))}
              className="p-2 text-red-500 hover:bg-red-50 rounded shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
        <button 
          onClick={() => updateImages([...images, ''])}
          className="w-full py-2 border-2 border-dashed border-gray-200 rounded text-xs text-gray-500 hover:border-purple-500 hover:text-purple-800"
        >
          + Tambah Gambar
        </button>
      </div>
    </div>
  )
}