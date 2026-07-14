export default function PetaLoading() {
  return (
    <>
      {/* Mobile Skeleton */}
      <div className="md:hidden relative min-h-screen w-full overflow-hidden animate-pulse">
        <div className="fixed inset-0 z-0 w-full h-[100dvh] bg-gray-200" />
        
        <div className="relative z-40 px-5 pt-4 space-y-3.5 pb-32">
          <div className="w-full flex items-start justify-between">
            <div>
              <div className="h-4 w-12 bg-gray-300 rounded mb-1.5" />
              <div className="h-8 w-32 bg-gray-300 rounded-lg" />
            </div>
            <div className="h-7 w-28 bg-gray-300 rounded-full mt-2" />
          </div>

          <div className="w-full h-12 bg-gray-300 rounded-2xl" />

          <div className="w-full flex gap-2 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-24 bg-gray-300/80 rounded-full shrink-0" />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Skeleton */}
      <main className="hidden md:block min-h-screen px-6 pt-[30px] pb-24 max-w-7xl mx-auto space-y-6 animate-pulse">
        <section className="flex flex-col lg:flex-row justify-between gap-4 items-stretch lg:items-center w-full">
          <div className="w-full lg:w-[400px] h-12 bg-gray-200 rounded-full shrink-0" />
          <div className="flex gap-2 overflow-hidden w-full lg:w-auto lg:justify-end">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded-full shrink-0" />
            ))}
          </div>
        </section>

        <section className="w-full relative">
          <div className="w-full h-[calc(100vh-250px)] min-h-[620px] bg-gray-200 rounded-3xl" />
        </section>
      </main>
    </>
  )
}
