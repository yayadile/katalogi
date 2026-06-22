import React from 'react'
import { Star } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import ScrollRevealWrapper from './ScrollRevealWrapper'

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

  const [first, ...rest] = testimonials

  return (
    <ScrollRevealWrapper id="testimoni" className="py-24 md:py-32 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/[0.03] blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="reveal-item text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Kisah sukses pengguna
          </h2>
          <p className="reveal-item delay-100 text-gray-500 text-lg">
            Dipercaya oleh pelaku UMKM dari berbagai daerah.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Featured card — spans full height of the right column */}
          <div className="reveal-item md:row-span-2 bg-white border border-gray-200 rounded-3xl p-8 md:p-10 flex flex-col justify-between hover:border-indigo-200 transition-all duration-300">
            <div>
              <div className="flex gap-1 mb-5">
                {[...Array(first.rating)].map((_, idx) => (
                  <Star key={idx} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg mb-8">
                &ldquo;{first.content}&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg">
                {first.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{first.name}</h4>
                <p className="text-sm text-gray-500">{first.role}</p>
              </div>
            </div>
          </div>

          {/* Rest in a vertical stack */}
          <div className="flex flex-col gap-6">
            {rest.slice(0, 3).map((testi, i) => (
              <div
                key={testi.id}
                className="reveal-item bg-white border border-gray-200 rounded-2xl p-6 hover:border-indigo-200 transition-all duration-300"
                style={{ transitionDelay: `${(i + 1) * 100}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testi.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  &ldquo;{testi.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-linear-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {testi.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{testi.name}</h4>
                    <p className="text-xs text-gray-500">{testi.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollRevealWrapper>
  )
}
