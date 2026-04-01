import { z } from 'zod'

// ─── User Schema ──────────────────────────────────────────────────────────────

export const userSchema = z.object({
  email: z.email({ error: 'Alamat email tidak valid.' }).trim(),
  password: z
    .string()
    .min(8, { error: 'Password minimal 8 karakter.' })
    .trim(),
  name: z.string().min(2, { error: 'Nama minimal 2 karakter.' }).optional(),
})

export const loginSchema = z.object({
  email: z.email({ error: 'Alamat email tidak valid.' }).trim(),
  password: z.string().min(1, { error: 'Password wajib diisi.' }),
})

// ─── Website Schema ───────────────────────────────────────────────────────────

export const websiteSchema = z.object({
  slug: z
    .string()
    .min(3, { error: 'Slug minimal 3 karakter.' })
    .max(50, { error: 'Slug maksimal 50 karakter.' })
    .regex(/^[a-z0-9-]+$/, {
      error: 'Slug hanya boleh huruf kecil, angka, dan tanda hubung.',
    })
    .trim(),
  title: z
    .string()
    .min(1, { error: 'Judul wajib diisi.' })
    .max(100, { error: 'Judul maksimal 100 karakter.' })
    .trim(),
  description: z.string().max(300, { error: 'Deskripsi maksimal 300 karakter.' }).optional(),
})

export const themeConfigSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, { error: 'Warna tidak valid.' }).optional(),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, { error: 'Warna tidak valid.' }).optional(),
  fontFamily: z.enum(['Inter', 'Poppins', 'DM Sans', 'Playfair Display']).optional(),
})

// ─── Block Schemas by Type ────────────────────────────────────────────────────

const heroContentSchema = z.object({
  headline: z.string().min(1),
  subtext: z.string().optional(),
  ctaText: z.string().optional(),
  bgImage: z.string().optional(),
})

const catalogItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  image: z.string().optional(),
  desc: z.string().optional(),
})

const catalogContentSchema = z.object({
  title: z.string().optional(),
  items: z.array(catalogItemSchema),
})

const contactContentSchema = z.object({
  title: z.string().optional(),
  email: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
})

const textContentSchema = z.object({
  html: z.string().optional(),
  text: z.string().optional(),
})

const galleryContentSchema = z.object({
  title: z.string().optional(),
  images: z.array(z.string()),
})

export const pageBlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('HERO'), content: heroContentSchema }),
  z.object({ type: z.literal('CATALOG'), content: catalogContentSchema }),
  z.object({ type: z.literal('CONTACT'), content: contactContentSchema }),
  z.object({ type: z.literal('TEXT'), content: textContentSchema }),
  z.object({ type: z.literal('GALLERY'), content: galleryContentSchema }),
])

// ─── Action Result Type ───────────────────────────────────────────────────────

export type ActionResult<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}
