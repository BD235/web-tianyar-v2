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

  const [destinationsRes, categoriesRes] = await Promise.all([
    getDestinations({
      search: query,
      category,
      limit: 1000
    }),
    getCategories()
  ])

  const destinations = destinationsRes.data
  const categories = categoriesRes.data

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const destinationListRaw: any[] = destinations || []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categoryListRaw: any[] = categories || []

  return (
    <>

      <div className="md:hidden relative min-h-screen w-full overflow-hidden">

        <div className="fixed inset-0 z-0 w-full h-[100dvh]">
          <MapWrapper
            destinations={destinationListRaw}
            frameless={true}
            className="w-full h-full"
          />
        </div>

        <div className="relative z-40 px-5 pt-4 space-y-3.5 pointer-events-none pb-32">

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

          <div className="w-full pointer-events-auto">
            <SearchBar placeholder="Cari destinasi di peta..." className="w-full" />
          </div>

          <div className="w-full overflow-hidden pointer-events-auto">
            <CategoryPills categories={categoryListRaw} />
          </div>
        </div>
      </div>

      <main className="hidden md:block min-h-screen px-6 pt-[30px] pb-24 max-w-7xl mx-auto space-y-6">

        <section className="flex flex-col lg:flex-row justify-between gap-4 items-stretch lg:items-center w-full">
          <div className="w-full lg:w-[400px] shrink-0">
            <SearchBar placeholder="Cari destinasi di peta..." />
          </div>
          <div className="w-full lg:w-auto overflow-hidden flex lg:justify-end">
            <CategoryPills categories={categoryListRaw} />
          </div>
        </section>

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
