import { getDestinations, getCategories } from '@/actions/destinations.actions'
import CategoryPills from '@/components/home/CategoryPills'
import MapWrapper from '@/components/map/MapWrapper'

export default async function PetaPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const category = params.category || ''

  // Fetch all destinations without limit to show them all on the map
  const { data: destinations } = await getDestinations({
    category,
    limit: 1000 // A large number to fetch all points
  })

  const { data: categories } = await getCategories()

  const destinationListRaw: any[] = destinations || []
  const categoryListRaw: any[] = categories || []

  return (
    <main className="min-h-screen px-6 py-8 max-w-7xl mx-auto space-y-8 pb-32">
      {/* Header and Filters */}
      <section className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-end w-full">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Peta Wisata Tianyar</h1>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl">
            Jelajahi seluruh titik destinasi di Tianyar melalui peta interaktif. Temukan lokasi favorit Anda dengan mudah.
          </p>
        </div>
        
        {/* Category Filter overlay or inline */}
        <div className="w-full md:w-auto overflow-hidden flex md:justify-end">
          <CategoryPills categories={categoryListRaw} />
        </div>
      </section>

      {/* Map Container Section */}
      <section className="w-full relative">
        <MapWrapper destinations={destinationListRaw} />
      </section>
    </main>
  )
}
