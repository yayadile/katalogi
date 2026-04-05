'use server'

import { prisma } from '@/lib/prisma'
import { userSchema, loginSchema, type ActionResult } from '@/lib/validations'
import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

// ─── Register ─────────────────────────────────────────────────────────────────

type AuthFormStateData = {
  errors?: {
    email?: string[]
    password?: string[]
    name?: string[]
  }
  message?: string
}

export type AuthFormState = AuthFormStateData | null | undefined

export async function register(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = userSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name'),
  })

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as AuthFormStateData['errors'] }
  }

  const { email, password, name } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { message: 'Email sudah terdaftar.' }
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  })

  await createSession(user.id, user.email, user.name)
  redirect('/dashboard')
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as AuthFormStateData['errors'] }
  }

  const { email, password } = parsed.data

  // 1. Cari user dulu sebelum masuk blok try
  const user = await prisma.user.findUnique({ where: { email } })
  
  if (!user) {
    return { message: 'Email atau password salah.' }
  }

  try {
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return { message: 'Email atau password salah.' }
    }

    // 2. Buat session (tunggu sampai beres)
    await createSession(user.id, user.email, user.name)
    
  } catch (error) {
    // Cek apakah ini error redirect (biar gak ketangkep sebagai error sistem)
    if (error && typeof error === 'object' && 'digest' in error) {
        throw error;
    }
    console.error("Login Error:", error)
    return { message: 'Terjadi kesalahan sistem.' }
  }

  // 3. Pindah ke dashboard (setelah session beres)
  redirect('/dashboard')

}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(_formData: FormData) {
  await deleteSession()
  redirect('/login')
}
