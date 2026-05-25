'use client'

import { useState, useCallback } from 'react'
import { updatePageBlock } from '@/lib/actions/blocks'
import type { SaveStatus } from '../SaveStatusIndicator'
import { Field, ImageField } from './SharedComponents'

type CatalogItem = { id: string; name: string; price: number; image: string; desc: string }

export function CatalogSettings({
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
  const [items, setItems] = useState<CatalogItem[]>(
    (content.items as CatalogItem[]) ?? []
  )

  const saveAll = useCallback(async (newItems: CatalogItem[], title?: string, layout?: string, imageRatio?: string) => {
    onSaveStatus('saving')
    try {
      const updated = { 
        ...content, 
        items: newItems, 
        title: title ?? content.title,
        layout: layout ?? content.layout,
        imageRatio: imageRatio ?? content.imageRatio 
      }
      onChange(updated)
      await updatePageBlock(blockId, updated)
      onSaveStatus('saved')
    } catch {
      onSaveStatus('error')
    }
  }, [blockId, content, onChange, onSaveStatus])

  const addItem = () => {
    const newItem: CatalogItem = {
      id: Date.now().toString(),
      name: 'Produk Baru',
      price: 0,
      image: '',
      desc: '',
    }
    const updated = [...items, newItem]
    setItems(updated)
    saveAll(updated)
  }

  const removeItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id)
    setItems(updated)
    saveAll(updated)
  }

  const updateItem = (id: string, key: keyof CatalogItem, val: string | number) => {
    const updated = items.map((i) => (i.id === id ? { ...i, [key]: val } : i))
    setItems(updated)
    return updated
  }

  return (
    <div className="space-y-4">
      <Field label="Judul Seksi">
        <input
          className="settings-input"
          defaultValue={String(content.title ?? '')}
          placeholder="Produk Unggulan"
          onBlur={(e) => saveAll(items, e.target.value)}
        />
      </Field>

      <Field label="Layout Katalog">
        <select
          className="settings-input"
          defaultValue={String(content.layout ?? 'grid')}
          onChange={(e) => saveAll(items, undefined, e.target.value, undefined)}
        >
          <option value="grid">Grid (Kotak-kotak)</option>
          <option value="list">List (Memanjang)</option>
        </select>
      </Field>

      <Field label="Rasio Foto Produk">
        <select
          className="settings-input"
          defaultValue={String(content.imageRatio ?? '4:3')}
          onChange={(e) => saveAll(items, undefined, undefined, e.target.value)}
        >
          <option value="1:1">1:1 (Square)</option>
          <option value="4:3">4:3 (Portrait/Landscape)</option>
          <option value="16:9">16:9 (Widescreen)</option>
        </select>
      </Field>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Produk</span>
          <button
            onClick={addItem}
            className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
          >
            + Tambah
          </button>
        </div>

        {items.map((item) => (
          <div key={item.id} className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 truncate flex-1">{item.name || 'Produk'}</span>
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors ml-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <input
              className="settings-input text-xs"
              value={item.name}
              placeholder="Nama produk"
              onChange={(e) => updateItem(item.id, 'name', e.target.value)}
              onBlur={() => saveAll(items)}
            />
            <input
              className="settings-input text-xs"
              type="number"
              value={item.price}
              placeholder="Harga"
              onChange={(e) => {
                const updated = updateItem(item.id, 'price', Number(e.target.value))
                setItems(updated)
              }}
              onBlur={() => saveAll(items)}
            />
            <textarea
              className="settings-input text-xs resize-none"
              rows={2}
              value={item.desc}
              placeholder="Deskripsi"
              onChange={(e) => {
                const updated = updateItem(item.id, 'desc', e.target.value)
                setItems(updated)
              }}
              onBlur={() => saveAll(items)}
            />
            <ImageField 
              label="Foto Produk"
              value={item.image}
              onChange={(val) => {
                const updated = updateItem(item.id, 'image', val)
                saveAll(updated)
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}