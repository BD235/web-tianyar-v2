import { getDestinations, getCategories } from '@/actions/destinations.actions'
import CategoryPills from '@/components/home/CategoryPills'
import SearchBar from '@/components/home/SearchBar'
import MapWrapper from '@/components/map/MapWrapper'
import { MapPin } from 'lucide-react'

export default async function PetaPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const params = await searchParams
  const category = params.category || ''
  const query = params.q || ''

  // Fetch all destinations matching search query and category to show on the map
  const { data: destinations } = await getDestinations({
    search: query,
    category,
    limit: 1000 // A large number to fetch all matching points
  })

  const { data: categories } = await getCategories()

  const destinationListRaw: any[] = destinations || []
  const categoryListRaw: any[] = categories || []

  return (
    <>
      {/* 1. KHUSUS MOBILE (< 768px): MAP PENUH / FULL SCREEN */}
      <div className="md:hidden relative min-h-screen w-full overflow-hidden">
        {/* Peta Full Layar Seperti Google Maps */}
        <div className="fixed inset-0 z-0 w-full h-[100dvh]">
          <MapWrapper
            destinations={destinationListRaw}
            frameless={true}
            className="w-full h-full"
          />
        </div>

        {/* Overlay Depan (Tulisan, SearchBar, Filter) */}
        <div className="relative z-40 px-5 pt-4 space-y-3.5 pointer-events-none pb-32">
          {/* Header Mobile */}
          <div className="w-full flex items-start justify-between pointer-events-auto">
            <div>
              <p className="text-xs font-medium text-gray-700 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] mb-0.5">
                Peta
              </p>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 drop-shadow-[0_2px_8px_rgba(255,255,255,0.95)] leading-tight">
                Tianyar
              </h1>
            </div>
            <div className="flex items-center gap-1 mt-2 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
              <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
              <span className="text-xs text-gray-700 font-medium whitespace-nowrap">
                Tianyar, Bali
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-full pointer-events-auto">
            <SearchBar placeholder="Cari destinasi di peta..." className="w-full" />
          </div>

          {/* Filter Kategori */}
          <div className="w-full overflow-hidden pointer-events-auto">
            <CategoryPills categories={categoryListRaw} />
          </div>
        </div>
      </div>

      {/* 2. KHUSUS TABLET / LAPTOP / DESKTOP (>= 768px): TAMPILAN STANDAR SEPERTI LAMA */}
      <main className="hidden md:block min-h-screen px-6 pt-[30px] pb-24 max-w-7xl mx-auto space-y-6">
        {/* Search & Filter Desktop */}
        <section className="flex flex-col lg:flex-row justify-between gap-4 items-stretch lg:items-center w-full">
          <div className="w-full lg:w-[400px] shrink-0">
            <SearchBar placeholder="Cari destinasi di peta..." />
          </div>
          <div className="w-full lg:w-auto overflow-hidden flex lg:justify-end">
            <CategoryPills categories={categoryListRaw} />
          </div>
        </section>

        {/* Map Container Standar Desktop */}
        <section className="w-full relative">
          <MapWrapper
            destinations={destinationListRaw}
            frameless={false}
            className="w-full h-[calc(100vh-250px)] min-h-[620px]"
          />
        </section>
      </main>
    </>
  )
}



