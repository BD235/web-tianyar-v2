'use server'

import { createClient } from '@/lib/supabase/server'
import { Destination, Category, Database } from '@/types'
import { revalidatePath } from 'next/cache'

interface GetDestinationsParams {
  search?: string
  category?: string
  page?: number
  limit?: number
}

// Mengambil semua destinasi wisata
export async function getDestinations(params?: GetDestinationsParams) {
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
      *,
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
}

// Mengambil destinasi unggulan (is_popular = true)
export async function getPopularDestinations() {
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
    .eq('is_popular', true)
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching popular destinations:', error)
    return { error: 'Gagal mengambil data wisata populer.' }
  }

  return { data }
}

// Mengambil satu destinasi berdasarkan ID
export async function getDestinationById(id: string) {
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
}

// Mengambil semua kategori
export async function getCategories() {
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
}

// Mutations untuk Kategori
export async function createCategory(data: Database['public']['Tables']['categories']['Insert']) {
  const supabase = await createClient()
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
  const supabase = await createClient()
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

// Mutations untuk Destinasi
export async function createDestination(data: Database['public']['Tables']['destinations']['Insert']) {
  const supabase = await createClient()
  const { error } = await supabase.from('destinations').insert([data] as any)
  if (error) {
    console.error('Error creating destination:', error)
    return { error: error.message || 'Gagal menambahkan destinasi.' }
  }
  revalidatePath('/')
  revalidatePath('/peta')
  revalidatePath('/admin')
  return { success: true }
}

export async function updateDestination(id: string, data: Database['public']['Tables']['destinations']['Update']) {
  const supabase = await createClient()
  // @ts-ignore
  const { error } = await supabase.from('destinations').update({ ...data, updated_at: new Date().toISOString() } as any).eq('id', id)
  if (error) {
    console.error('Error updating destination:', error)
    return { error: error.message || 'Gagal mengubah destinasi.' }
  }
  revalidatePath('/')
  revalidatePath('/peta')
  revalidatePath('/admin')
  revalidatePath(`/wisata/${id}`)
  return { success: true }
}

export async function deleteDestination(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('destinations').delete().eq('id', id)
  if (error) {
    console.error('Error deleting destination:', error)
    return { error: 'Gagal menghapus destinasi.' }
  }
  revalidatePath('/')
  revalidatePath('/peta')
  revalidatePath('/admin')
  return { success: true }
}
