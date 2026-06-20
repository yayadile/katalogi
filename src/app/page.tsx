import ScrollProgress from '@/components/landing/ScrollProgress'
import LandingNavbar from '@/components/landing/LandingNavbar'
import LandingHero from '@/components/landing/LandingHero'
import LandingTentang from '@/components/landing/LandingTentang'
import LandingCaraKerja from '@/components/landing/LandingCaraKerja'
import LandingFeatures from '@/components/landing/LandingFeatures'
import LandingShowcase from '@/components/landing/LandingShowcase'
import LandingFAQ from '@/components/landing/LandingFAQ'
import LandingCTA from '@/components/landing/LandingCTA'
import LandingFooter from '@/components/landing/LandingFooter'
import LandingTestimonials from '@/components/landing/LandingTestimonials'
// import LandingPricing from '@/components/landing/LandingPricing'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const session = await getSession()
  if (session?.userId) {
    if (session.role === 'ADMIN') {
      redirect('/admin')
    }
    redirect('/dashboard')
  }

  return (
    <div className="bg-white min-h-screen text-gray-900 selection:bg-linear-to-br from-indigo-500 to-indigo-900 selection:text-white">
      <ScrollProgress />
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingTentang />
        <LandingCaraKerja />
        <LandingFeatures />
        <LandingShowcase />
        <LandingTestimonials />
        {/* <LandingPricing /> */}
        <LandingFAQ />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  )
}
