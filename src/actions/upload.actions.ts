'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Upload gambar ke Supabase Storage dari Server Action.
 * Server Action membawa session cookie admin sehingga RLS terpenuhi.
 * Menerima FormData dengan field 'file' (Blob/File).
 */
export async function uploadImage(formData: FormData): Promise<{ url: string | null; error: string | null }> {
  const file = formData.get('file') as File | null

  if (!file) {
    return { url: null, error: 'File tidak ditemukan.' }
  }

  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  const MAX_SIZE = 5 * 1024 * 1024 // 5MB

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { url: null, error: `Tipe file tidak diizinkan: ${file.type}` }
  }

  if (file.size > MAX_SIZE) {
    return { url: null, error: `Ukuran file melebihi 5MB: ${file.name}` }
  }

  const supabase = await createClient()

  // Cek autentikasi user di server (getUser memverifikasi token ke server Supabase)
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { url: null, error: 'Tidak terautentikasi. Silakan login kembali.' }
  }

  const fileName = `${crypto.randomUUID()}.jpg`
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  const { data, error } = await supabase.storage
    .from('wisata-images')
    .upload(fileName, buffer, {
      contentType: 'image/jpeg',
      cacheControl: '86400',
      upsert: false,
    })

  if (error) {
    if (error.message.includes('row-level security policy')) {
      return {
        url: null,
        error: `Supabase Storage RLS Violation (email aktif: ${user.email}). Policy INSERT untuk bucket "wisata-images" di Supabase belum mengizinkan upload oleh user ini. Buka Supabase Dashboard -> Storage -> Policies -> wisata-images, lalu buat Policy INSERT untuk Authenticated Users.`
      }
    }
    return { url: null, error: error.message }
  }

  const { data: publicUrlData } = supabase.storage.from('wisata-images').getPublicUrl(data.path)
  return { url: publicUrlData.publicUrl, error: null }
}
