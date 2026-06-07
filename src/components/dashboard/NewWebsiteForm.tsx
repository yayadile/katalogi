'use client'

import { useActionState, useState, useEffect } from 'react'
import { createWebsite } from '@/lib/actions/website'
import { FULL_TEMPLATES, WebsiteTemplate } from '@/lib/templates'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles, X, Check, LayoutTemplate } from 'lucide-react'

import HeroBlock from '@/components/blocks/HeroBlock'
import CatalogBlock from '@/components/blocks/CatalogBlock'
import ContactBlock from '@/components/blocks/ContactBlock'
import TextBlock from '@/components/blocks/TextBlock'

// -- Helper to render the actual blocks --
function RenderBlocks({ template }: { template: WebsiteTemplate }) {
  if (template.blocks.length === 0) {
    return (
      <div className="w-full min-h-[600px] h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400">
        <LayoutTemplate className="w-16 h-16 mb-4 opacity-50" />
        <p className="font-semibold text-lg">Kanvas Kosong</p>
        <p className="text-sm">Mulai dari nol di Editor.</p>
      </div>
    )
  }

  const theme = {
    primaryColor: template.themeConfig.primaryColor,
    secondaryColor: template.themeConfig.secondaryColor,
    backgroundColor: '#ffffff',
  }

  return (
    <div className="min-h-full flex flex-col bg-white" style={{ fontFamily: template.themeConfig.fontFamily }}>
      {template.blocks.map((block, idx) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const content = block.content as any
        switch (block.type) {
          case 'HERO': return <HeroBlock key={idx} content={content} theme={theme} />
          case 'CATALOG': return <CatalogBlock key={idx} content={content} theme={theme} />
          case 'CONTACT': return <ContactBlock key={idx} content={content} theme={theme} />
          case 'TEXT': return <TextBlock key={idx} content={content} theme={theme} />
          default: return null
        }
      })}
    </div>
  )
}

// -- Desktop Giant Preview --
function DesktopGiantPreview({ template }: { template: WebsiteTemplate }) {
  // We will use a scaling technique so the preview fits nicely in the right pane
  // Using container queries to make it responsive
  return (
    <div className="w-full h-full relative flex items-center justify-center p-8 lg:p-12" style={{ containerType: 'inline-size' }}>
      <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50 flex flex-col relative">
        {/* Browser Top Bar Mockup */}
        <div className="h-12 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2 shrink-0">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
          </div>
          <div className="ml-4 bg-white px-4 py-1.5 rounded-md text-[10px] font-bold text-slate-400 flex-1 max-w-sm flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
            katalogi.id/preview
          </div>
        </div>
        
        {/* The Actual Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <RenderBlocks template={template} />
        </div>
      </div>
    </div>
  )
}

export default function NewWebsiteForm({ userId }: { userId: string }) {
  const [selectedTemplate, setSelectedTemplate] = useState(FULL_TEMPLATES[0].id)
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false)
  const router = useRouter()

  const currentTemplate = FULL_TEMPLATES.find(t => t.id === selectedTemplate) || FULL_TEMPLATES[0]

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

  // Prevent background scrolling when bottom sheet is open
  useEffect(() => {
    if (isMobilePreviewOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobilePreviewOpen])

  return (
    <div className="flex w-full h-full bg-slate-50 relative overflow-hidden">
      
      {/* === LEFT COLUMN: FORM & SELECTION === */}
      <div className="w-full md:w-[380px] lg:w-[420px] shrink-0 border-r border-slate-200 bg-white flex flex-col h-[calc(100vh-73px)] shadow-2xl md:shadow-none z-10 relative">
        
        {/* Desktop Submit Area (Fixed at bottom) */}
        <div className="hidden md:block p-5 border-t border-slate-100 bg-slate-50 shrink-0 order-last">
          <button
            type="submit"
            form="create-website-form"
            disabled={pending}
            className="w-full bg-gradient-to-br from-indigo-500 to-indigo-900 hover:from-indigo-600 hover:to-indigo-950 text-white font-black uppercase tracking-[0.15em] px-6 py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-indigo-600/20 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 text-[11px] flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {pending ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>Mempersiapkan...</span>
              </>
            ) : (
              <>
                <span>Buat Website Sekarang</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <form action={action} id="create-website-form" className="flex flex-col min-h-full p-5 md:p-6 gap-6">
            
            {/* Header */}
            <div className="flex flex-col gap-3">
              <Link 
                href="/dashboard" 
                className="group inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors w-fit bg-slate-50 hover:bg-indigo-50 px-3 py-1.5 rounded-full border border-slate-200"
              >
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
                Kembali
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-2.5">
                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-900 p-1.5 rounded-lg shadow-md shadow-indigo-600/20 text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  Mulai Proyek
                </h1>
                <p className="text-slate-500 mt-1 text-xs font-medium leading-relaxed">
                  Konfigurasi dasar website Anda.
                </p>
              </div>
            </div>

            {state?.error && (
              <div className="flex items-center gap-3 text-red-600 text-xs bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl px-4 py-3 animate-in fade-in">
                <span className="font-semibold">{state.error}</span>
              </div>
            )}

            {/* Inputs */}
            <div className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <label htmlFor="title" className="block text-slate-800 text-[9px] font-black uppercase tracking-widest">
                  Nama Website
                </label>
                <input
                  id="title"
                  name="title"
                  required
                  placeholder="Toko Keren Saya"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-lg px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white transition-all shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="slug" className="block text-slate-800 text-[9px] font-black uppercase tracking-widest">
                  Slug URL
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-600/20 focus-within:border-indigo-600 focus-within:bg-white transition-all shadow-sm">
                  <span className="pl-3 pr-1 text-slate-400 text-[11px] font-black shrink-0">katalogi.id/</span>
                  <input
                    id="slug"
                    name="slug"
                    required
                    placeholder="toko-saya"
                    className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 pr-3 py-2.5 text-xs font-black focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="description" className="block text-slate-800 text-[9px] font-black uppercase tracking-widest">
                  Deskripsi <span className="text-slate-400 font-normal ml-1 lowercase tracking-normal">(opsional)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={2}
                  placeholder="Jelaskan sedikit tentang website..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-lg px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white transition-all shadow-sm resize-none"
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Template Selection */}
            <div className="flex flex-col gap-3 pb-6 md:pb-0">
              <div className="flex items-center justify-between">
                <label className="block text-slate-900 text-[10px] font-black uppercase tracking-[0.2em]">
                  Pilih Template
                </label>
              </div>
              
              {/* Responsive Grid/List for Templates */}
              <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                {FULL_TEMPLATES.map((tpl) => {
                  const isSelected = selectedTemplate === tpl.id
                  return (
                    <div
                      key={tpl.id}
                      className={`group relative flex flex-col md:flex-row items-center gap-3 p-2.5 md:p-3 cursor-pointer rounded-xl transition-all duration-300 border-2 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm shadow-indigo-600/10'
                          : 'border-slate-200 bg-white hover:border-indigo-500 hover:bg-slate-50'
                      }`}
                      onClick={() => {
                        setSelectedTemplate(tpl.id)
                        if (window.innerWidth < 768) {
                          setIsMobilePreviewOpen(true)
                        }
                      }}
                    >
                      <input 
                        type="radio" 
                        name="templateId" 
                        value={tpl.id} 
                        className="sr-only" 
                        checked={isSelected}
                        onChange={() => setSelectedTemplate(tpl.id)}
                      />
                      
                      {/* Mobile Thumbnail / Desktop Icon */}
                      <div className={`w-full md:w-12 md:h-12 aspect-video md:aspect-square rounded-lg flex items-center justify-center shrink-0 border ${isSelected ? 'border-indigo-400 bg-indigo-100/50' : 'border-slate-100 bg-slate-50'} overflow-hidden relative`}>
                        {tpl.id === 'blank' && <LayoutTemplate className={`w-5 h-5 md:w-6 md:h-6 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />}
                        {tpl.id === 'portfolio' && <div className="w-full h-full bg-slate-800 p-1.5 flex flex-col gap-0.5 justify-center items-center"><div className="w-1/2 h-1 bg-slate-600 rounded"></div><div className="w-3/4 h-1 bg-slate-600 rounded"></div></div>}
                        {tpl.id === 'store' && <div className="w-full h-full bg-emerald-50 p-1.5 grid grid-cols-2 gap-0.5"><div className="bg-emerald-200 rounded"></div><div className="bg-emerald-200 rounded"></div></div>}
                        
                        <div className="absolute inset-0 bg-black/40 md:hidden flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-[9px] font-bold tracking-widest uppercase">Lihat</span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 text-center md:text-left w-full">
                        <span className={`block text-[11px] font-black uppercase tracking-wider mb-0.5 transition-colors truncate ${isSelected ? 'text-indigo-700' : 'text-slate-900'}`}>
                          {tpl.name}
                        </span>
                        <span className="text-[9px] text-slate-500 font-medium leading-relaxed line-clamp-2 md:line-clamp-1">
                          {tpl.description}
                        </span>
                      </div>
                      
                      {isSelected && (
                        <div className="hidden md:flex shrink-0 w-5 h-5 bg-gradient-to-br from-indigo-500 to-indigo-900 rounded-full items-center justify-center shadow-sm">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* Mobile Submit Button */}
            <div className="pt-2 mt-auto md:hidden">
              <button
                type="submit"
                disabled={pending}
                className="w-full bg-gradient-to-br from-indigo-500 to-indigo-900 hover:from-indigo-600 hover:to-indigo-950 text-white font-black uppercase tracking-[0.15em] px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-60 text-[11px] flex items-center justify-center gap-2"
              >
                {pending ? 'Mempersiapkan...' : 'Buat Website Sekarang'}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* === RIGHT COLUMN: DESKTOP GIANT PREVIEW === */}
      <div className="hidden md:block flex-1 bg-slate-100/50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[16px_16px]">
        <DesktopGiantPreview template={currentTemplate} />
      </div>

      {/* === MOBILE BOTTOM SHEET DRAWER === */}
      <div 
        className={`md:hidden fixed inset-0 z-50 transition-all duration-500 ease-out flex flex-col justify-end ${
          isMobilePreviewOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
            isMobilePreviewOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobilePreviewOpen(false)}
        />
        
        {/* Sheet Content */}
        <div 
          className={`relative w-full h-[85vh] bg-white rounded-t-3xl shadow-2xl flex flex-col transition-transform duration-500 ease-out transform ${
            isMobilePreviewOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {/* Handle bar */}
          <div className="w-full flex justify-center py-3 shrink-0" onClick={() => setIsMobilePreviewOpen(false)}>
            <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
          </div>
          
          <div className="px-6 pb-4 flex items-center justify-between shrink-0 border-b border-slate-100">
            <div>
              <h3 className="font-black text-lg text-slate-900">{currentTemplate.name}</h3>
              <p className="text-xs text-slate-500">Preview Layout</p>
            </div>
            <button 
              onClick={() => setIsMobilePreviewOpen(false)}
              className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Preview Area inside Sheet */}
          <div className="flex-1 overflow-y-auto bg-slate-50 relative">
            {/* The actual mobile preview */}
            <RenderBlocks template={currentTemplate} />
          </div>

          {/* Sticky Bottom Action */}
          <div className="p-5 bg-white border-t border-slate-100 shrink-0 pb-safe">
            <button
              type="submit"
              form="create-website-form"
              onClick={() => setIsMobilePreviewOpen(false)} // Close sheet visually while submitting
              disabled={pending}
              className="w-full bg-gradient-to-br from-indigo-500 to-indigo-900 text-white font-black uppercase tracking-widest px-6 py-4 rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-transform text-xs"
            >
              Gunakan Template Ini
            </button>
          </div>
        </div>
      </div>

      {/* Global styles for custom scrollbar to make it look clean like Framer/Vercel */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 1.25rem);
        }
      `}} />
    </div>
  )
}
