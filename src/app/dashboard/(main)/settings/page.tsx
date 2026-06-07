import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { ProfileForm } from '@/components/dashboard/settings/ProfileForm'
import { PasswordForm } from '@/components/dashboard/settings/PasswordForm'
import { EmailForm } from '@/components/dashboard/settings/EmailForm'
import { DeleteAccountForm } from '@/components/dashboard/settings/DeleteAccountForm'
import { Settings } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pengaturan Akun — Katalogi',
  description: 'Kelola profil, kata sandi, dan keamanan akun Anda.',
}

export default async function SettingsPage() {
  const session = await requireAuth()
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true },
  })

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
      
      {/* Header */}
      <div className="pb-10 border-b border-slate-200 mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Pengaturan</h1>
        <p className="text-slate-500 font-medium text-sm max-w-lg leading-relaxed">
          Kelola informasi pribadi, keamanan kata sandi, dan previlege akun Anda di dalam ekosistem Katalogi.
        </p>
      </div>

      <div className="flex flex-col gap-12 divide-y divide-slate-100">
        <ProfileForm currentName={user.name ?? ''} />
        <EmailForm currentEmail={user.email} />
        <PasswordForm />
        <DeleteAccountForm />
      </div>
    </div>
  )
}

