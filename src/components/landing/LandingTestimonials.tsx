import React from 'react'
import { Star, Quote } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import ScrollRevealWrapper from './ScrollRevealWrapper'

import { PrismaClient } from '@prisma/client'

type TestimonialData = {
  id: string
  name: string
  role: string
  content: string
  rating: number
  isActive: boolean
  createdAt: Date
}

type ExtendedPrisma = typeof prisma & {
  testimonial: {
    findMany: (args?: unknown) => Promise<TestimonialData[]>
  }
}

export default async function LandingTestimonials() {
  const extendedPrisma = prisma as unknown as ExtendedPrisma
  const testimonials = await extendedPrisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  })

  if (testimonials.length === 0) return null

  return (
    <ScrollRevealWrapper id="testimoni" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[500px] h-[500px] rounded-full bg-indigo-50/50 blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="reveal-item text-sm font-black text-indigo-600 uppercase tracking-widest mb-3">
            Kisah Sukses
          </h2>
          <h3 className="reveal-item text-3xl md:text-4xl font-bold text-gray-900 mb-6" style={{ transitionDelay: '100ms' }}>
            Dipercaya oleh Pelaku UMKM
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testi, i) => (
            <div 
              key={testi.id} 
              className="reveal-item bg-white border border-gray-100 p-8 rounded-4xl shadow-lg shadow-gray-200/40 relative"
              style={{ transitionDelay: `${((i % 3) + 1) * 100 + 100}ms` }}
            >
              <Quote className="absolute top-6 right-8 w-10 h-10 text-indigo-50 opacity-50" />
              <div className="flex gap-1 mb-6">
                {[...Array(testi.rating)].map((_, idx) => (
                  <Star key={idx} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed mb-8 relative z-10">
                &quot;{testi.content}&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                  {testi.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testi.name}</h4>
                  <p className="text-sm text-gray-500">{testi.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollRevealWrapper>
  )
}
