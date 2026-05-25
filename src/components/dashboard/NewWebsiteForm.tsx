'use client'

import { useActionState, useState } from 'react'
import { createWebsite } from '@/lib/actions/website'
import { FULL_TEMPLATES } from '@/lib/templates'
import { useRouter } from 'next/navigation'

export default function NewWebsiteForm({ userId }: { userId: string }) {
  const [selectedTemplate, setSelectedTemplate] = useState(FULL_TEMPLATES[0].id)
  const router = useRouter()

  const createWithUser = async (
    _state: { error?: string } | undefined,
    formData: FormData
  ) => {
    const result = await createWebsite(userId, {
      slug: formData.get('slug') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      templateId: formData.get('templateId') as string,
    })
    if (!result.success) return { error: result.error }
    
    if (result.data) {
      router.push(`/dashboard/websites/${result.data.id}/edit`)
    }
    return undefined
  }

  const [state, action, pending] = useActionState(createWithUser, undefined)

  return (
    <form action={action} className="space-y-8">
      {state?.error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {state.error}
        </p>
      )}

      {/* Template Selection */}
      <div>
        <label className="block text-gray-900 text-sm font-black uppercase tracking-widest mb-4">
          Pilih Template Dasar
        </label>
        <div className="grid sm:grid-cols-3 gap-4">
          {FULL_TEMPLATES.map((tpl) => (
            <label
              key={tpl.id}
              className={`relative flex flex-col p-4 cursor-pointer border-2 rounded-xl transition-all ${
                selectedTemplate === tpl.id
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
              onClick={() => setSelectedTemplate(tpl.id)}
            >
              <input type="radio" name="templateId" value={tpl.id} className="sr-only" defaultChecked={selectedTemplate === tpl.id} />
              <span className="text-sm font-black text-gray-900 uppercase tracking-tight mb-1">{tpl.name}</span>
              <span className="text-xs text-gray-500 font-medium leading-relaxed">{tpl.description}</span>
              
              {selectedTemplate === tpl.id && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-indigo-600 rounded-full" />
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="title" className="block text-gray-700 text-sm font-medium mb-1.5">
            Nama Website
          </label>
          <input
            id="title"
            name="title"
            required
            placeholder="Toko Keren Saya"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
          />
        </div>
        <div>
          <label htmlFor="slug" className="block text-gray-700 text-sm font-medium mb-1.5">
            Slug URL
          </label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-500 transition">
            <span className="pl-3 pr-1 text-gray-400 text-sm shrink-0">katalogi.id/</span>
            <input
              id="slug"
              name="slug"
              required
              placeholder="toko-saya"
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 pr-3 py-3 text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-1.5">
          Deskripsi <span className="text-gray-400 font-normal">(opsional)</span>
        </label>
        <input
          id="description"
          name="description"
          placeholder="Deskripsi singkat website..."
          className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-60 text-sm"
      >
        {pending ? 'Membuat...' : 'Buat Website'}
      </button>
    </form>
  )
}
