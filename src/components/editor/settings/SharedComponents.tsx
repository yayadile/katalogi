'use client'

import { useState, useRef } from 'react'
import { Upload, ImageIcon, Link as LinkIcon, Loader2 } from 'lucide-react'
import { uploadImage } from '@/lib/upload'

// ─── Field Helper ──────────────────────────────────────────────────────────────

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

// ─── Image Field Component ───────────────────────────────────────────────────

export function ImageField({ 
  value, 
  onChange, 
  label 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  label: string 
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'url' | 'upload'>(value?.startsWith('http') || !value ? 'url' : 'upload')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)

    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran foto terlalu besar (maks 5MB).')
      return
    }

    setIsUploading(true)
    try {
      const url = await uploadImage(file)
      onChange(url)
    } catch (err) {
      console.error('Detailed upload error:', err)
      const message = err instanceof Error ? err.message : 'Gagal upload'
      setError(message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</label>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button 
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-md text-[10px] transition-all ${mode === 'url' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500'}`}
          >
            URL
          </button>
          <button 
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-md text-[10px] transition-all ${mode === 'upload' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500'}`}
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
            onChange={(e) => {
              setError(null)
              onChange(e.target.value)
            }}
          />
          <LinkIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
      ) : (
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className="relative aspect-video bg-gray-50 border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-indigo-300 transition-all group overflow-hidden"
        >
          {value ? (
            <>
              <img src={value} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="w-6 h-6 text-gray-600 mb-1" />
                <span className="text-[10px] font-bold text-gray-600 uppercase">Ganti Foto</span>
              </div>
            </>
          ) : (
            <>
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
              ) : (
                <>
                  <ImageIcon className="w-6 h-6 text-gray-400 mb-1 group-hover:text-indigo-500 transition-colors" />
                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-600 transition-colors uppercase">Klik untuk Upload</span>
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
      
      {error && (
        <p className="text-[10px] text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  )
}
