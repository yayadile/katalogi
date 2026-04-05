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
    throw new Error('Failed to upload image. Please make sure the "images" bucket exists in Supabase.')
  }

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath)

  return publicUrl
}
