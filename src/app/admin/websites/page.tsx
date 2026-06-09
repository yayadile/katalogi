import Link from 'next/link'
import { requireAdmin } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { WebsiteActions } from '@/components/admin/WebsiteActions'
import { Pagination } from '@/components/admin/Pagination'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Website — Admin Katalogi',
}

const PER_PAGE = 20

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}

export default async function AdminWebsitesPage(props: {
  searchParams: Promise<{ q?: string; filter?: string; page?: string }>
}) {
  await requireAdmin()
  const raw = await props.searchParams
  const q = raw.q
  const filter = raw.filter
  const currentPage = Math.max(1, parseInt(raw.page ?? '1'))

  const where: Record<string, unknown> = {}
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { slug: { contains: q, mode: 'insensitive' } },
      { user: { name: { contains: q, mode: 'insensitive' } } },
    ]
  }
  if (filter === 'published') where.isPublished = true
  if (filter === 'draft') where.isPublished = false

  const [websites, total] = await Promise.all([
    prisma.website.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * PER_PAGE,
      take: PER_PAGE,
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { pages: true, blocks: true } },
      },
    }),
    prisma.website.count({ where }),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)
  const searchParams: Record<string, string> = {}
  if (q) searchParams.q = q
  if (filter) searchParams.filter = filter

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-2xl font-black text-gray-950 tracking-tight">Website</h1>
        <p className="text-gray-500 mt-1 font-medium text-sm">{total} total website</p>
      </div>

      <form className="flex items-center gap-3 flex-wrap">
        <input
          name="q"
          defaultValue={q ?? ''}
          placeholder="Cari judul, slug, atau pemilik..."
          className="flex-1 min-w-[200px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
        />
        <select
          name="filter"
          defaultValue={filter ?? ''}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
        >
          <option value="">Semua Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all text-sm"
        >
          Cari
        </button>
        {(q || filter) && (
          <Link
            href="/admin/websites"
            className="px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
          >
            Reset
          </Link>
        )}
      </form>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 font-black text-gray-500 uppercase tracking-wider text-[11px]">Website</th>
                <th className="text-left px-5 py-3.5 font-black text-gray-500 uppercase tracking-wider text-[11px]">Pemilik</th>
                <th className="text-left px-5 py-3.5 font-black text-gray-500 uppercase tracking-wider text-[11px]">Status</th>
                <th className="text-center px-5 py-3.5 font-black text-gray-500 uppercase tracking-wider text-[11px]">Dilihat</th>
                <th className="text-center px-5 py-3.5 font-black text-gray-500 uppercase tracking-wider text-[11px]">Halaman</th>
                <th className="text-left px-5 py-3.5 font-black text-gray-500 uppercase tracking-wider text-[11px]">Dibuat</th>
                <th className="text-right px-5 py-3.5 font-black text-gray-500 uppercase tracking-wider text-[11px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {websites.map((website) => (
                <tr key={website.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-gray-900 text-sm">{website.title}</p>
                    <p className="text-gray-500 text-xs font-mono mt-0.5">/{website.slug}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-700 text-sm">{website.user.name ?? 'Tanpa Nama'}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-bold px-2.5 py-1.5 rounded-lg ${
                      website.isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {website.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center font-bold text-gray-900 text-sm">{website.pageViews}</td>
                  <td className="px-5 py-3.5 text-center font-bold text-gray-900 text-sm">{website._count.pages}</td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">{formatDate(website.createdAt)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <WebsiteActions website={website} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {websites.length === 0 && (
          <p className="text-center py-12 text-gray-400 font-medium">Tidak ada website ditemukan.</p>
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/admin/websites" searchParams={searchParams} />
      </div>
    </div>
  )
}
