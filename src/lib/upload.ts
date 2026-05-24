import { supabase } from './supabase'

export async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
  const filePath = `uploads/${fileName}`

  // Try to create bucket if it doesn't exist (Supabase will error if it does, but that's okay for now)
  // or just assume 'images' bucket exists.
  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, file)

  if (error) {
    console.error('Upload error:', error)
    if (error.message.includes('Bucket not found')) {
      throw new Error('Bucket "images" belum ada di Supabase. Silakan buat bucket bernama "images" dengan akses Public.')
    }
    throw new Error(error.message || 'Gagal upload gambar.')
  }

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath)

  return publicUrl
}
