import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Plus, Globe, Layout, ExternalLink } from 'lucide-react'
import { ScrollReveal } from '@/components/dashboard/ScrollReveal'

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

  // Hitung metrik quick stats
  const totalProjects = websites.length;
  const totalViews = websites.reduce((acc, curr) => acc + curr.pageViews, 0);
  const activeProjects = websites.filter(w => w.isPublished).length;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
      
      {/* Background Glow Effect */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-purple-600/4 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-purple-800/4 rounded-full blur-[150px] -z-10 pointer-events-none" />
      {/* Header / Hero Section */}
      <ScrollReveal>
      <div className="pt-16 pb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-10 border-b border-gray-200/50">
        <div className="space-y-6 flex-1">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-linear-to-br from-gray-900 via-gray-800 to-purple-900 tracking-tighter uppercase leading-[1.1]">
            Selamat datang,<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-800 to-purple-500 relative inline-block pb-2">
              {session.name ?? 'Pengguna'}
            </span>
          </h1>
          <p className="text-gray-500 max-w-xl text-lg sm:text-xl font-medium leading-relaxed">
            Waktunya buat jualan Anda makin profesional. Kelola proyek Anda dengan mudah di bawah ini.
          </p>
        </div>

        {/* Quick Stats & CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 xl:justify-end">
          <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md border border-gray-200/50 p-4 rounded-3xl shadow-lg shadow-purple-800/5">
             <div className="flex flex-col px-4 border-r border-gray-200/50">
               <span className="text-2xl font-black text-gray-900">{totalProjects}</span>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Proyek</span>
             </div>
             <div className="flex flex-col px-4 border-r border-gray-200/50">
               <span className="text-2xl font-black text-gray-900">{totalViews}</span>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Views</span>
             </div>
             <div className="flex flex-col px-4">
               <span className="text-2xl font-black text-purple-800">{activeProjects}</span>
               <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Live</span>
             </div>
          </div>
          
          <Link
            href="/dashboard/create"
            className="shrink-0 inline-flex items-center justify-center gap-2 px-8 py-5 bg-purple-800 hover:bg-purple-900 text-white rounded-3xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-purple-800/25 group"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            Buat Baru
          </Link>
        </div>
      </div>
      </ScrollReveal>

      {/* Main Grid */}
      <div className="space-y-10">
        <ScrollReveal delay={100} className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
            <span className="w-8 h-8 bg-purple-200 text-purple-800 rounded-lg flex items-center justify-center">
              <Layout className="w-5 h-5" />
            </span>
            Proyek Katalog
          </h2>
          <div className="flex items-center gap-2">
             <span className="hidden sm:inline text-xs font-bold text-gray-400 uppercase tracking-widest">Total:</span>
             <span className="text-sm font-black text-purple-800 bg-purple-100 border border-purple-200 px-4 py-1.5 rounded-full shadow-sm">
               {websites.length} Proyek
             </span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {/* Create New Website CTA Card */}
          <ScrollReveal delay={150} className="h-full">
          <Link
            href="/dashboard/create"
            className="group relative bg-gray-50 border-2 border-dashed border-gray-200 hover:border-purple-600 hover:bg-purple-100/30 rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-800/5 flex flex-col items-center justify-center h-full min-h-[340px] text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-purple-700/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-20 h-20 bg-white border border-gray-100 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-sm relative z-10">
              <Plus className="w-10 h-10 text-purple-800" />
            </div>
            <h3 className="text-gray-900 font-black text-2xl mb-3 tracking-tight relative z-10">Mulai Proyek Baru</h3>
            <p className="text-gray-500 text-sm font-medium px-4 leading-relaxed relative z-10">Pilih template terbaik dan mulai jualan hari ini.</p>
          </Link>
          </ScrollReveal>

          {/* Existing Websites */}
          {websites.map((website, index) => (
            <ScrollReveal key={website.id} delay={200 + (index * 50)} className="h-full">
            <div
              className="group relative bg-white/40 backdrop-blur-xl border border-gray-200/60 hover:border-purple-500/50 rounded-[2.5rem] p-8 flex flex-col min-h-[340px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-800/15 hover:bg-white/80 focus-within:ring-2 focus-within:ring-purple-700 focus-within:ring-offset-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-purple-800/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl">
                  <Globe className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-bold font-mono text-gray-600 truncate max-w-[120px]">
                    /{website.slug}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1.5 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shrink-0 transition-colors shadow-sm ${
                    website.isPublished
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${website.isPublished ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                  {website.isPublished ? 'Live' : 'Draft'}
                </div>
              </div>

              <div className="relative z-10 flex-1">
                <h3 className="text-gray-900 font-black text-2xl mb-3 truncate group-hover:text-purple-800 transition-colors tracking-tight">
                  {website.title}
                </h3>
                
                {website.description ? (
                  <p className="text-gray-500 text-sm line-clamp-2 font-medium leading-relaxed">
                    {website.description}
                  </p>
                ) : (
                  <p className="text-gray-400 text-xs italic font-medium">Tidak ada deskripsi proyek.</p>
                )}
              </div>

              <div className="relative z-10 grid grid-cols-3 gap-2 py-6 border-y border-gray-200/40 my-6">
                <div className="flex flex-col items-center gap-1" title="Kunjungan Halaman">
                  <span className="text-xs font-black text-gray-900">{website.pageViews}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Views</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-x border-gray-200/40">
                  <span className="text-xs font-black text-gray-900">{website._count.blocks}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Blok</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-black text-gray-900">{formatDate(website.createdAt).split(' ')[0]}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{formatDate(website.createdAt).split(' ')[1]}</span>
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-3">
                <Link
                  href={`/dashboard/websites/${website.id}/edit`}
                  className="flex-1 text-center text-sm font-bold py-4 px-6 bg-purple-800 text-white hover:bg-purple-900 rounded-2xl transition-all shadow-lg shadow-purple-800/10 active:scale-95"
                >
                  Edit Desain
                </Link>
                {website.isPublished && (
                  <a
                    href={`/${website.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-white/60 backdrop-blur-md border border-gray-200/50 text-gray-400 hover:text-purple-800 hover:bg-white hover:border-purple-400 rounded-2xl transition-all active:scale-95"
                    title="Lihat Live"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  )
}
