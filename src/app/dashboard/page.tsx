import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import NewWebsiteForm from '@/components/dashboard/NewWebsiteForm'
import type { Metadata } from 'next'
import { Plus, Globe, Sparkles, Clock, Layout, ExternalLink, ChevronRight } from 'lucide-react'

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
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header with Glassmorphism */}
      <div className="relative p-8 rounded-[2.5rem] bg-indigo-600/10 border border-indigo-500/20 overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Selamat datang, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{session.name ?? 'Pengguna'}</span>
          </h1>
          <p className="text-slate-400 mt-2 max-w-xl leading-relaxed">
            Waktunya buat jualan Anda makin profesional. Pilih website yang ingin Anda edit atau buat yang baru di bawah ini.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Website List (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layout className="w-5 h-5 text-indigo-400" />
              Website Anda
              <span className="ml-2 text-xs font-normal text-slate-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                {websites.length} Proyek
              </span>
            </h2>
          </div>

          {websites.length === 0 ? (
            <div className="bg-slate-900 border border-dashed border-white/10 rounded-[2rem] p-16 text-center group">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-10 h-10 text-indigo-400 opacity-40 shadow-2xl shadow-indigo-500/20" />
              </div>
              <p className="text-slate-400 text-lg mb-6">Belum ada website yang dibuat.</p>
              <p className="text-slate-600 text-sm max-w-xs mx-auto">Gunakan formulir di samping untuk membuat website pertama Anda dalam hitungan detik!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {websites.map((website) => (
                <div
                  key={website.id}
                  className="group relative bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 rounded-[2rem] p-6 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-indigo-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-slate-500 px-2 py-0.5 bg-white/5 rounded-lg">/{website.slug}</span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        website.isPublished
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-slate-800 text-slate-500 border border-white/5'
                      }`}
                    >
                      {website.isPublished ? '● Online' : 'Draft'}
                    </span>
                  </div>

                  <h3 className="text-white font-bold text-lg mb-2 truncate group-hover:text-indigo-300 transition-colors">{website.title}</h3>
                  {website.description && (
                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">{website.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-slate-600 text-[11px] font-medium mb-6">
                    <div className="flex items-center gap-1">
                      <Layout className="w-3.5 h-3.5" />
                      {website._count.blocks} Block
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(website.createdAt)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/websites/${website.id}/edit`}
                      className="flex-1 text-center text-xs font-bold py-3 px-4 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all active:scale-95"
                    >
                      Edit Projek
                    </Link>
                    {website.isPublished && (
                      <a
                        href={`/${website.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-95"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Creator (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-1 px-4 py-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
            <Plus className="w-4 h-4" /> Buat Website Baru
          </div>
          <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <NewWebsiteForm userId={session.userId} />
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20">
            <Sparkles className="absolute top-4 right-4 w-12 h-12 opacity-20 rotate-12" />
            <h3 className="font-bold text-lg mb-2">Butuh Inspirasi?</h3>
            <p className="text-white/70 text-sm mb-6 leading-relaxed">Lihat bagaimana pengguna lain membangun katalog mereka dengan Katalogi.</p>
            <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3 rounded-xl transition-all text-xs">
              Lihat Showcase
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
