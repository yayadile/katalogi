'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

// Prefer a privileged key (bypasses Storage row-level security). Fall back to the
// public anon key — that only works if the "images" bucket has a permissive
// upload policy, otherwise Supabase returns an RLS error.
const uploadKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!

const usingServiceKey = Boolean(
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
)

export type UploadResult =
  | { success: true; url: string }
  | { success: false; error: string }

/**
 * Uploads an image to the Supabase "images" bucket from the server.
 * Using the service-role key here avoids the browser-side RLS rejection
 * ("new row violates row-level security policy").
 */
export async function uploadImageAction(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get('file') as File | null
    if (!file || file.size === 0) {
      return { success: false, error: 'Tidak ada file yang dipilih.' }
    }
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'Ukuran foto terlalu besar (maks 5MB).' }
    }
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File harus berupa gambar.' }
    }

    const supabase = createClient(supabaseUrl, uploadKey, {
      auth: { persistSession: false },
    })

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png'
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `uploads/${fileName}`

    const arrayBuffer = await file.arrayBuffer()

    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      const msg = error.message.toLowerCase()
      if (msg.includes('bucket not found')) {
        return {
          success: false,
          error: 'Bucket "images" belum ada di Supabase. Buat bucket bernama "images" (Public).',
        }
      }
      if (msg.includes('row-level security') || msg.includes('policy') || msg.includes('unauthorized')) {
        return {
          success: false,
          error: usingServiceKey
            ? 'Upload ditolak Supabase. Periksa policy bucket "images".'
            : 'Upload diblokir RLS. Tambahkan SUPABASE_SERVICE_ROLE_KEY ke .env, atau buat policy INSERT untuk bucket "images".',
        }
      }
      return { success: false, error: error.message || 'Gagal upload gambar.' }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('images').getPublicUrl(filePath)

    return { success: true, url: publicUrl }
  } catch (e) {
    console.error('uploadImageAction failed:', e)
    return { success: false, error: 'Gagal upload gambar.' }
  }
}
