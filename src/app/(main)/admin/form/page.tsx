import { getCategories, getDestinationById } from '@/actions/destinations.actions'
import FormDestinasiClient from './FormDestinasiClient'

export default async function FormDestinasiPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const params = await searchParams
  const id = params.id

  const { data: categories } = await getCategories()
  
  let initialData = null
  if (id) {
    const { data } = await getDestinationById(id)
    initialData = data
  }

  return (
    <FormDestinasiClient 
      categories={categories || []} 
      initialData={initialData} 
    />
  )
}
