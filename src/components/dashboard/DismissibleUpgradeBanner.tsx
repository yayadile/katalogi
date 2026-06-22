'use client'

import { useState, useEffect } from 'react'
import { Crown, X } from 'lucide-react'

const STORAGE_KEY = 'katalogi_dismiss_upgrade_banner'

const WA_BUSINESS_URL = 'https://wa.me/6281931920409'

export default function DismissibleUpgradeBanner() {
  const [dismissed, setDismissed] = useState<boolean | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    setDismissed(stored === 'true')
  }, [])

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setDismissed(true)
  }

  if (dismissed === null) return null // SSR / first render: don't flash
  if (dismissed) return null

  return (
    <div className="bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-4xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(251,191,36,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(249,115,22,0.05) 0%, transparent 50%)`,
      }} />

      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-full text-amber-400 hover:text-amber-600 hover:bg-amber-100/50 transition-colors z-10"
        aria-label="Tutup"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 relative">
        <Crown className="w-6 h-6" />
      </div>

      <div className="flex-1 relative">
        <h3 className="font-black text-amber-900 text-lg">Paket Gratis</h3>
        <p className="text-amber-700 text-sm mt-1 leading-relaxed">
          Kamu bisa membuat website dan publish <strong>1 website</strong> secara gratis.
          Beli paket langganan untuk publish tanpa batas dan akses template premium.
        </p>
      </div>

      <a
        href={WA_BUSINESS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-linear-to-br from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/20 whitespace-nowrap relative"
      >
        <Crown className="w-4 h-4" />
        Beli Paket
      </a>
    </div>
  )
}
