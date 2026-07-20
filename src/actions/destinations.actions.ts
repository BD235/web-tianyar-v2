'use server'

import { createClient, createPublicClient } from '@/lib/supabase/server'
import { Database } from '@/types'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'

interface GetDestinationsParams {
  search?: string
  category?: string
  page?: number
  limit?: number
}

// ─────────────────────────────────────────────
// READ: Daftar Destinasi (dengan search, category, pagination)
// Menggunakan unstable_cache langsung — tidak perlu double-layer react.cache
// ─────────────────────────────────────────────
export async function getDestinations(params?: GetDestinationsParams) {
  const search = params?.search || ''
  const category = params?.category || ''
  const page = params?.page || 1
  const limit = params?.limit || 12

  return unstable_cache(
    async () => {
      const supabase = createPublicClient()

      const from = (page - 1) * limit
      const to = from + limit - 1

      let query = supabase
        .from('destinations')
        .select(`
          id,
          category_id,
          title,
          description,
          price,
          operational_hours,
          latitude,
          longitude,
          images,
          is_popular,
          created_at,
          map_url,
          categories!inner (
            id,
            name,
            slug
          )
        `, { count: 'exact' })

      // Gunakan Full-Text Search via kolom search_vector + index GIN
      // Jauh lebih cepat dari ilike '%keyword%' yang melakukan full-table scan
      if (search) {
        if (search.trim().length >= 2) {
          query = query.textSearch('search_vector', search.trim(), {
            type: 'websearch',
            config: 'simple',
          })
        } else {
          // Fallback ke ilike untuk input karakter tunggal
          query = query.ilike('title', `%${search}%`)
        }
      }

      if (category) {
        query = query.eq('categories.slug', category)
      }

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) {
        console.error('Error fetching destinations:', error)
        return { error: 'Gagal mengambil data wisata.', count: 0 }
      }

      return { data, count: count || 0 }
    },
    ['destinations-list', search, category, String(page), String(limit)],
    { revalidate: 60, tags: ['destinations'] }
  )()
}

// ─────────────────────────────────────────────
// READ: Destinasi Populer
// ─────────────────────────────────────────────
export const getPopularDestinations = unstable_cache(
  async () => {
    const supabase = createPublicClient()

    const { data, error } = await supabase
      .from('destinations')
      .select(`
        id,
        category_id,
        title,
        description,
        price,
        operational_hours,
        latitude,
        longitude,
        images,
        is_popular,
        created_at,
        map_url,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('is_popular', true)
      .order('created_at', { ascending: false })
      .limit(15)

    if (error) {
      console.error('Error fetching popular destinations:', error)
      return { error: 'Gagal mengambil data wisata populer.' }
    }

    return { data }
  },
  ['popular-destinations'],
  { revalidate: 30, tags: ['popular-destinations', 'destinations'] }
)

// ─────────────────────────────────────────────
// READ: Destinasi by ID — explicit column list, bukan select('*')
// ─────────────────────────────────────────────
export async function getDestinationById(id: string) {
  return unstable_cache(
    async () => {
      const supabase = createPublicClient()

      // Explicit column list — hindari select('*') yang mengambil semua kolom
      // termasuk search_vector (tsvector bisa besar) dan kolom yang tidak digunakan
      const { data, error } = await supabase
        .from('destinations')
        .select(`
          id,
          category_id,
          title,
          description,
          price,
          operational_hours,
          latitude,
          longitude,
          images,
          is_popular,
          map_url,
          tips_and_rules,
          facilities,
          created_at,
          updated_at,
          categories (
            id,
            name,
            slug
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error(`Error fetching destination ${id}:`, error)
        return { error: 'Data wisata tidak ditemukan.' }
      }

      return { data }
    },
    [`destination-detail-${id}`],
    { revalidate: 60, tags: [`destination-${id}`, 'destinations'] }
  )()
}

// ─────────────────────────────────────────────
// READ: Kategori — static data, di-hoist ke module level
// ─────────────────────────────────────────────
export const getCategories = unstable_cache(
  async () => {
    const supabase = createPublicClient()

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return { error: 'Gagal mengambil data kategori.' }
    }

    return { data }
  },
  ['categories-list'],
  { revalidate: 3600, tags: ['categories'] }
)

// ─────────────────────────────────────────────
// HELPER: Verifikasi autentikasi admin
// ─────────────────────────────────────────────
async function verifyAdminAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return { authorized: false, supabase }
  }
  return { authorized: true, supabase }
}

// HELPER: Sanitasi URL Google Maps
function sanitizeMapUrl(url?: string | null): string | null {
  if (!url || !url.trim()) return null
  const trimmed = url.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  return `https://${trimmed}`
}

// ─────────────────────────────────────────────
// MUTASI: Kategori
// ─────────────────────────────────────────────
export async function createCategory(data: Database['public']['Tables']['categories']['Insert']) {
  const { authorized, supabase } = await verifyAdminAuth()
  if (!authorized) {
    return { error: 'Akses ditolak: Harap login sebagai admin.' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase.from('categories').insert([data] as any)
  if (error) {
    console.error('Error creating category:', error)
    return { error: error.message || 'Gagal membuat kategori.' }
  }
  revalidatePath('/admin')
  revalidatePath('/admin/kategori')
  revalidatePath('/admin/form')
  revalidateTag('categories', 'max')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const { authorized, supabase } = await verifyAdminAuth()
  if (!authorized) {
    return { error: 'Akses ditolak: Harap login sebagai admin.' }
  }

  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) {
    console.error('Error deleting category:', error)
    return { error: 'Gagal menghapus kategori.' }
  }
  revalidatePath('/admin')
  revalidatePath('/admin/kategori')
  revalidatePath('/admin/form')
  revalidateTag('categories', 'max')
  return { success: true }
}

// ─────────────────────────────────────────────
// MUTASI: Destinasi
// ─────────────────────────────────────────────
export async function createDestination(data: Database['public']['Tables']['destinations']['Insert']) {
  const { authorized, supabase } = await verifyAdminAuth()
  if (!authorized) {
    return { error: 'Akses ditolak: Harap login sebagai admin.' }
  }

  const sanitizedData = {
    ...data,
    map_url: sanitizeMapUrl(data.map_url)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase.from('destinations').insert([sanitizedData] as any)
  if (error) {
    console.error('Error creating destination:', error)
    return { error: error.message || 'Gagal menambahkan destinasi.' }
  }
  revalidatePath('/')
  revalidatePath('/home')
  revalidatePath('/destinasi')
  revalidatePath('/peta')
  revalidatePath('/admin')
  revalidateTag('destinations', 'max')
  revalidateTag('popular-destinations', 'max')
  return { success: true }
}

export async function updateDestination(id: string, data: Database['public']['Tables']['destinations']['Update']) {
  const { authorized, supabase } = await verifyAdminAuth()
  if (!authorized) {
    return { error: 'Akses ditolak: Harap login sebagai admin.' }
  }

  const sanitizedData = {
    ...data,
    map_url: sanitizeMapUrl(data.map_url),
    updated_at: new Date().toISOString()
  }

  // Supabase strict generic memerlukan cast — known limitation di strict TypeScript
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('destinations')
    .update(sanitizedData)
    .eq('id', id)

  if (error) {
    console.error('Error updating destination:', error)
    return { error: error.message || 'Gagal mengubah destinasi.' }
  }
  revalidatePath('/')
  revalidatePath('/home')
  revalidatePath('/destinasi')
  revalidatePath('/peta')
  revalidatePath('/admin')
  revalidatePath(`/wisata/${id}`)
  revalidateTag('destinations', 'max')
  revalidateTag('popular-destinations', 'max')
  revalidateTag(`destination-${id}`, 'max')
  return { success: true }
}

export async function deleteDestination(id: string) {
  const { authorized, supabase } = await verifyAdminAuth()
  if (!authorized) {
    return { error: 'Akses ditolak: Harap login sebagai admin.' }
  }

  const { error } = await supabase.from('destinations').delete().eq('id', id)
  if (error) {
    console.error('Error deleting destination:', error)
    return { error: 'Gagal menghapus destinasi.' }
  }
  revalidatePath('/')
  revalidatePath('/home')
  revalidatePath('/destinasi')
  revalidatePath('/peta')
  revalidatePath('/admin')
  revalidateTag('destinations', 'max')
  revalidateTag('popular-destinations', 'max')
  revalidateTag(`destination-${id}`, 'max')
  return { success: true }
}
