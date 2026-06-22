'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link'

const STORAGE_KEY = 'katalogi_cookie_consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== 'accepted') setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
        <div className="flex-1 text-sm text-gray-600 leading-relaxed">
          Kami menggunakan cookie untuk menjaga sesi login dan meningkatkan pengalaman Anda.
          Dengan melanjutkan, Anda menyetujui{' '}
          <Link href="/kebijakan-privasi" className="text-indigo-600 underline hover:text-indigo-800 font-semibold">Kebijakan Privasi</Link>
          {' '}dan{' '}
          <Link href="/syarat-ketentuan" className="text-indigo-600 underline hover:text-indigo-800 font-semibold">Syarat & Ketentuan</Link>.
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={accept}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all active:scale-95"
          >
            Setuju
          </button>
          <button
            onClick={accept}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
