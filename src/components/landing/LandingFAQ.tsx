'use client'

import React, { useEffect, useRef } from 'react'
import { HelpCircle } from 'lucide-react'

const faqs = [
  {
    q: 'Apakah saya harus bisa coding?',
    a: 'Tidak perlu sama sekali. Katalogi dirancang khusus untuk pengguna tanpa latar belakang teknis. Semua dikerjakan dengan drag & drop visual—tinggal klik, pilih, dan atur.',
  },
  {
    q: 'Berapa biaya menggunakan Katalogi?',
    a: 'Gratis. Semua fitur inti bisa digunakan tanpa biaya sepeserpun. Tidak ada biaya langganan, tidak ada biaya tersembunyi.',
  },
  {
    q: 'Apakah website saya bisa diakses di HP?',
    a: 'Sangat responsif. Website yang Anda buat otomatis tampil optimal di HP, tablet, dan komputer—jadi pelanggan bisa mengakses dari perangkat mana pun.',
  },
  {
    q: 'Bagaimana cara memulai?',
    a: 'Cukup daftar gratis, buat website baru, beri judul dan link unik, lalu mulai atur blok-bloknya. Setelah selesai, klik Publikasi dan website langsung bisa diakses pelanggan.',
  },
  {
    q: 'Apakah saya bisa mengubah website setelah dipublikasi?',
    a: 'Tentu. Edit kapan saja melalui dashboard. Setiap perubahan langsung tersimpan otomatis dan website akan terupdate tanpa perlu publikasi ulang.',
  },
  {
    q: 'Apakah saya bisa mengkustomisasi lebih lanjut?',
    a: 'Tentu saja. hubungi kami untuk kustomisasi lebih lanjut melalui whatsapp atau instagram resmi kami',
  },
]

export default function LandingFAQ() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const items = el.querySelectorAll('.reveal-item')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('revealed', entry.isIntersecting)
        })
      },
      { threshold: 0.1 }
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="faq" ref={sectionRef} className="py-24 md:py-32 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <div className="reveal-item inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-bold mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            FAQ
          </div>
          <h2 className="reveal-item text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Ada pertanyaan?
          </h2>
          <p className="reveal-item delay-100 max-w-2xl mx-auto text-gray-500 text-lg">
            Hal-hal yang sering ditanyakan tentang Katalogi.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="reveal-item bg-white border border-gray-200 rounded-2xl p-6 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all duration-300"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <h3 className="font-bold text-gray-900 text-sm md:text-base mb-2 leading-snug">
                {faq.q}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
