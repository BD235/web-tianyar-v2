import { getDestinations, getCategories } from '@/actions/destinations.actions'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboard() {
  const [destinationsRes, categoriesRes] = await Promise.all([
    getDestinations({ limit: 1000 }), // fetch all for admin
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
