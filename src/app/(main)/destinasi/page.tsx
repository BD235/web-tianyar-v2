import { getDestinations, getCategories } from '@/actions/destinations.actions'
import SearchBar from '@/components/home/SearchBar'
import CategoryPills from '@/components/home/CategoryPills'
import DestinationCard from '@/components/home/DestinationCard'
import Pagination from '@/components/ui/Pagination'

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

  const { data: destinations, count } = await getDestinations({
    search: query,
    category,
    page,
    limit
  })

  const { data: categories } = await getCategories()

  const destinationListRaw: any[] = destinations || []
  const categoryListRaw: any[] = categories || []
  
  const totalPages = Math.ceil((count || 0) / limit)

  return (
    <main className="min-h-screen px-6 py-8 max-w-7xl mx-auto space-y-12 pb-32">
      {/* Search & Categories Section */}
      <section className="flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center w-full">
        <div className="w-full lg:w-[400px] shrink-0">
          <SearchBar />
        </div>
        <div className="w-full lg:w-auto overflow-hidden flex lg:justify-end">
          <CategoryPills categories={categoryListRaw} />
        </div>
      </section>

      {/* Destinations List */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {query ? `Hasil pencarian: "${query}"` : category && category !== 'all' ? `Kategori: ${categoryListRaw.find(c => c.slug === category)?.name || category}` : 'Semua Destinasi'}
          </h2>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {count || 0} ditemukan
          </span>
        </div>
        
        {destinationListRaw.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
            {destinationListRaw.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        ) : (
          <div className="w-full py-20 flex flex-col justify-center items-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 gap-2">
            <p className="text-gray-500 font-medium">Tidak ada destinasi yang sesuai dengan filter Anda.</p>
            <p className="text-gray-400 text-sm">Coba gunakan kata kunci pencarian atau kategori lain.</p>
          </div>
        )}

        {/* Pagination */}
        <Pagination totalPages={totalPages} />
      </section>
    </main>
  )
}
