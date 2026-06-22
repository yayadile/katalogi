'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function suspendUser(userId: string) {
  await requireAdmin()
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
  if (user?.role === 'ADMIN') throw new Error('Tidak bisa suspend admin lain.')
  await prisma.user.update({ where: { id: userId }, data: { isSuspended: true } })
  revalidatePath('/admin/users')
}

export async function unsuspendUser(userId: string) {
  await requireAdmin()
  await prisma.user.update({ where: { id: userId }, data: { isSuspended: false } })
  revalidatePath('/admin/users')
}

export async function deleteUser(userId: string) {
  await requireAdmin()
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
  if (user?.role === 'ADMIN') throw new Error('Tidak bisa menghapus admin lain.')
  await prisma.user.delete({ where: { id: userId } })
  revalidatePath('/admin/users')
}

export async function setUserRole(userId: string, role: 'USER' | 'ADMIN') {
  await requireAdmin()
  await prisma.user.update({ where: { id: userId }, data: { role } })
  revalidatePath('/admin/users')
}

export async function unpublishWebsite(websiteId: string) {
  await requireAdmin()
  await prisma.website.update({ where: { id: websiteId }, data: { isPublished: false } })
  revalidatePath('/admin/websites')
}

export async function deleteWebsite(websiteId: string) {
  await requireAdmin()
  await prisma.website.delete({ where: { id: websiteId } })
  revalidatePath('/admin/websites')
}

export async function toggleTestimonial(testimonialId: string) {
  await requireAdmin()
  const t = await prisma.testimonial.findUnique({ where: { id: testimonialId }, select: { isActive: true } })
  if (!t) throw new Error('Testimonial tidak ditemukan.')
  await prisma.testimonial.update({ where: { id: testimonialId }, data: { isActive: !t.isActive } })
  revalidatePath('/admin/testimonials')
}

export async function deleteTestimonial(testimonialId: string) {
  await requireAdmin()
  await prisma.testimonial.delete({ where: { id: testimonialId } })
  revalidatePath('/admin/testimonials')
}

export async function upgradeUserTier(userId: string) {
  await requireAdmin()
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { tier: true } })
  if (!user) throw new Error('User tidak ditemukan.')
  if (user.tier === 'PAID') throw new Error('User sudah PAID.')
  await prisma.user.update({
    where: { id: userId },
    data: { tier: 'PAID', paidAt: new Date() },
  })
  revalidatePath('/admin/subscriptions')
  revalidatePath('/dashboard')
}

export async function downgradeUserTier(userId: string) {
  await requireAdmin()
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { tier: true } })
  if (!user) throw new Error('User tidak ditemukan.')
  await prisma.user.update({
    where: { id: userId },
    data: { tier: 'FREE', paidAt: null },
  })
  revalidatePath('/admin/subscriptions')
  revalidatePath('/dashboard')
  revalidatePath('/admin/subscriptions')
}

export async function createTestimonial(formData: FormData) {
  await requireAdmin()
  const name = formData.get('name') as string
  const role = formData.get('role') as string
  const content = formData.get('content') as string
  const rating = parseInt(formData.get('rating') as string) || 5

  if (!name || !content) throw new Error('Nama dan konten wajib diisi.')

  await prisma.testimonial.create({ data: { name, role: role ?? '', content, rating } })
  revalidatePath('/admin/testimonials')
}

export async function updateTestimonial(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const role = formData.get('role') as string
  const content = formData.get('content') as string
  const rating = parseInt(formData.get('rating') as string) || 5

  if (!id || !name || !content) throw new Error('ID, nama, dan konten wajib diisi.')

  await prisma.testimonial.update({ where: { id }, data: { name, role: role ?? '', content, rating } })
  revalidatePath('/admin/testimonials')
}
