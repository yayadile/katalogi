import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Plus, Globe, Clock, Layout, ExternalLink, Eye } from 'lucide-react'

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
    <div className="space-y-12 animate-in fade-in duration-700 max-w-7xl mx-auto">
      {/* Header */}
      <div className="py-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-[1.1]">
            Selamat datang,<br />
            <span className="text-indigo-600 underline decoration-indigo-600/30 underline-offset-8">{session.name ?? 'Pengguna'}</span>
          </h1>
          <p className="text-gray-600 mt-6 max-w-xl text-lg font-medium leading-relaxed">
            Waktunya buat jualan Anda makin profesional. Pilih website yang ingin Anda edit atau buat yang baru di bawah ini.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-gray-300 pb-4">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <Layout className="w-6 h-6 text-indigo-600" />
            Website Anda
          </h2>
          <span className="text-sm font-bold text-gray-600 bg-gray-100 border border-gray-300 px-3 py-1 rounded-full">
            {websites.length} Proyek
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Website CTA Card */}
          <Link
            href="/dashboard/create"
            className="group relative bg-indigo-50 border-2 border-dashed border-indigo-300 hover:border-indigo-600 hover:bg-indigo-100 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center min-h-[300px] text-center"
          >
            <div className="w-16 h-16 bg-white border border-indigo-200 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <Plus className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-indigo-900 font-black text-xl mb-2 tracking-tight">Buat Website Baru</h3>
            <p className="text-indigo-700/70 text-sm font-medium px-4">Pilih template dan mulai bangun kehadiran digital Anda.</p>
          </Link>

          {/* Existing Websites */}
          {websites.map((website) => (
            <div
              key={website.id}
              className="group relative bg-white border border-gray-300 hover:border-indigo-600 rounded-2xl p-6 flex flex-col min-h-[300px] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm font-bold font-mono text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200 truncate max-w-[150px]">
                  /{website.slug}
                </span>
                <span
                  className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shrink-0 ${
                    website.isPublished
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-gray-50 text-gray-500 border border-gray-200'
                  }`}
                >
                  {website.isPublished ? '● Online' : 'Draft'}
                </span>
              </div>

              <h3 className="text-gray-900 font-black text-xl mb-3 truncate group-hover:text-indigo-600 transition-colors tracking-tight">
                {website.title}
              </h3>
              
              {website.description && (
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 font-medium leading-relaxed flex-1">
                  {website.description}
                </p>
              )}
              {!website.description && <div className="flex-1" />}

              <div className="flex items-center gap-4 text-gray-500 text-xs font-bold mb-6 border-t border-gray-100 pt-5 mt-auto">
                <div className="flex items-center gap-1.5" title="Kunjungan Halaman">
                  <Eye className="w-4 h-4 text-gray-400" />
                  {website.pageViews}
                </div>
                <div className="flex items-center gap-1.5">
                  <Layout className="w-4 h-4 text-gray-400" />
                  {website._count.blocks}
                </div>
                <div className="flex items-center gap-1.5 ml-auto">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {formatDate(website.createdAt)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/dashboard/websites/${website.id}/edit`}
                  className="flex-1 text-center text-sm font-bold py-3 px-4 bg-white border border-gray-300 text-gray-900 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white rounded-xl transition-colors"
                >
                  Edit Projek
                </Link>
                {website.isPublished && (
                  <a
                    href={`/${website.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white border border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-400 rounded-xl transition-colors shrink-0"
                    title="Lihat Website"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
