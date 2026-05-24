'use client'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

type SaveStatusIndicatorProps = {
  status: SaveStatus
}

export default function SaveStatusIndicator({ status }: SaveStatusIndicatorProps) {
  if (status === 'idle') return null

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs rounded-full px-2.5 py-1 transition-all duration-300 ${
        status === 'saving'
          ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
          : status === 'saved'
            ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
            : 'bg-red-400/10 text-red-400 border border-red-400/20'
      }`}
    >
      {status === 'saving' && (
        <>
          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
          Menyimpan...
        </>
      )}
      {status === 'saved' && (
        <>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Tersimpan
        </>
      )}
      {status === 'error' && (
        <>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Gagal menyimpan
        </>
      )}
    </span>
  )
}