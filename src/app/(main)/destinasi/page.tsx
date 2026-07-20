import { getDestinations, getCategories } from '@/actions/destinations.actions'
import type { Destination, Category } from '@/types'
import SearchBar from '@/components/home/SearchBar'
import CategoryPills from '@/components/home/CategoryPills'
import DestinationCard from '@/components/home/DestinationCard'
import Pagination from '@/components/ui/Pagination'
import { MapPin } from 'lucide-react'

export default async function DestinasiPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>
}) {
  const params = await searchParams
  const query = params.q || ''
  const category = params.category || ''
  const page = Number(params.page) || 1
  const limit = 12

  const [destinationsRes, categoriesRes] = await Promise.all([
    getDestinations({
      search: query,
      category,
      page,
      limit
    }),
    getCategories()
  ])

  const { data: destinations, count } = destinationsRes
  const { data: categories } = categoriesRes

  const destinationListRaw: Destination[] = (destinations || []) as unknown as Destination[]
  const categoryListRaw: Category[] = (categories || []) as unknown as Category[]

  const totalPages = Math.ceil((count || 0) / limit)

  return (
    <main className="min-h-screen px-5 sm:px-6 pt-[30px] pb-32 max-w-7xl mx-auto space-y-12">

      {/* Header + Search + Category */}
      <section className="flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center w-full">
        {/* Mobile header */}
        <div className="md:hidden w-full flex items-start justify-between mb-1">
          <div>
            <p className="text-xs font-medium text-gray-400 mb-0.5">Destinasi</p>
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

      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
          <h2 className="text-base sm:text-xl font-semibold text-gray-900 leading-snug break-words">
            {query ? `Hasil pencarian: "${query}"` : category && category !== 'all' ? `Kategori: ${categoryListRaw.find(c => c.slug === category)?.name || category}` : 'Semua Destinasi'}
          </h2>
          <span className="text-xs sm:text-sm font-medium text-gray-500 bg-gray-100 px-2.5 sm:px-3 py-1 rounded-full self-start sm:self-auto shrink-0">
            {count || 0} ditemukan
          </span>
        </div>

        {destinationListRaw.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {destinationListRaw.map((dest, i) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                priority={i < 4}
              />
            ))}
          </div>
        ) : (
          <div className="w-full py-20 flex flex-col justify-center items-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 gap-2">
            <p className="text-gray-500 font-medium text-sm">Tidak ada destinasi yang sesuai dengan filter Anda.</p>
            <p className="text-gray-400 text-xs">Coba gunakan kata kunci pencarian atau kategori lain.</p>
          </div>
        )}

        <Pagination totalPages={totalPages} />
      </section>
    </main>
  )
}
