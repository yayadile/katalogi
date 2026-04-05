'use client'

import { useEffect, useRef } from 'react'
import { trackPageView } from '@/lib/actions/analytics'

export default function PageViewTracker({ websiteId }: { websiteId: string }) {
  const tracked = useRef(false)

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true
      
      const sessionKey = `viewed_${websiteId}`
      if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, 'true')
        trackPageView(websiteId).catch(() => {})
      }
    }
  }, [websiteId])

  return null
}
