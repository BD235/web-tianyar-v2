import { getDestinations, getCategories } from '@/actions/destinations.actions'
import AdminDashboardClient from './AdminDashboardClient'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [destinationsRes, categoriesRes] = await Promise.all([
    getDestinations({ limit: 1000 }),
    getCategories()
  ])

  const destinations = destinationsRes.data || []
  const categories = categoriesRes.data || []

  return (
    <AdminDashboardClient
      destinations={destinations}
      categories={categories}
    />
  )
}
