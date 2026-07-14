import { getPopularDestinations, getDestinations, getCategories } from '@/actions/destinations.actions'
import SearchBar from '@/components/home/SearchBar'
import CategoryPills from '@/components/home/CategoryPills'
import DestinationCard from '@/components/home/DestinationCard'
import MapWrapper from '@/components/map/MapWrapper'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

export default async function HomePage() {
  // Fetch paralel
  const [popularRes, allRes, categoriesRes] = await Promise.all([
    getPopularDestinations(),
    getDestinations(),
    getCategories(),
  ])

  const popularDestinations = popularRes.data
  const allDestinations = allRes.data
  const categories = categoriesRes.data

  const popularListRaw: any[] = popularDestinations || []
  const allListRaw: any[] = allDestinations || []
  const categoryListRaw: any[] = categories || []

  const hasMorePopular = popularListRaw.length > 10
  const displayPopular = popularListRaw.slice(0, 10)

  const hasMoreAll = allListRaw.length > 8
  const displayAll = allListRaw.slice(0, 8)

  return (
    <main className="min-h-screen px-6 pt-[30px] pb-8 max-w-7xl mx-auto space-y-12 pb-32">

      <section className="flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center w-full">

        <div className="md:hidden w-full flex items-start justify-between mb-1">

          <div>
            <p className="text-xs font-medium text-gray-400 mb-0.5">Beranda</p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-tight">
              Tianyar
            </h1>
          </div>

          <div className="flex items-center gap-1 mt-2">
            <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
            <span className="text-xs text-gray-500 whitespace-nowrap">
              Tianyar, Bali
            </span>
          </div>
        </div>

        <div className="w-full lg:w-[400px] shrink-0">
          <SearchBar />
        </div>
        <div className="w-full lg:w-auto overflow-hidden flex lg:justify-end">
          <CategoryPills categories={categoryListRaw} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Popular</h2>
          {hasMorePopular && (
            <Link href="/destinasi?filter=popular" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">
              See all
            </Link>
          )}
        </div>

        <div className="flex gap-5 overflow-x-auto pb-8 pt-4 px-2 -mx-2 no-scrollbar snap-x">
          {displayPopular.length > 0 ? (
            displayPopular.map((dest) => (
              <div key={dest.id} className="snap-start shrink-0 w-[220px] sm:w-[260px]">
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

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">All</h2>
          {hasMoreAll && (
            <Link href="/destinasi" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">
              See all
            </Link>
          )}
        </div>

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

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Map</h2>
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
