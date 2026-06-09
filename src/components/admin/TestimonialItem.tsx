'use client'

import { toggleTestimonial, deleteTestimonial, updateTestimonial } from '@/lib/actions/admin'
import { useState } from 'react'
import { Star, ToggleLeft, ToggleRight, Trash2, Edit3, Check, X } from 'lucide-react'

type Testimonial = {
  id: string
  name: string
  role: string
  content: string
  rating: number
  isActive: boolean
  createdAt: Date
}

export function TestimonialItem({ testimonial: t }: { testimonial: Testimonial }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(t.name)
  const [role, setRole] = useState(t.role)
  const [content, setContent] = useState(t.content)
  const [rating, setRating] = useState(t.rating)

  const handleUpdate = async () => {
    const fd = new FormData()
    fd.set('id', t.id)
    fd.set('name', name)
    fd.set('role', role)
    fd.set('content', content)
    fd.set('rating', String(rating))
    await updateTestimonial(fd)
    setEditing(false)
  }

  return (
    <div>
      {editing ? (
        <div className="space-y-3">
          <input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium" placeholder="Nama" />
          <input value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium" placeholder="Role" />
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={3} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium resize-none" />
          <select value={rating} onChange={e => setRating(Number(e.target.value))} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium">
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={handleUpdate} className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition-all flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Simpan</button>
            <button onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl text-xs hover:bg-gray-200 transition-all flex items-center gap-1"><X className="w-3.5 h-3.5" /> Batal</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black text-sm">
                {t.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900">{t.name}</p>
                {t.role && <p className="text-xs text-gray-500 font-medium">{t.role}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                ))}
              </div>
            </div>
          </div>
          <p className="text-gray-600 mt-4 text-sm leading-relaxed">&ldquo;{t.content}&rdquo;</p>
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => toggleTestimonial(t.id)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                t.isActive ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {t.isActive ? <><ToggleRight className="w-3.5 h-3.5" /> Aktif</> : <><ToggleLeft className="w-3.5 h-3.5" /> Nonaktif</>}
            </button>
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
            <button
              onClick={async () => {
                if (confirm('Hapus testimonial ini?')) await deleteTestimonial(t.id)
              }}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-red-600 hover:bg-red-50 transition-colors ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" /> Hapus
            </button>
          </div>
        </>
      )}
    </div>
  )
}
