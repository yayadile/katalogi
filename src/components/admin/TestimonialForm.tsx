'use client'

import { createTestimonial } from '@/lib/actions/admin'

export function TestimonialForm() {
  return (
    <form action={createTestimonial} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama</label>
        <input
          name="name"
          required
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Role / Jabatan</label>
        <input
          name="role"
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Konten</label>
        <textarea
          name="content"
          required
          rows={3}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Rating (1-5)</label>
        <select
          name="rating"
          defaultValue="5"
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n} Bintang</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all text-sm"
      >
        Simpan
      </button>
    </form>
  )
}
