import { getPopularDestinations, getDestinations, getCategories } from '@/actions/destinations.actions'
import SearchBar from '@/components/home/SearchBar'
import CategoryPills from '@/components/home/CategoryPills'
import DestinationCard from '@/components/home/DestinationCard'
import MapWrapper from '@/components/map/MapWrapper'
import Link from 'next/link'

export default async function HomePage() {
  // Fetch data from database
  const { data: popularDestinations } = await getPopularDestinations()
  const { data: allDestinations } = await getDestinations()
  const { data: categories } = await getCategories()

  const popularListRaw: any[] = popularDestinations || []
  const allListRaw: any[] = allDestinations || []
  const categoryListRaw: any[] = categories || []

  // Logic for limiting items and showing "See all"
  const hasMorePopular = popularListRaw.length > 4
  const displayPopular = popularListRaw.slice(0, 4)

  const hasMoreAll = allListRaw.length > 8
  const displayAll = allListRaw.slice(0, 8)

  return (
    <main className="min-h-screen px-6 py-8 max-w-7xl mx-auto space-y-12 pb-32">
      {/* Search & Categories Section */}
      {/* Responsif: lg (desktop) sejajar kiri-kanan, <lg (tablet/hp) turun ke bawah rata kiri */}
      <section className="flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center w-full">
        <div className="w-full lg:w-[400px] shrink-0">
          <SearchBar />
        </div>
        <div className="w-full lg:w-auto overflow-hidden flex lg:justify-end">
          <CategoryPills categories={categoryListRaw} />
        </div>
      </section>

      {/* Popular Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Popular</h2>
          {hasMorePopular && (
            <Link href="/destinasi?filter=popular" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">
              See all
            </Link>
          )}
        </div>
        
        {/* Horizontal scroll for popular items */}
        <div className="flex gap-5 overflow-x-auto pb-8 pt-4 px-2 -mx-2 no-scrollbar snap-x">
          {displayPopular.length > 0 ? (
            displayPopular.map((dest) => (
              <div key={dest.id} className="snap-start shrink-0">
                <DestinationCard destination={dest} isPopular={true} />
              </div>
            ))
          ) : (
            <div className="w-full py-12 flex justify-center items-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-400">Belum ada data wisata populer.</p>
            </div>
          )}
        </div>
      </section>

      {/* All Destinations Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">All</h2>
          {hasMoreAll && (
            <Link href="/destinasi" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">
              See all
            </Link>
          )}
        </div>
        
        {/* Grid layout for all items */}
        {displayAll.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
            {displayAll.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        ) : (
          <div className="w-full py-20 flex justify-center items-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400">Belum ada data wisata.</p>
          </div>
        )}
      </section>

      {/* Map Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Map</h2>
          <Link href="/peta" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">
            Lihat Peta Penuh
          </Link>
        </div>
        
        <div className="w-full relative">
          <MapWrapper 
            destinations={allListRaw} 
            className="w-full h-[450px] relative rounded-3xl overflow-hidden shadow-sm border border-gray-200" 
          />
        </div>
      </section>
    </main>
  )
}
