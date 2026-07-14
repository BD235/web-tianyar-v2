export default function WisataDetailLoading() {
  return (
    <main className="min-h-screen pt-4 mob-l:pt-6 md:pt-8 pb-12 px-4 sm:px-6 md:px-8 max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col animate-pulse">

      <div className="relative mb-8 sm:mb-12">
        <div className="w-full aspect-[4/4.5] md:aspect-[16/10] lg:aspect-[16/8] rounded-3xl bg-gray-200" />
      </div>

      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="space-y-2 flex-1">
          <div className="h-8 w-2/3 bg-gray-200 rounded-lg" />
          <div className="h-4 w-1/3 bg-gray-200 rounded-md" />
        </div>
        <div className="h-5 w-20 bg-gray-200 rounded-md" />
      </div>

      <div className="space-y-2 mb-6">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
      </div>

      <div className="grid grid-cols-2 gap-6 py-5 mb-6 border-t border-b border-gray-100">
        <div className="space-y-2">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-7 w-28 bg-gray-200 rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-7 w-36 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </main>
  )
}
