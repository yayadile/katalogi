'use client'

import { useState, useRef, useEffect } from 'react'

type BaseSettingsProps = {
  styles: Record<string, string | number>
  htmlId?: string
  onChange: (updatedStyles: Record<string, string | number>, htmlId?: string) => void
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
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return { h: 0, s: 0, v: 100 };
  }

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const v = max;

  const d = max - min;
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

  const [prevValue, setPrevValue] = useState(value)
  if (value !== prevValue) {
    setPrevValue(value)
    const { h, s, v } = hexToHsv(value || '#ffffff')
    setHue(h)
    setSaturation(s)
    setBrightness(v)
  }

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

      <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">{label}</label>
      
      <div className="flex gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{ backgroundColor: value || '#ffffff' }}
          className="w-10 h-10 rounded-lg border border-slate-200 shadow-sm cursor-pointer shrink-0 transition-transform active:scale-95 hover:border-slate-300"
          title="Buka Pemilih Warna"
        />
        
        <input 
          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none font-bold text-slate-800 shadow-sm" 
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
                  value.toLowerCase() === color.toLowerCase() ? 'ring-2 ring-indigo-500 ring-offset-1' : ''
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

export function UniversalSettings({ styles, htmlId, onChange }: BaseSettingsProps) {
  const updateStyle = (key: string, value: string | number) => {
    onChange({ ...styles, [key]: value }, htmlId)
  }

  const updateHtmlId = (newId: string) => {
    onChange(styles, newId)
  }

  const parseValue = (val: string | number | undefined) => {
    if (!val) return ''
    return String(val).replace('px', '')
  }

  return (
    <div className="flex flex-col gap-4">
      {/* SPACING */}
      <section className="bg-white border border-gray-200 rounded p-3">
        <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-3">Spacing</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Padding */}
          <div className="flex flex-col gap-2">
            <span className="text-[9px] text-gray-500 font-semibold uppercase">Padding (px)</span>
            <div className="grid grid-cols-2 gap-1">
              <input type="number" placeholder="Top" value={parseValue(styles.paddingTop)} onChange={(e) => updateStyle('paddingTop', e.target.value ? `${e.target.value}px` : '')} className="settings-input" title="Padding Top" />
              <input type="number" placeholder="Bottom" value={parseValue(styles.paddingBottom)} onChange={(e) => updateStyle('paddingBottom', e.target.value ? `${e.target.value}px` : '')} className="settings-input" title="Padding Bottom" />
              <input type="number" placeholder="Left" value={parseValue(styles.paddingLeft)} onChange={(e) => updateStyle('paddingLeft', e.target.value ? `${e.target.value}px` : '')} className="settings-input" title="Padding Left" />
              <input type="number" placeholder="Right" value={parseValue(styles.paddingRight)} onChange={(e) => updateStyle('paddingRight', e.target.value ? `${e.target.value}px` : '')} className="settings-input" title="Padding Right" />
            </div>
          </div>
          {/* Margin */}
          <div className="flex flex-col gap-2">
            <span className="text-[9px] text-gray-500 font-semibold uppercase">Margin (px)</span>
            <div className="grid grid-cols-2 gap-1">
              <input type="number" placeholder="Top" value={parseValue(styles.marginTop)} onChange={(e) => updateStyle('marginTop', e.target.value ? `${e.target.value}px` : '')} className="settings-input" title="Margin Top" />
              <input type="number" placeholder="Bottom" value={parseValue(styles.marginBottom)} onChange={(e) => updateStyle('marginBottom', e.target.value ? `${e.target.value}px` : '')} className="settings-input" title="Margin Bottom" />
              <input type="number" placeholder="Left" value={parseValue(styles.marginLeft)} onChange={(e) => updateStyle('marginLeft', e.target.value ? `${e.target.value}px` : '')} className="settings-input" title="Margin Left" />
              <input type="number" placeholder="Right" value={parseValue(styles.marginRight)} onChange={(e) => updateStyle('marginRight', e.target.value ? `${e.target.value}px` : '')} className="settings-input" title="Margin Right" />
            </div>
          </div>
        </div>
      </section>

      {/* BACKGROUND & BORDERS */}
      <section className="bg-white border border-gray-200 rounded p-3">
        <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-3">Background & Border</h3>
        <div className="flex flex-col gap-4">
          {/* Custom Background Color Picker */}
          <ColorPickerPopover
            label="Background Color"
            value={(styles.backgroundColor as string) || '#ffffff'}
            onChange={(color) => updateStyle('backgroundColor', color)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Border Radius (px)</label>
            <input type="number" value={parseValue(styles.borderRadius)} onChange={(e) => updateStyle('borderRadius', e.target.value ? `${e.target.value}px` : '')} className="settings-input" placeholder="0" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Border Width (px)</label>
              <input type="number" value={parseValue(styles.borderWidth)} onChange={(e) => updateStyle('borderWidth', e.target.value ? `${e.target.value}px` : '')} className="settings-input" placeholder="0" />
            </div>
            
            {/* Custom Border Color Picker */}
            <ColorPickerPopover
              label="Border Color"
              value={(styles.borderColor as string) || '#e5e7eb'}
              onChange={(color) => updateStyle('borderColor', color)}
            />
          </div>
        </div>
      </section>

       {/* ANIMATION */}
       <section className="bg-white border border-gray-200 rounded p-3">
         <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-3">Animasi</h3>
         <div className="flex flex-col gap-1.5">
           <div className="space-y-2">
             <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Jenis Animasi</label>
             <select 
               className="settings-input" 
               value={(styles.animationType as string) || 'katalogi-fade-in'}
               onChange={(e) => updateStyle('animationType', e.target.value)}
             >
               <option value="katalogi-fade-in">Fade In</option>
               <option value="katalogi-fade-in-up">Fade In Up</option>
               <option value="katalogi-fade-in-down">Fade In Down</option>
               <option value="katalogi-fade-in-left">Fade In Left</option>
               <option value="katalogi-fade-in-right">Fade In Right</option>
               <option value="katalogi-slide-up">Slide Up</option>
               <option value="katalogi-slide-down">Slide Down</option>
               <option value="katalogi-slide-left">Slide Left</option>
               <option value="katalogi-slide-right">Slide Right</option>
               <option value="katalogi-zoom-in">Zoom In</option>
               <option value="katalogi-zoom-out">Zoom Out</option>
               <option value="katalogi-bounce-in">Bounce In</option>
               <option value="katalogi-flip-x">Flip X</option>
               <option value="katalogi-flip-y">Flip Y</option>
               <option value="katalogi-rotate-in">Rotate In</option>
               <option value="katalogi-blur-in">Blur In</option>
             </select>
           </div>
           
           <div className="grid grid-cols-2 gap-3">
             <div className="flex flex-col gap-1">
               <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Durasi (detik)</label>
               <input 
                 type="number" 
                 step="0.1" 
                 min="0.1" 
                 max="5" 
                 value={(styles.animationDuration as string) || '0.5'}
                 onChange={(e) => updateStyle('animationDuration', `${e.target.value}s`)}
                 className="settings-input"
               />
             </div>
             <div className="flex flex-col gap-1">
               <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Delay (detik)</label>
               <input 
                 type="number" 
                 step="0.1" 
                 min="0" 
                 max="2" 
                 value={(styles.animationDelay as string) || '0'}
                 onChange={(e) => updateStyle('animationDelay', `${e.target.value}s`)}
                 className="settings-input"
               />
             </div>
           </div>
           
           <div className="grid grid-cols-2 gap-3">
             <div className="flex flex-col gap-1">
               <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Iterasi</label>
               <input 
                 type="number" 
                 min="1" 
                 max="10" 
                 value={(styles.animationIterationCount as string) || '1'}
                 onChange={(e) => updateStyle('animationIterationCount', e.target.value)}
                 className="settings-input"
               />
             </div>
             <div className="flex flex-col gap-1">
               <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Direction</label>
               <select 
                 className="settings-input" 
                 value={(styles.animationDirection as string) || 'normal'}
                 onChange={(e) => updateStyle('animationDirection', e.target.value)}
               >
                 <option value="normal">Normal</option>
                 <option value="reverse">Reverse</option>
                 <option value="alternate">Alternate</option>
                 <option value="alternate-reverse">Alternate Reverse</option>
               </select>
             </div>
           </div>
           
           <div className="flex flex-col gap-1">
             <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Fill Mode</label>
             <select 
               className="settings-input" 
               value={(styles.animationFillMode as string) || 'both'}
               onChange={(e) => updateStyle('animationFillMode', e.target.value)}
             >
               <option value="none">None</option>
               <option value="forwards">Forwards</option>
               <option value="backwards">Backwards</option>
               <option value="both">Both</option>
             </select>
           </div>
         </div>
       </section>
       
    </div>
  )
}
