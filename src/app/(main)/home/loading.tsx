export default function HomeLoading() {
  return (
    <main className="min-h-screen px-5 sm:px-6 pt-[30px] pb-32 max-w-7xl mx-auto space-y-10 animate-pulse">

      <section className="flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center w-full">
        <div className="w-full lg:w-[400px] h-12 bg-gray-200 rounded-full shrink-0" />
        <div className="flex gap-2 overflow-hidden w-full lg:w-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 rounded-full shrink-0" />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-gray-200 rounded-md" />
          <div className="h-4 w-16 bg-gray-200 rounded-md" />
        </div>
        <div className="flex gap-5 overflow-hidden pt-4 pb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-[280px] sm:w-[320px] aspect-[4/5] bg-gray-200 rounded-3xl shrink-0"
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 bg-gray-200 rounded-md" />
          <div className="h-4 w-16 bg-gray-200 rounded-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-full aspect-[4/5] bg-gray-200 rounded-3xl"
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-20 bg-gray-200 rounded-md" />
          <div className="h-4 w-28 bg-gray-200 rounded-md" />
        </div>
        <div className="w-full h-[450px] bg-gray-200 rounded-3xl" />
      </section>
    </main>
  )
}
