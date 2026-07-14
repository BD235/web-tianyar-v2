export default function DestinasiLoading() {
  return (
    <main className="min-h-screen px-6 py-8 max-w-7xl mx-auto space-y-12 pb-32 animate-pulse">

      <section className="flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center w-full">
        <div className="w-full lg:w-[400px] h-12 bg-gray-200 rounded-full shrink-0" />
        <div className="flex gap-2 overflow-hidden w-full lg:w-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 rounded-full shrink-0" />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-7 w-48 bg-gray-200 rounded-md" />
          <div className="h-6 w-24 bg-gray-200 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-full aspect-[4/5] bg-gray-200 rounded-3xl"
            />
          ))}
        </div>
      </section>
    </main>
  )
}
