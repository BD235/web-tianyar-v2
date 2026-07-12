'use server'

import { createClient } from '@/lib/supabase/server'
import { Destination, Category, Database } from '@/types'
import { revalidatePath } from 'next/cache'
import { cache } from 'react'

interface GetDestinationsParams {
  search?: string
  category?: string
  page?: number
  limit?: number
}

// Cached internal implementation for fetching destinations (omitting facilities and tips_and_rules)
const fetchDestinationsCached = cache(async (paramsKey: string) => {
  const params: GetDestinationsParams = JSON.parse(paramsKey)
  const supabase = await createClient()

  const search = params?.search || ''
  const category = params?.category || ''
  const page = params?.page || 1
  const limit = params?.limit || 12

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

  if (search) {
    query = query.ilike('title', `%${search}%`)
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
})

// Mengambil semua destinasi wisata
export async function getDestinations(params?: GetDestinationsParams) {
  const key = JSON.stringify(params || {})
  return fetchDestinationsCached(key)
}

// Cached internal implementation for popular destinations
const fetchPopularDestinationsCached = cache(async () => {
  const supabase = await createClient()

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
})

// Mengambil destinasi unggulan (is_popular = true)
export async function getPopularDestinations() {
  return fetchPopularDestinationsCached()
}

// Cached internal implementation for destination by ID (detail page, fetch everything including facilities and tips_and_rules)
const fetchDestinationByIdCached = cache(async (id: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('destinations')
    .select(`
      *,
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
})

// Mengambil satu destinasi berdasarkan ID
export async function getDestinationById(id: string) {
  return fetchDestinationByIdCached(id)
}

// Cached internal implementation for categories
const fetchCategoriesCached = cache(async () => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return { error: 'Gagal mengambil data kategori.' }
  }

  return { data }
})

// Mengambil semua kategori
export async function getCategories() {
  return fetchCategoriesCached()
}

// Helper kemanan: Verifikasi autentikasi admin sebelum mutasi data
async function verifyAdminAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return { authorized: false, supabase }
  }
  return { authorized: true, supabase }
}

// Helper sanitasi URL aman
function sanitizeMapUrl(url?: string | null): string | null {
  if (!url || !url.trim()) return null
  const trimmed = url.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  return `https://${trimmed}`
}

// Mutations untuk Kategori (Dilindungi Autentikasi Admin)
export async function createCategory(data: Database['public']['Tables']['categories']['Insert']) {
  const { authorized, supabase } = await verifyAdminAuth()
  if (!authorized) {
    return { error: 'Akses ditolak: Harap login sebagai admin.' }
  }

  const { error } = await supabase.from('categories').insert([data] as any)
  if (error) {
    console.error('Error creating category:', error)
    return { error: error.message || 'Gagal membuat kategori.' }
  }
  revalidatePath('/admin')
  revalidatePath('/admin/kategori')
  revalidatePath('/admin/form')
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
  return { success: true }
}

// Mutations untuk Destinasi (Dilindungi Autentikasi Admin & Sanitasi URL)
export async function createDestination(data: Database['public']['Tables']['destinations']['Insert']) {
  const { authorized, supabase } = await verifyAdminAuth()
  if (!authorized) {
    return { error: 'Akses ditolak: Harap login sebagai admin.' }
  }

  const sanitizedData = {
    ...data,
    map_url: sanitizeMapUrl(data.map_url)
  }

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

  // @ts-ignore
  const { error } = await supabase.from('destinations').update(sanitizedData as any).eq('id', id)
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
  return { success: true }
}

