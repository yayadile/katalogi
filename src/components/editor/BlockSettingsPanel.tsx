'use client'

import { useState, useCallback, useRef } from 'react'
import type { EditorBlock } from './BlockNavigator'
import { updatePageBlock } from '@/lib/actions/blocks'
import { updateThemeConfig } from '@/lib/actions/website'
import type { BlockType } from '@prisma/client'
import { uploadImage } from '@/lib/upload'
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Loader2 } from 'lucide-react'

// ─── Image Field Component ───────────────────────────────────────────────────

function ImageField({ 
  value, 
  onChange, 
  label 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  label: string 
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [mode, setMode] = useState<'url' | 'upload'>(value?.startsWith('http') || !value ? 'url' : 'upload')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar. Maksimal 5MB ya!')
      return
    }

    setIsUploading(true)
    try {
      const url = await uploadImage(file)
      onChange(url)
    } catch (err) {
      alert('Gagal upload. Pastikan bucket "images" di Supabase sudah siap.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
        <div className="flex bg-white/5 rounded-lg p-0.5">
          <button 
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-md text-[10px] transition-all ${mode === 'url' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-500'}`}
          >
            URL
          </button>
          <button 
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-md text-[10px] transition-all ${mode === 'upload' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-500'}`}
          >
            Upload
          </button>
        </div>
      </div>

      {mode === 'url' ? (
        <div className="relative group">
          <input
            className="settings-input pr-8"
            value={value}
            placeholder="https://..."
            onChange={(e) => onChange(e.target.value)}
          />
          <LinkIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
        </div>
      ) : (
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className="relative aspect-video bg-white/5 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.08] hover:border-indigo-500/50 transition-all group overflow-hidden"
        >
          {value ? (
            <>
              <img src={value} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="w-6 h-6 text-white mb-1" />
                <span className="text-[10px] font-bold text-white uppercase">Ganti Foto</span>
              </div>
            </>
          ) : (
            <>
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
              ) : (
                <>
                  <ImageIcon className="w-6 h-6 text-slate-600 mb-1 group-hover:text-indigo-400 transition-colors" />
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors uppercase">Klik untuk Upload</span>
                </>
              )}
            </>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleUpload} 
          />
        </div>
      )}
    </div>
  )
}

// ─── Hero Settings ─────────────────────────────────────────────────────────────

function HeroSettings({
  blockId,
  content,
  onChange,
}: {
  blockId: string
  content: Record<string, unknown>
  onChange: (updated: Record<string, unknown>) => void
}) {
  const [saving, setSaving] = useState(false)

  const save = useCallback(async (updated: Record<string, unknown>) => {
    setSaving(true)
    await updatePageBlock(blockId, updated)
    setSaving(false)
  }, [blockId])

  const update = (key: string, val: string) => {
    const updated = { ...content, [key]: val }
    onChange(updated)
  }

  return (
    <div className="space-y-4">
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
      <ImageField 
        label="Background Hero"
        value={String(content.bgImage ?? '')}
        onChange={(val) => {
          update('bgImage', val)
          save({ ...content, bgImage: val })
        }}
      />
      {saving && <p className="text-xs text-indigo-400 animate-pulse">Menyimpan...</p>}
    </div>
  )
}

// ─── Catalog Settings ──────────────────────────────────────────────────────────

type CatalogItem = { id: string; name: string; price: number; image: string; desc: string }

function CatalogSettings({
  blockId,
  content,
  onChange,
}: {
  blockId: string
  content: Record<string, unknown>
  onChange: (updated: Record<string, unknown>) => void
}) {
  const [items, setItems] = useState<CatalogItem[]>(
    (content.items as CatalogItem[]) ?? []
  )
  const [saving, setSaving] = useState(false)

  const saveAll = useCallback(async (newItems: CatalogItem[], title?: string) => {
    setSaving(true)
    const updated = { ...content, items: newItems, title: title ?? content.title }
    onChange(updated)
    await updatePageBlock(blockId, updated)
    setSaving(false)
  }, [blockId, content, onChange])

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

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Produk</span>
          <button
            onClick={addItem}
            className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors"
          >
            + Tambah
          </button>
        </div>

        {items.map((item) => (
          <div key={item.id} className="bg-white/5 rounded-xl p-3 space-y-2 border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-400 truncate flex-1">{item.name || 'Produk'}</span>
              <button
                onClick={() => removeItem(item.id)}
                className="text-slate-600 hover:text-red-400 transition-colors ml-2"
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

      {saving && <p className="text-xs text-indigo-400 animate-pulse">Menyimpan...</p>}
    </div>
  )
}

// ─── Contact Settings ──────────────────────────────────────────────────────────

function ContactSettings({
  blockId,
  content,
  onChange,
}: {
  blockId: string
  content: Record<string, unknown>
  onChange: (updated: Record<string, unknown>) => void
}) {
  const [saving, setSaving] = useState(false)

  const save = useCallback(async (updated: Record<string, unknown>) => {
    setSaving(true)
    onChange(updated)
    await updatePageBlock(blockId, updated)
    setSaving(false)
  }, [blockId, onChange])

  const update = (key: string, val: string) => ({ ...content, [key]: val })

  return (
    <div className="space-y-4">
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
      {saving && <p className="text-xs text-indigo-400 animate-pulse">Menyimpan...</p>}
    </div>
  )
}

// ─── Text Settings ─────────────────────────────────────────────────────────────

function TextSettings({
  blockId,
  content,
  onChange,
}: {
  blockId: string
  content: Record<string, unknown>
  onChange: (updated: Record<string, unknown>) => void
}) {
  const [saving, setSaving] = useState(false)

  const save = useCallback(async (text: string) => {
    setSaving(true)
    const updated = { ...content, text, html: `<p>${text}</p>` }
    onChange(updated)
    await updatePageBlock(blockId, updated)
    setSaving(false)
  }, [blockId, content, onChange])

  return (
    <div className="space-y-4">
      <Field label="Konten">
        <textarea
          className="settings-input resize-none"
          rows={8}
          defaultValue={String(content.text ?? '')}
          placeholder="Tulis konten Anda di sini..."
          onBlur={(e) => save(e.target.value)}
        />
      </Field>
      {saving && <p className="text-xs text-indigo-400 animate-pulse">Menyimpan...</p>}
    </div>
  )
}

// ─── Theme Settings ────────────────────────────────────────────────────────────

const FONT_FAMILIES = ['Inter', 'Poppins', 'DM Sans', 'Playfair Display'] as const
type FontFamily = typeof FONT_FAMILIES[number]

function ThemeSettings({
  websiteId,
  userId,
  currentTheme,
  onThemeChange,
}: {
  websiteId: string
  userId: string
  currentTheme: { primaryColor: string; secondaryColor: string; fontFamily: string }
  onThemeChange: (theme: typeof currentTheme) => void
}) {
  const [saving, setSaving] = useState(false)

  const save = useCallback(async (data: typeof currentTheme) => {
    setSaving(true)
    onThemeChange(data)
    await updateThemeConfig(websiteId, userId, data)
    setSaving(false)
  }, [websiteId, userId, onThemeChange])

  return (
    <div className="space-y-5">
      <Field label="Warna Utama">
        <div className="flex items-center gap-3">
          <input
            type="color"
            defaultValue={currentTheme.primaryColor}
            className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
            onBlur={(e) => save({ ...currentTheme, primaryColor: e.target.value })}
          />
          <input
            className="settings-input flex-1"
            defaultValue={currentTheme.primaryColor}
            placeholder="#8b5cf6"
            onBlur={(e) => save({ ...currentTheme, primaryColor: e.target.value })}
          />
        </div>
      </Field>

      <Field label="Warna Sekunder">
        <div className="flex items-center gap-3">
          <input
            type="color"
            defaultValue={currentTheme.secondaryColor}
            className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
            onBlur={(e) => save({ ...currentTheme, secondaryColor: e.target.value })}
          />
          <input
            className="settings-input flex-1"
            defaultValue={currentTheme.secondaryColor}
            placeholder="#1e293b"
            onBlur={(e) => save({ ...currentTheme, secondaryColor: e.target.value })}
          />
        </div>
      </Field>

      <Field label="Font">
        <select
          className="settings-input"
          defaultValue={currentTheme.fontFamily}
          onChange={(e) => save({ ...currentTheme, fontFamily: e.target.value as FontFamily })}
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </Field>

      {saving && <p className="text-xs text-indigo-400 animate-pulse">Menyimpan tema...</p>}
    </div>
  )
}

// ─── Field Helper ──────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

// ─── Main BlockSettings ────────────────────────────────────────────────────────

type BlockSettingsPanelProps = {
  selectedBlock: EditorBlock | null
  websiteId: string
  userId: string
  theme: { primaryColor: string; secondaryColor: string; fontFamily: string }
  onBlockContentChange: (blockId: string, content: Record<string, unknown>) => void
  onThemeChange: (theme: BlockSettingsPanelProps['theme']) => void
}

export default function BlockSettingsPanel({
  selectedBlock,
  websiteId,
  userId,
  theme,
  onBlockContentChange,
  onThemeChange,
}: BlockSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'block' | 'theme'>('block')

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-4">
        <button
          onClick={() => setActiveTab('block')}
          className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
            activeTab === 'block'
              ? 'text-indigo-400 border-b-2 border-indigo-500'
              : 'text-slate-500 hover:text-slate-400'
          }`}
        >
          Block
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
            activeTab === 'theme'
              ? 'text-indigo-400 border-b-2 border-indigo-500'
              : 'text-slate-500 hover:text-slate-400'
          }`}
        >
          Tema
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'theme' ? (
          <ThemeSettings
            websiteId={websiteId}
            userId={userId}
            currentTheme={theme}
            onThemeChange={onThemeChange}
          />
        ) : selectedBlock ? (
          <div>
            <div className="mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {selectedBlock.type}
              </span>
            </div>
            {(selectedBlock.type as BlockType) === 'HERO' && (
              <HeroSettings
                blockId={selectedBlock.id}
                content={selectedBlock.content}
                onChange={(c) => onBlockContentChange(selectedBlock.id, c)}
              />
            )}
            {(selectedBlock.type as BlockType) === 'CATALOG' && (
              <CatalogSettings
                blockId={selectedBlock.id}
                content={selectedBlock.content}
                onChange={(c) => onBlockContentChange(selectedBlock.id, c)}
              />
            )}
            {(selectedBlock.type as BlockType) === 'CONTACT' && (
              <ContactSettings
                blockId={selectedBlock.id}
                content={selectedBlock.content}
                onChange={(c) => onBlockContentChange(selectedBlock.id, c)}
              />
            )}
            {(selectedBlock.type as BlockType) === 'TEXT' && (
              <TextSettings
                blockId={selectedBlock.id}
                content={selectedBlock.content}
                onChange={(c) => onBlockContentChange(selectedBlock.id, c)}
              />
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-600 text-sm">
            <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
            </svg>
            Klik block di canvas untuk edit
          </div>
        )}
      </div>
    </div>
  )
}
