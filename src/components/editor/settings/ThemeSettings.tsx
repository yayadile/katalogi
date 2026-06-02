'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import { updateThemeConfig } from '@/lib/actions/website'
import type { SaveStatus } from '../SaveStatusIndicator'
import { Field } from './SharedComponents'

type ThemeConfig = { 
  primaryColor: string; 
  secondaryColor: string; 
  backgroundColor?: string; 
  buttonStyle?: 'sharp' | 'rounded' | 'pill'; 
  fontFamily: string;
  headingFont?: string;
}

// Math Helpers for HEX <-> HSB (HSV) conversions
function hsvToHex(h: number, s: number, v: number): string {
  s /= 100;
  v /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const f = (n: number) => {
    const color = v * (1 - s * Math.max(0, Math.min(k(n) - 3, 9 - k(n), 1)));
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsv(hex: string): { h: number; s: number; v: number } {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;
  
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return { h: 0, s: 0, v: 100 };
  }

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, v = max;

  let d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
}

// 2D Saturation & Brightness (HSB) Gradient Picker Area
function SaturationValuePicker({
  hue,
  saturation,
  value,
  onChange
}: {
  hue: number
  saturation: number
  value: number
  onChange: (s: number, v: number) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const handleUpdate = (clientX: number, clientY: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    
    let x = ((clientX - rect.left) / rect.width) * 100
    let y = 100 - ((clientY - rect.top) / rect.height) * 100
    
    x = Math.max(0, Math.min(100, x))
    y = Math.max(0, Math.min(100, y))
    
    onChange(Math.round(x), Math.round(y))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    handleUpdate(e.clientX, e.clientY)
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging.current) return
      handleUpdate(event.clientX, event.clientY)
    }
    
    const handleMouseUp = () => {
      isDragging.current = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true
    const touch = e.touches[0]
    if (touch) handleUpdate(touch.clientX, touch.clientY)
    
    const handleTouchMove = (event: TouchEvent) => {
      if (!isDragging.current) return
      const t = event.touches[0]
      if (t) handleUpdate(t.clientX, t.clientY)
    }
    
    const handleTouchEnd = () => {
      isDragging.current = false
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
    
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd)
  }

  const pointerLeft = `${saturation}%`
  const pointerTop = `${100 - value}%`

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        backgroundColor: `hsl(${hue}, 100%, 50%)`,
        backgroundImage: 'linear-gradient(to top, #000000, transparent), linear-gradient(to right, #ffffff, transparent)',
        backgroundBlendMode: 'multiply'
      }}
      className="relative w-full h-28 rounded-lg cursor-crosshair overflow-hidden shadow-inner select-none mb-3"
    >
      <div
        style={{
          left: pointerLeft,
          top: pointerTop,
          transform: 'translate(-50%, -50%)'
        }}
        className="absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow shadow-black/40 bg-transparent pointer-events-none transition-all duration-75"
      />
    </div>
  )
}

// Gorgeous Figma/Canva-Style React Color Picker Popover
function ColorPickerPopover({
  label,
  value,
  onChange
}: {
  label: string
  value: string
  onChange: (color: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Parse HSV state from current Hex
  const { h: initialH, s: initialS, v: initialV } = hexToHsv(value || '#ffffff')
  const [hue, setHue] = useState(initialH)
  const [saturation, setSaturation] = useState(initialS)
  const [brightness, setBrightness] = useState(initialV)

  // Keep internal HSB in sync if Hex changes from presets or externally
  useEffect(() => {
    const { h, s, v } = hexToHsv(value || '#ffffff')
    setHue(h)
    setSaturation(s)
    setBrightness(v)
  }, [value])

  const presets = [
    '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', 
    '#4f46e5', '#6366f1', '#8b5cf6', '#a78bfa',
    '#10b981', '#34d399', '#f43f5e', '#fb7185',
    '#0ea5e9', '#38bdf8', '#0f172a', '#1e293b'
  ]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handle2DSelectorChange = (s: number, v: number) => {
    setSaturation(s)
    setBrightness(v)
    const hex = hsvToHex(hue, s, v)
    onChange(hex)
  }

  const handleHueSliderChange = (h: number) => {
    setHue(h)
    const hex = hsvToHex(h, saturation, brightness)
    onChange(hex)
  }

  const handleHexInputChange = (hexVal: string) => {
    onChange(hexVal)
    if (/^#[0-9A-F]{6}$/i.test(hexVal)) {
      const { h, s, v } = hexToHsv(hexVal)
      setHue(h)
      setSaturation(s)
      setBrightness(v)
    }
  }

  return (
    <div className="relative flex flex-col gap-1.5 animate-in fade-in duration-200" ref={popoverRef}>
      <style>{`
        .custom-slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          background: #ffffff;
          border: 2px solid #4f46e5;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
          cursor: pointer;
          transition: transform 0.1s;
        }
        .custom-slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>

      <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">{label}</label>
      
      <div className="flex gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{ backgroundColor: value || '#ffffff' }}
          className="w-10 h-10 rounded-lg border border-slate-200 shadow-sm cursor-pointer shrink-0 transition-transform active:scale-95 hover:border-slate-300"
          title="Buka Pemilih Warna"
        />
        
        <input 
          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none font-bold text-slate-800 shadow-sm" 
          value={value || ''}
          onChange={(e) => handleHexInputChange(e.target.value)}
          placeholder="#ffffff"
        />
      </div>

      {isOpen && (
        <div className="absolute top-14 left-0 z-50 w-60 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl animate-in fade-in zoom-in-95 duration-150">
          
          {/* 1. 2D Saturation-Brightness Canvas (Figma-Style) */}
          <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Kustom Mandiri</div>
          <SaturationValuePicker
            hue={hue}
            saturation={saturation}
            value={brightness}
            onChange={handle2DSelectorChange}
          />

          {/* 2. Hue Slider (Rainbow) */}
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase">
              <span>Warna (Hue)</span>
              <span>{hue}°</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="360" 
              value={hue} 
              onChange={(e) => handleHueSliderChange(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none bg-transparent custom-slider-thumb"
              style={{
                background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                WebkitAppearance: 'none'
              }}
            />
          </div>

          <div className="border-t border-slate-100 my-3.5" />

          {/* 3. Preset Swatches */}
          <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Palet Pilihan</div>
          <div className="grid grid-cols-4 gap-1.5">
            {presets.map((color) => (
              <button
                key={color}
                onClick={() => {
                  onChange(color)
                  const { h, s, v } = hexToHsv(color)
                  setHue(h)
                  setSaturation(s)
                  setBrightness(v)
                  setIsOpen(false)
                }}
                style={{ backgroundColor: color }}
                className={`w-9 h-9 rounded-md border border-slate-200/60 cursor-pointer hover:scale-105 active:scale-95 transition-transform ${
                  value.toLowerCase() === color.toLowerCase() ? 'ring-2 ring-indigo-600 ring-offset-1' : ''
                }`}
                title={color}
              />
            ))}
          </div>

        </div>
      )}
    </div>
  )
}

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
  const pendingSaveRef = useRef<NodeJS.Timeout | null>(null)

  // Fluid Debounced Theme Auto-Saver
  const handleThemeChange = useCallback((key: string, value: string) => {
    // 1. Instantly update Zustand store so the Canvas preview renders in real-time (60fps)
    const updated = { ...theme, [key]: value } as ThemeConfig
    onChange(updated)

    // 2. Debounce the database write
    if (pendingSaveRef.current) {
      clearTimeout(pendingSaveRef.current)
    }

    onSaveStatus('saving')
    pendingSaveRef.current = setTimeout(async () => {
      try {
        await updateThemeConfig(pageId, userId, updated)
        onSaveStatus('saved')
      } catch (err) {
        console.error("Theme save failed:", err)
        onSaveStatus('error')
      }
    }, 800) // 800ms debounce
  }, [pageId, userId, theme, onChange, onSaveStatus])

  // Cleanup pending save timeouts on unmount
  useEffect(() => {
    return () => {
      if (pendingSaveRef.current) {
        clearTimeout(pendingSaveRef.current)
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* Warna Primer Picker */}
      <ColorPickerPopover
        label="Warna Primer"
        value={theme.primaryColor ?? '#4f46e5'}
        onChange={(color) => handleThemeChange('primaryColor', color)}
      />

      {/* Warna Background Picker */}
      <ColorPickerPopover
        label="Warna Background"
        value={theme.backgroundColor ?? '#ffffff'}
        onChange={(color) => handleThemeChange('backgroundColor', color)}
      />

      {/* Font Utama Dropdown */}
      <Field label="Font Utama (Body)">
        <select 
          className="settings-input" 
          value={String(theme.fontFamily ?? 'Inter')}
          onChange={(e) => handleThemeChange('fontFamily', e.target.value)}
        >
          <option value="Inter">Inter (Modern)</option>
          <option value="Plus Jakarta Sans">Jakarta Sans (Clean)</option>
          <option value="Playfair Display">Playfair (Elegant)</option>
          <option value="Outfit">Outfit (Geometric)</option>
        </select>
      </Field>

      {/* Font Judul Dropdown */}
      <Field label="Font Judul (Heading)">
        <select 
          className="settings-input" 
          value={String(theme.headingFont ?? theme.fontFamily ?? 'Inter')}
          onChange={(e) => handleThemeChange('headingFont', e.target.value)}
        >
          <option value="Inter">Inter</option>
          <option value="Plus Jakarta Sans">Jakarta Sans</option>
          <option value="Playfair Display">Playfair Display</option>
          <option value="Outfit">Outfit</option>
          <option value="Merriweather">Merriweather (Serif)</option>
        </select>
      </Field>

      {/* Bentuk Tombol Buttons */}
      <Field label="Bentuk Tombol">
        <div className="flex gap-2">
          {(['sharp', 'rounded', 'pill'] as const).map((style) => (
            <button
              key={style}
              onClick={() => handleThemeChange('buttonStyle', style)}
              className={`flex-1 py-2 px-3 text-xs font-semibold border rounded-lg transition-colors ${
                (theme.buttonStyle || 'rounded') === style
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-transparent border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700'
              }`}
            >
              {style === 'sharp' ? 'Sharp' : style === 'rounded' ? 'Rounded' : 'Pill'}
            </button>
          ))}
        </div>
      </Field>
    </div>
  )
}