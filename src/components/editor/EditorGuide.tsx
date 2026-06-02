'use client'

import React, { useState } from 'react'
import { X, HelpCircle, MousePointer2, Plus, Layout, Settings, CheckCircle } from 'lucide-react'

export default function EditorGuide() {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-purple-800 hover:text-purple-900 hover:bg-purple-100 transition-all text-xs font-medium border border-purple-400"
      >
        <HelpCircle className="w-3.5 h-3.5" />
        Bantuan
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white border border-gray-200 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-800 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            Panduan Katalogi
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 pt-0 space-y-6">
          <GuideStep 
            icon={<MousePointer2 className="w-4 h-4" />}
            title="Pilih & Edit"
            desc="Klik elemen apa saja di canvas untuk mulai kustomisasi kontennya."
          />
          <GuideStep 
            icon={<Plus className="w-4 h-4" />}
            title="Tambah Block"
            desc="Gunakan panel kiri untuk menambah Hero, Katalog, atau Kontak baru."
          />
          <GuideStep 
            icon={<Layout className="w-4 h-4" />}
            title="Atur Urutan"
            desc="Drag & drop di panel sebelah kiri untuk mengatur urutan tampilan."
          />
          <GuideStep 
            icon={<Settings className="w-4 h-4" />}
            title="Ubah Tema"
            desc="Klik tab 'Tema' di panel kanan untuk ganti warna & font global."
          />
          <GuideStep 
            icon={<Plus className="w-4 h-4 text-pink-500" />}
            title="Upload Foto"
            desc="Kini Anda bisa upload foto produk atau background langsung dari PC!"
          />
          <GuideStep 
            icon={<CheckCircle className="w-4 h-4 text-green-500" />}
            title="Publish"
            desc="Sudah oke? Klik tombol 'Publish' di atas untuk tayangkan website Anda!"
          />

          <button 
            onClick={() => setIsOpen(false)}
            className="w-full bg-purple-800 hover:bg-purple-900 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-700/20 active:scale-95 mt-4"
          >
            Mengerti, Lanjutkan!
          </button>
        </div>
      </div>
    </div>
  )
}

function GuideStep({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-0.5">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
