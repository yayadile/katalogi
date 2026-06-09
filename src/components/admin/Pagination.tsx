import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
}: {
  currentPage: number
  totalPages: number
  basePath: string
  searchParams: Record<string, string>
}) {
  if (totalPages <= 1) return null

  function buildUrl(page: number) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(page))
    return `${basePath}?${params.toString()}`
  }

  const pages: (number | '...')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 pt-6 pb-2">
      <Link
        href={buildUrl(currentPage - 1)}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
          currentPage <= 1
            ? 'text-gray-300 pointer-events-none'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </Link>

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-xs text-gray-400">...</span>
        ) : (
          <Link
            key={page}
            href={buildUrl(page)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${
              page === currentPage
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {page}
          </Link>
        )
      )}

      <Link
        href={buildUrl(currentPage + 1)}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
          currentPage >= totalPages
            ? 'text-gray-300 pointer-events-none'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
