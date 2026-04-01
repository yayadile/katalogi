'use server'

import { prisma } from '@/lib/prisma'
import { userSchema, loginSchema, type ActionResult } from '@/lib/validations'
import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

// ─── Register ─────────────────────────────────────────────────────────────────

export type AuthFormState =
  | { errors?: { email?: string[]; password?: string[]; name?: string[] }; message?: string }
  | undefined

export async function register(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = userSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name'),
  })

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as AuthFormState['errors'] }
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
    return { errors: parsed.error.flatten().fieldErrors as AuthFormState['errors'] }
  }

  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return { message: 'Email atau password salah.' }
  }

  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) {
    return { message: 'Email atau password salah.' }
  }

  await createSession(user.id, user.email, user.name)
  redirect('/dashboard')
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(): Promise<ActionResult> {
  await deleteSession()
  redirect('/login')
}
