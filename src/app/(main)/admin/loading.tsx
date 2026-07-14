export default function AdminLoading() {
  return (
    <main className="min-h-screen px-6 pt-[30px] pb-8 max-w-7xl mx-auto pb-32 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="w-full flex justify-between items-start">
        {/* Mobile Header Skeleton */}
        <div className="md:hidden space-y-1">
          <div className="h-3 w-12 bg-gray-200 rounded" />
          <div className="h-8 w-24 bg-gray-200 rounded-lg" />
        </div>

        {/* Desktop Header Skeleton */}
        <div className="hidden md:block space-y-1.5">
          <div className="h-8 w-40 bg-gray-200 rounded-lg" />
          <div className="h-4 w-60 bg-gray-200 rounded" />
        </div>

        <div className="md:hidden h-5 w-24 bg-gray-200 rounded-full mt-1" />
      </div>

      {/* Grid Stat Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-lg" />
            <div className="space-y-1.5">
              <div className="h-7 w-12 bg-gray-200 rounded-lg" />
              <div className="h-3.5 w-24 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Container Skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table Header Controls */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="h-5 w-44 bg-gray-200 rounded" />
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="h-9 w-full sm:w-64 bg-gray-100 border border-gray-200 rounded-xl" />
            <div className="h-9 w-24 bg-gray-200 rounded-xl shrink-0" />
          </div>
        </div>

        {/* Table Rows Skeleton */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/70">
              <tr>
                <th className="px-3 sm:px-6 py-3"><div className="h-3.5 w-28 bg-gray-200 rounded" /></th>
                <th className="px-3 sm:px-6 py-3"><div className="h-3.5 w-16 bg-gray-200 rounded" /></th>
                <th className="px-3 sm:px-6 py-3 hidden sm:table-cell"><div className="h-3.5 w-12 bg-gray-200 rounded" /></th>
                <th className="px-3 sm:px-6 py-3 hidden md:table-cell"><div className="h-3.5 w-12 bg-gray-200 rounded" /></th>
                <th className="px-3 sm:px-6 py-3 hidden lg:table-cell"><div className="h-3.5 w-24 bg-gray-200 rounded" /></th>
                <th className="px-3 sm:px-6 py-3 text-right"><div className="h-3.5 w-16 bg-gray-200 rounded ml-auto" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...Array(5)].map((_, idx) => (
                <tr key={idx}>
                  {/* Nama Destinasi */}
                  <td className="px-3 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-xl shrink-0" />
                      <div className="h-4 w-32 sm:w-40 bg-gray-200 rounded" />
                    </div>
                  </td>
                  {/* Kategori */}
                  <td className="px-3 sm:px-6 py-4">
                    <div className="h-5 w-16 sm:w-20 bg-gray-200 rounded-full" />
                  </td>
                  {/* Harga */}
                  <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </td>
                  {/* Status */}
                  <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                    <div className="h-5 w-16 bg-gray-200 rounded-full" />
                  </td>
                  {/* Ditambahkan */}
                  <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </td>
                  {/* Aksi */}
                  <td className="px-3 sm:px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                      <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
