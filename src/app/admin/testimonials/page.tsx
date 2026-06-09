import { requireAdmin } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { TestimonialForm } from '@/components/admin/TestimonialForm'
import { TestimonialItem } from '@/components/admin/TestimonialItem'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Testimoni — Admin Katalogi',
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}

export default async function AdminTestimonialsPage() {
  await requireAdmin()

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="pt-16 pb-6 border-b border-gray-200/50">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-950 tracking-tighter uppercase">Testimoni</h1>
        <p className="text-gray-500 mt-2 font-medium">{testimonials.length} testimoni</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sticky top-28">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Tambah Baru</h2>
            <TestimonialForm />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white border border-gray-200 rounded-3xl p-6">
              <TestimonialItem testimonial={t} />
            </div>
          ))}
          {testimonials.length === 0 && (
            <p className="text-center py-12 text-gray-400 font-medium">Belum ada testimonial.</p>
          )}
        </div>
      </div>
    </div>
  )
}
