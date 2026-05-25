import { requireAuth } from '@/lib/session'
import NewWebsiteForm from '@/components/dashboard/NewWebsiteForm'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Layout } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Buat Website Baru — Katalogi',
  description: 'Mulai bangun website baru Anda di Katalogi.',
}

export default async function CreateWebsitePage() {
  const session = await requireAuth()

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter uppercase flex items-center gap-3">
            <Layout className="w-8 h-8 text-indigo-600" />
            Mulai Proyek Baru
          </h1>
          <p className="text-gray-600 mt-2 text-lg font-medium leading-relaxed">
            Pilih template dasar dan berikan nama untuk website baru Anda.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-gray-300 rounded-2xl p-8 sm:p-12 shadow-sm">
        <NewWebsiteForm userId={session.userId} />
      </div>
    </div>
  )
}
