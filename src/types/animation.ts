export type AnimationPreset =
  | 'none'
  | 'fade-in'
  | 'fade-in-up'
  | 'fade-in-down'
  | 'fade-in-left'
  | 'fade-in-right'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'bounce-in'
  | 'flip-x'
  | 'flip-y'
  | 'rotate-in'
  | 'blur-in'

export type HoverEffect =
  | 'none'
  | 'scale-up'
  | 'scale-down'
  | 'lift'
  | 'glow'
  | 'brightness'
  | 'tilt'

export interface BlockAnimation {
  preset: AnimationPreset
  hover: HoverEffect
  duration: number // in ms
  delay: number // in ms
  easing: 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'cubic-bezier'
  bezierValues?: string // e.g. "0.4, 0, 0.2, 1"
  triggerOnce: boolean
}

export const DEFAULT_ANIMATION: BlockAnimation = {
  preset: 'none',
  hover: 'none',
  duration: 600,
  delay: 0,
  easing: 'ease-out',
  triggerOnce: true,
}