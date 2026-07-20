import { getPopularDestinations, getDestinations, getCategories } from '@/actions/destinations.actions'
import type { Destination, Category } from '@/types'
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

  const popularListRaw: Destination[] = (popularDestinations || []) as unknown as Destination[]
  const allListRaw: Destination[] = (allDestinations || []) as unknown as Destination[]
  const categoryListRaw: Category[] = (categories || []) as unknown as Category[]

  const hasMorePopular = popularListRaw.length > 10
  const displayPopular = popularListRaw.slice(0, 10)

  const hasMoreAll = allListRaw.length > 8
  const displayAll = allListRaw.slice(0, 8)

  return (
    <main className="min-h-screen px-5 sm:px-6 pt-[30px] pb-32 max-w-7xl mx-auto space-y-10">

      {/* Header + Search + Category */}
      <section className="flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center w-full">
        {/* Mobile header */}
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

        {/* Search + Category (mobile & desktop) */}
        <div className="w-full lg:w-[400px] shrink-0">
          <SearchBar />
        </div>
        <div className="w-full lg:w-auto overflow-hidden flex lg:justify-end">
          <CategoryPills categories={categoryListRaw} />
        </div>
      </section>

      {/* ===== SECTION POPULAR ===== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] sm:text-xl font-semibold text-gray-900">Popular</h2>
          {hasMorePopular && (
            <Link href="/destinasi?filter=popular" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">
              See all
            </Link>
          )}
        </div>

        {/* Scroll horizontal — card cukup besar agar terlihat bisa digeser */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-6 pt-3 -mx-5 px-5 sm:-mx-6 sm:px-6 no-scrollbar snap-x snap-mandatory">
          {displayPopular.length > 0 ? (
            displayPopular.map((dest, i) => (
              <div
                key={dest.id}
                className="snap-start shrink-0 w-[72vw] sm:w-[220px] md:w-[240px] lg:w-[260px]"
              >
                <DestinationCard
                  destination={dest}
                  isPopular={true}
                  priority={i < 3}
                />
              </div>
            ))
          ) : (
            <div className="w-full py-12 flex justify-center items-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">Belum ada data wisata populer.</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== SECTION ALL DESTINASI ===== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] sm:text-xl font-semibold text-gray-900">All</h2>
          {hasMoreAll && (
            <Link href="/destinasi" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">
              See all
            </Link>
          )}
        </div>

        {displayAll.length > 0 ? (
          // Mobile: 1 kolom penuh | Tablet: 2 kolom | Laptop: 3-4 kolom
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {displayAll.map((dest, i) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                priority={i < 4}
              />
            ))}
          </div>
        ) : (
          <div className="w-full py-20 flex justify-center items-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm">Belum ada data wisata.</p>
          </div>
        )}
      </section>

      {/* ===== SECTION MAP ===== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] sm:text-xl font-semibold text-gray-900">Map</h2>
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
