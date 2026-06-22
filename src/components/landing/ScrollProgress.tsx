'use client'

import { useState, useEffect } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight
      const total = docHeight - winHeight
      if (total > 0) {
        setProgress(Math.min((scrollTop / total) * 100, 100))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 z-[999] h-[3px] bg-linear-to-br from-indigo-500 to-indigo-900 transition-all duration-150 ease-out"
      style={{ width: `${progress}%` }}
    />
  )
}
