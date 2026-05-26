'use client'

import type { AnimationPreset, HoverEffect, BlockAnimation } from '@/types/animation'

const ANIMATION_PRESETS: { label: string; value: AnimationPreset }[] = [
  { label: 'None', value: 'none' },
  { label: 'Fade In', value: 'fade-in' },
  { label: 'Fade In Up', value: 'fade-in-up' },
  { label: 'Fade In Down', value: 'fade-in-down' },
  { label: 'Fade In Left', value: 'fade-in-left' },
  { label: 'Fade In Right', value: 'fade-in-right' },
  { label: 'Slide Up', value: 'slide-up' },
  { label: 'Slide Down', value: 'slide-down' },
  { label: 'Slide Left', value: 'slide-left' },
  { label: 'Slide Right', value: 'slide-right' },
  { label: 'Zoom In', value: 'zoom-in' },
  { label: 'Zoom Out', value: 'zoom-out' },
  { label: 'Bounce In', value: 'bounce-in' },
  { label: 'Flip X', value: 'flip-x' },
  { label: 'Flip Y', value: 'flip-y' },
  { label: 'Rotate In', value: 'rotate-in' },
  { label: 'Blur In', value: 'blur-in' },
]

const HOVER_EFFECTS: { label: string; value: HoverEffect }[] = [
  { label: 'None', value: 'none' },
  { label: 'Scale Up', value: 'scale-up' },
  { label: 'Scale Down', value: 'scale-down' },
  { label: 'Lift', value: 'lift' },
  { label: 'Glow', value: 'glow' },
  { label: 'Brightness', value: 'brightness' },
  { label: 'Tilt', value: 'tilt' },
]

const EASING_OPTIONS: { label: string; value: string }[] = [
  { label: 'Ease', value: 'ease' },
  { label: 'Linear', value: 'linear' },
  { label: 'Ease In', value: 'ease-in' },
  { label: 'Ease Out', value: 'ease-out' },
  { label: 'Ease In Out', value: 'ease-in-out' },
]

type AnimationSettingsProps = {
  animation: BlockAnimation
  onChange: (animation: BlockAnimation) => void
}

export function AnimationSettings({ animation, onChange }: AnimationSettingsProps) {
  const update = (partial: Partial<BlockAnimation>) => {
    onChange({ ...animation, ...partial })
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
          Entrance Animation
        </p>
        <select
          value={animation.preset}
          onChange={(e) => update({ preset: e.target.value as AnimationPreset })}
          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none font-medium text-slate-800 bg-white"
        >
          {ANIMATION_PRESETS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      {animation.preset !== 'none' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Duration (ms)
              </p>
              <input
                type="number"
                min={100}
                max={5000}
                step={100}
                value={animation.duration}
                onChange={(e) => update({ duration: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none font-medium text-slate-800 bg-white"
              />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Delay (ms)
              </p>
              <input
                type="number"
                min={0}
                max={5000}
                step={100}
                value={animation.delay}
                onChange={(e) => update({ delay: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none font-medium text-slate-800 bg-white"
              />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Easing
            </p>
            <select
              value={animation.easing}
              onChange={(e) => update({ easing: e.target.value as BlockAnimation['easing'] })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none font-medium text-slate-800 bg-white"
            >
              {EASING_OPTIONS.map((e) => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={animation.triggerOnce}
              onChange={(e) => update({ triggerOnce: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-[11px] font-semibold text-slate-600">
              Animation hanya sekali (triggerOnce)
            </span>
          </label>
        </>
      )}

      <div className="border-t border-gray-200 pt-4">
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
          Hover Effect
        </p>
        <select
          value={animation.hover}
          onChange={(e) => update({ hover: e.target.value as HoverEffect })}
          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none font-medium text-slate-800 bg-white"
        >
          {HOVER_EFFECTS.map((h) => (
            <option key={h.value} value={h.value}>{h.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
