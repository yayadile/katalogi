'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MoreVertical, ExternalLink, EyeOff, Trash2, Layout } from 'lucide-react'
import { unpublishWebsite, deleteWebsite } from '@/lib/actions/admin'

type Website = {
  id: string
  slug: string
  title: string
  isPublished: boolean
}

export function WebsiteActions({ website }: { website: Website }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-gray-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 min-w-[180px]">
            <Link
              href={`/dashboard/websites/${website.id}/edit`}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Layout className="w-4 h-4 text-gray-400" />
              Buka Editor
            </Link>

            {website.isPublished && (
              <a
                href={`/${website.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-gray-400" />
                Lihat Live
              </a>
            )}

            {website.isPublished && (
              <form
                action={async () => {
                  if (confirm('Unpublish website ini?')) {
                    await unpublishWebsite(website.id)
                  }
                  setOpen(false)
                }}
              >
                <button
                  type="submit"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors w-full text-left"
                >
                  <EyeOff className="w-4 h-4" />
                  Unpublish
                </button>
              </form>
            )}

            <form
              action={async () => {
                if (confirm(`Hapus website "${website.title}"? Tindakan ini permanen.`)) {
                  await deleteWebsite(website.id)
                }
                setOpen(false)
              }}
            >
              <button
                type="submit"
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left border-t border-gray-100 mt-1 pt-2"
              >
                <Trash2 className="w-4 h-4" />
                Hapus Website
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
