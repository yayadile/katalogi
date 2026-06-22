import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import NewWebsiteForm from '@/components/dashboard/NewWebsiteForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Buat Website Baru — Katalogi',
  description: 'Mulai bangun website baru Anda di Katalogi.',
}

export default async function CreateWebsitePage() {
  const session = await requireAuth()

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { tier: true },
  })

  return (
    <div className="w-screen relative left-1/2 -translate-x-1/2 -mt-12 -mb-12 min-h-[calc(100vh-73px)] bg-slate-50 flex animate-in fade-in duration-700">
      <NewWebsiteForm userId={session.userId} userTier={user?.tier ?? 'FREE'} />
    </div>
  )
}

