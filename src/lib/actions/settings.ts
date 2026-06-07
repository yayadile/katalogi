'use server'

import { prisma } from '@/lib/prisma'
import { requireAuth, createSession, deleteSession } from '@/lib/session'
import bcrypt from 'bcryptjs'
import { generateOTP, sendOTPEmail } from '@/lib/mail'

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function updateProfile(state: any, formData: FormData) {
  const session = await requireAuth()
  const name = formData.get('name') as string

  if (!name || name.trim().length < 2) {
    return { error: 'Nama harus minimal 2 karakter.' }
  }

  try {
    await prisma.user.update({
      where: { id: session.userId },
      data: { name },
    })

    // Update session cookie with new name
    await createSession(session.userId, session.email, name)
    return { success: 'Profil berhasil diperbarui.' }
  } catch (error) {
    return { error: 'Gagal memperbarui profil.' }
  }
}

// ─── Password ─────────────────────────────────────────────────────────────────

export async function updatePassword(state: any, formData: FormData) {
  const session = await requireAuth()
  const currentPassword = formData.get('currentPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'Semua kolom wajib diisi.' }
  }

  if (newPassword.length < 6) {
    return { error: 'Sandi baru minimal 6 karakter.' }
  }

  if (newPassword !== confirmPassword) {
    return { error: 'Konfirmasi sandi baru tidak cocok.' }
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: session.userId } })
    if (!user) return { error: 'Pengguna tidak ditemukan.' }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isValid) {
      return { error: 'Sandi saat ini salah.' }
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: session.userId },
      data: { passwordHash },
    })

    return { success: 'Kata sandi berhasil diperbarui.' }
  } catch (error) {
    return { error: 'Gagal memperbarui kata sandi.' }
  }
}

// ─── Email Change ─────────────────────────────────────────────────────────────

export async function initiateEmailChange(state: any, formData: FormData) {
  const session = await requireAuth()
  const newEmail = formData.get('newEmail') as string

  if (!newEmail || !/^\S+@\S+\.\S+$/.test(newEmail)) {
    return { error: 'Format email tidak valid.' }
  }

  if (newEmail === session.email) {
    return { error: 'Email baru tidak boleh sama dengan email saat ini.' }
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email: newEmail } })
    if (existingUser) {
      return { error: 'Email ini sudah digunakan oleh akun lain.' }
    }

    // Invalidate old tokens for this new email
    await prisma.verificationToken.updateMany({
      where: { email: newEmail, type: 'EMAIL_VERIFICATION', usedAt: null },
      data: { usedAt: new Date() },
    })

    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.verificationToken.create({
      data: {
        email: newEmail,
        token: otp,
        type: 'EMAIL_VERIFICATION',
        expiresAt,
      },
    })

    await sendOTPEmail(newEmail, otp)

    return { success: true, email: newEmail }
  } catch (error) {
    console.error(error)
    return { error: 'Gagal mengirim OTP ke email baru.' }
  }
}

export async function confirmEmailChange(state: any, formData: FormData) {
  const session = await requireAuth()
  const email = formData.get('email') as string
  const otp = formData.get('otp') as string

  if (!email || !otp || !/^\d{6}$/.test(otp)) {
    return { error: 'Kode OTP tidak valid.' }
  }

  try {
    const token = await prisma.verificationToken.findFirst({
      where: {
        email,
        token: otp,
        type: 'EMAIL_VERIFICATION',
        usedAt: null,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!token) {
      return { error: 'Kode OTP salah atau sudah kedaluwarsa.' }
    }

    await prisma.verificationToken.update({
      where: { id: token.id },
      data: { usedAt: new Date() },
    })

    const user = await prisma.user.update({
      where: { id: session.userId },
      data: { email },
    })

    await createSession(user.id, user.email, user.name)

    return { success: 'Alamat email berhasil diperbarui.' }
  } catch (error) {
    return { error: 'Terjadi kesalahan sistem.' }
  }
}

// ─── Delete Account ───────────────────────────────────────────────────────────

export async function deleteAccount(state: any, formData: FormData) {
  const session = await requireAuth()
  const password = formData.get('password') as string

  if (!password) {
    return { error: 'Kata sandi wajib diisi.' }
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: session.userId } })
    if (!user) return { error: 'Pengguna tidak ditemukan.' }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return { error: 'Sandi salah. Penghapusan akun dibatalkan.' }
    }

    // Cascade delete on Website is configured in prisma, but let's be safe
    // Since prisma schema has @relation onDelete: Cascade, deleting user works.
    await prisma.user.delete({
      where: { id: session.userId },
    })

    await deleteSession()
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Gagal menghapus akun.' }
  }
}
