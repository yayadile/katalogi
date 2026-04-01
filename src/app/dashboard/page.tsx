import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import NewWebsiteForm from '@/components/dashboard/NewWebsiteForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — Katalogi',
  description: 'Kelola semua website toko Anda di Katalogi.',
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}

export default async function DashboardPage() {
  const session = await requireAuth()

  const websites = await prisma.website.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { blocks: true } } },
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Selamat datang, {session.name ?? 'Pengguna'}
        </h1>
        <p className="text-slate-400 mt-1">Kelola dan publish website toko Anda.</p>
      </div>

      {/* Create New Website */}
      <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
        <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Buat Website Baru
        </h2>
        <NewWebsiteForm userId={session.userId} />
      </div>

      {/* Website List */}
      <div>
        <h2 className="text-white font-semibold text-lg mb-4">
          Website Anda
          <span className="ml-2 text-sm font-normal text-slate-400">({websites.length})</span>
        </h2>

        {websites.length === 0 ? (
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-400 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-400">Anda belum membuat website. Mulai dari atas!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {websites.map((website) => (
              <div
                key={website.id}
                className="group bg-slate-900 border border-white/5 hover:border-white/15 rounded-2xl p-5 transition-all hover:shadow-xl hover:shadow-black/30"
              >
                {/* Status badge + slug */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 font-mono">/{website.slug}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      website.isPublished
                        ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                        : 'bg-slate-700/50 text-slate-500 border border-white/5'
                    }`}
                  >
                    {website.isPublished ? '● Live' : 'Draft'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-white font-semibold text-base mb-1 truncate">{website.title}</h3>
                {website.description && (
                  <p className="text-slate-500 text-sm mb-3 line-clamp-2">{website.description}</p>
                )}

                {/* Stats */}
                <p className="text-slate-600 text-xs mb-4">
                  {website._count.blocks} block · Dibuat {formatDate(website.createdAt)}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/websites/${website.id}/edit`}
                    className="flex-1 text-center text-xs font-semibold py-2 px-3 bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25 rounded-xl transition-colors"
                  >
                    Edit
                  </Link>
                  {website.isPublished && (
                    <a
                      href={`/${website.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold py-2 px-3 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    >
                      Lihat
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
