import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { BarChart3, Globe, Eye, TrendingUp, Layers } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Analitik — Katalogi',
  description: 'Ringkasan performa katalog Anda.',
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}

export default async function AnalyticsPage() {
  const session = await requireAuth()

  const websites = await prisma.website.findMany({
    where: { userId: session.userId },
    orderBy: { pageViews: 'desc' },
    include: { _count: { select: { blocks: true } } },
  })

  const totalProjects = websites.length
  const activeProjects = websites.filter(w => w.isPublished).length
  const totalViews = websites.reduce((acc, curr) => acc + curr.pageViews, 0)
  const avgViews = totalProjects > 0 ? Math.round(totalViews / totalProjects) : 0

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10 max-w-5xl mx-auto pb-20">
      
      {/* Header & Big Numbers */}
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Analitik Global</h1>
          <p className="text-slate-500 font-medium text-sm mt-2 max-w-lg leading-relaxed">
            Pantau kinerja semua katalog Anda secara real-time. Dapatkan wawasan mendalam tentang lalu lintas pengunjung.
          </p>
        </div>

        {/* Minimalist Metrics */}
        <div className="flex flex-wrap items-baseline gap-x-12 gap-y-8">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Total Views
            </div>
            <div className="text-5xl font-black text-slate-900 tracking-tighter">{totalViews.toLocaleString('id-ID')}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Rata-rata Views
            </div>
            <div className="text-5xl font-black text-slate-900 tracking-tighter">{avgViews.toLocaleString('id-ID')}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Proyek Aktif
            </div>
            <div className="text-4xl font-extrabold text-slate-700 tracking-tight">{activeProjects}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Total Proyek
            </div>
            <div className="text-4xl font-extrabold text-slate-700 tracking-tight">{totalProjects}</div>
          </div>
        </div>
      </div>

      {/* Top Projects Section (Seamless List) */}
      <div>
        <div className="mb-6 flex items-end justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Katalog Terpopuler</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Peringkat berdasarkan total kunjungan sepanjang waktu.</p>
          </div>
        </div>
        
        {websites.length > 0 ? (
          <div className="flex flex-col">
            {websites.slice(0, 10).map((website, i) => (
              <div 
                key={website.id} 
                className="group py-5 border-b border-slate-100 last:border-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-2xl sm:rounded-none"
              >
                <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
                  <span className="text-lg font-black text-slate-300 w-6 shrink-0 text-left">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{website.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm font-medium text-slate-500">
                      <span className="truncate">/{website.slug}</span>
                      <span className="shrink-0 text-slate-300">&bull;</span>
                      <span className="shrink-0">{website._count.blocks} Blok</span>
                      <span className="shrink-0 text-slate-300">&bull;</span>
                      <span className="shrink-0">{formatDate(website.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 shrink-0 ml-10 sm:ml-0">
                  <div className="text-right">
                    <div className="text-xl font-bold text-slate-900 tracking-tight">{website.pageViews.toLocaleString('id-ID')}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Views</div>
                  </div>
                  <Link
                    href={`/dashboard/websites/${website.id}/edit`}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                  >
                    Edit &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Layers className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Belum ada proyek</h3>
            <p className="text-slate-500 font-medium text-sm max-w-sm mx-auto">Anda belum membuat katalog sama sekali. Buat proyek pertama Anda untuk mulai mengumpulkan data pengunjung.</p>
          </div>
        )}
      </div>
    </div>
  )
}
