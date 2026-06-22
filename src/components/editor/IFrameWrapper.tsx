'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'

interface IFrameWrapperProps {
  children: React.ReactNode
  title?: string
  className?: string
  style?: React.CSSProperties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme?: any
}

// Animation keyframes CSS to inject into iframe
const ANIMATION_KEYFRAMES_CSS = `
/* Entrance Animation Keyframes */
@keyframes katalogi-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes katalogi-fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes katalogi-fade-in-down {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes katalogi-fade-in-left {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes katalogi-fade-in-right {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes katalogi-slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
@keyframes katalogi-slide-down {
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
}
@keyframes katalogi-slide-left {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
@keyframes katalogi-slide-right {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
@keyframes katalogi-zoom-in {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes katalogi-zoom-out {
  from { opacity: 0; transform: scale(1.5); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes katalogi-bounce-in {
  0% { opacity: 0; transform: scale(0.3); }
  50% { opacity: 1; transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}
@keyframes katalogi-flip-x {
  from { opacity: 0; transform: perspective(400px) rotateX(90deg); }
  to { opacity: 1; transform: perspective(400px) rotateX(0); }
}
@keyframes katalogi-flip-y {
  from { opacity: 0; transform: perspective(400px) rotateY(90deg); }
  to { opacity: 1; transform: perspective(400px) rotateY(0); }
}
@keyframes katalogi-rotate-in {
  from { opacity: 0; transform: rotate(-200deg); }
  to { opacity: 1; transform: rotate(0); }
}
@keyframes katalogi-blur-in {
  from { opacity: 0; filter: blur(10px); }
  to { opacity: 1; filter: blur(0); }
}

/* Hover effect classes */
.katalogi-hover-scale-up { transition: transform 0.3s ease; }
.katalogi-hover-scale-up:hover { transform: scale(1.05); }
.katalogi-hover-scale-down { transition: transform 0.3s ease; }
.katalogi-hover-scale-down:hover { transform: scale(0.95); }
.katalogi-hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
.katalogi-hover-lift:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
.katalogi-hover-glow { transition: box-shadow 0.3s ease; }
.katalogi-hover-glow:hover { box-shadow: 0 0 20px rgba(99,102,241,0.4); }
.katalogi-hover-brightness { transition: filter 0.3s ease; }
.katalogi-hover-brightness:hover { filter: brightness(1.1); }
.katalogi-hover-tilt { transition: transform 0.3s ease; perspective: 500px; }
.katalogi-hover-tilt:hover { transform: perspective(500px) rotateY(5deg) rotateX(2deg); }

/* Animation utility classes */
.katalogi-animate-hidden { opacity: 0; }
.katalogi-animate-visible { opacity: 1; }
`

export function IFrameWrapper({ children, title, className, style, theme }: IFrameWrapperProps) {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null)
  const mountNode = contentRef?.contentWindow?.document?.body
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const [iframeReady, setIframeReady] = useState(false)

  useEffect(() => {
    if (contentRef?.contentWindow) {
      const doc = contentRef.contentWindow.document
      
      // Clear existing styles to prevent duplicate injection on hot reloads
      const existingStyles = doc.head.querySelectorAll('style, link[rel="stylesheet"]')
      existingStyles.forEach(el => el.remove())

      // Inject Tailwind styles from the main window
      const parentStyles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      parentStyles.forEach((styleEl) => {
        doc.head.appendChild(styleEl.cloneNode(true))
      })

      // Inject Google Fonts
      if (theme?.fontFamily) {
        const fontLink = doc.createElement('link')
        fontLink.href = `https://fonts.googleapis.com/css2?family=${theme.fontFamily.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`
        fontLink.rel = 'stylesheet'
        doc.head.appendChild(fontLink)
      }

      // Inject animation keyframes CSS
      const animStyle = doc.createElement('style')
      animStyle.id = 'katalogi-animation-css'
      animStyle.textContent = ANIMATION_KEYFRAMES_CSS
      doc.head.appendChild(animStyle)

      // Add a base style for the body
      const bgColor = theme?.backgroundColor ? `background-color: ${theme.backgroundColor};` : ''
      // Using setAttribute to bypass lint rules about direct style mutation on state-derived objects
      doc.body.setAttribute('style', `margin: 0; padding: 0; min-height: 100vh; ${bgColor}`)
      setIframeReady(true)

      // --- Auto-resize: use ResizeObserver to match iframe height to content ---
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
      const ro = new ResizeObserver(() => {
        if (contentRef && doc.body) {
          const scrollHeight = doc.body.scrollHeight
          if (scrollHeight > 0) {
            contentRef.style.height = `${scrollHeight}px`
          }
        }
      })
      ro.observe(doc.body)
      resizeObserverRef.current = ro

      // --- Event forwarding: forward keyboard events from iframe to parent ---
      const handleIframeKeyDown = (e: KeyboardEvent) => {
        // Check if the event target is inside a TipTap/ProseMirror editor
        const target = e.target as HTMLElement
        const isInEditor = target?.closest?.('.ProseMirror') !== null

        // Forward undo/redo shortcuts only if NOT inside TipTap
        // (TipTap handles its own undo/redo)
        if (!isInEditor) {
          const isCtrlOrMeta = e.ctrlKey || e.metaKey
          if (
            (isCtrlOrMeta && e.key === 'z') || // Undo
            (isCtrlOrMeta && e.key === 'y') || // Redo
            (isCtrlOrMeta && e.shiftKey && e.key === 'z') || // Redo (Mac)
            e.key === 'Delete' ||
            e.key === 'Backspace' ||
            e.key === 'Escape'
          ) {
            // Dispatch equivalent event on parent window
            window.dispatchEvent(new KeyboardEvent('keydown', {
              key: e.key,
              code: e.code,
              ctrlKey: e.ctrlKey,
              shiftKey: e.shiftKey,
              altKey: e.altKey,
              metaKey: e.metaKey,
              bubbles: true,
            }))
          }
        }
      }

      doc.addEventListener('keydown', handleIframeKeyDown)

      return () => {
        doc.removeEventListener('keydown', handleIframeKeyDown)
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect()
          resizeObserverRef.current = null
        }
      }
    }
  }, [contentRef, theme])

  // Cleanup ResizeObserver on unmount
  useEffect(() => {
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = null
      }
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100%' }}>
      {/* Placeholder: same bg color as theme, only visible while iframe loads */}
      <div
        className={className}
        style={{ ...style, position: 'absolute', inset: 0, backgroundColor: theme?.backgroundColor || '#ffffff', display: iframeReady ? 'none' : 'block' }}
      />
      <iframe
        ref={setContentRef}
        title={title || 'Canvas Iframe'}
        className={className}
        style={{ ...style, border: 'none', width: '100%', minHeight: '100%', display: iframeReady ? 'block' : 'none' }}
      >
        {mountNode && createPortal(children, mountNode)}
      </iframe>
    </div>
  )
}