'use client'

import React, { useEffect, useRef } from 'react'

export default function ScrollRevealWrapper({ 
  children, 
  id,
  className = '' 
}: { 
  children: React.ReactNode, 
  id?: string,
  className?: string 
}) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const items = el.querySelectorAll('.reveal-item')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('revealed', entry.isIntersecting)
        })
      },
      { threshold: 0.15 }
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <section id={id} ref={sectionRef} className={className}>
      {children}
    </section>
  )
}
