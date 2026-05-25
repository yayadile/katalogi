import ScrollProgress from '@/components/landing/ScrollProgress'
import LandingNavbar from '@/components/landing/LandingNavbar'
import LandingHero from '@/components/landing/LandingHero'
import LandingTentang from '@/components/landing/LandingTentang'
import LandingCaraKerja from '@/components/landing/LandingCaraKerja'
import LandingFeatures from '@/components/landing/LandingFeatures'
import LandingFAQ from '@/components/landing/LandingFAQ'
import LandingCTA from '@/components/landing/LandingCTA'
import LandingFooter from '@/components/landing/LandingFooter'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const session = await getSession()
  if (session?.userId) {
    redirect('/dashboard')
  }

  return (
    <div className="bg-white min-h-screen text-gray-900 selection:bg-indigo-600 selection:text-white">
      <ScrollProgress />
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingTentang />
        <LandingCaraKerja />
        <LandingFeatures />
        <LandingFAQ />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  )
}
