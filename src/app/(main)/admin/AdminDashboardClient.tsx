'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Plus,
  MapPin,
  Tag,
  Pencil,
  Trash2,
  BarChart3,
  Clock,
  Star,
  Search,
  Layers,
} from 'lucide-react'
import { Destination, Category } from '@/types'
import { deleteDestination } from '@/actions/destinations.actions'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface AdminDashboardClientProps {
  destinations: any[]
  categories: Category[]
}

export default function AdminDashboardClient({ destinations, categories }: AdminDashboardClientProps) {
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = destinations.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase())
  )

  const formatPrice = (price: number | null) =>
    !price || price === 0 ? 'Gratis' : `Rp ${price.toLocaleString('id-ID')}`

  const confirmDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    const res = await deleteDestination(deleteId)
    setIsDeleting(false)
    if (!res.success) {
      alert(res.error || 'Terjadi kesalahan saat menghapus')
    } else {
      setDeleteId(null)
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen px-6 pt-[30px] pb-8 max-w-7xl mx-auto pb-32 space-y-8">

      <div className="w-full">
        <div className="flex items-start justify-between">

          <div className="md:hidden">
            <p className="text-xs font-medium text-gray-400 mb-0.5">Admin</p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-tight">
              Tianyar
            </h1>
          </div>

          <div className="hidden md:block">
            <h1 className="text-2xl font-semibold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-400">Kelola seluruh data wisata Tianyar</p>
          </div>

          <div className="md:hidden flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
            <span className="text-xs text-gray-500 whitespace-nowrap">Tianyar, Bali</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2.5">
          <MapPin className="w-6 h-6 md:w-8 md:h-8 text-blue-600 stroke-[1.25]" />
          <div>
            <p className="text-2xl md:text-3xl font-semibold text-gray-900">{destinations.length}</p>
            <p className="text-xs md:text-sm font-medium text-gray-500 mt-0.5">Total Destinasi</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2.5">
          <Layers className="w-6 h-6 md:w-8 md:h-8 text-amber-600 stroke-[1.25]" />
          <div>
            <p className="text-2xl md:text-3xl font-semibold text-gray-900">{categories.length}</p>
            <p className="text-xs md:text-sm font-medium text-gray-500 mt-0.5">Total Kategori</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2.5">
          <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 stroke-[1.25]" />
          <div>
            <p className="text-2xl md:text-3xl font-semibold text-gray-900">{destinations.filter(d => d.is_popular).length}</p>
            <p className="text-xs md:text-sm font-medium text-gray-500 mt-0.5">Wisata Populer</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2.5">
          <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-green-600 stroke-[1.25]" />
          <div>
            <p className="text-2xl md:text-3xl font-semibold text-gray-900">{destinations.filter(d => d.price === 0 || !d.price).length}</p>
            <p className="text-xs md:text-sm font-medium text-gray-500 mt-0.5">Wisata Gratis</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900">Daftar Destinasi Wisata</h2>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari destinasi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 sm:pl-9 pr-3 sm:pr-4 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition w-full"
              />
            </div>

            <div className="relative shrink-0">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition shadow-sm"
                title="Tambah"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Tambah</span>
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 min-w-[180px]">
                    <Link
                      href="/admin/form"
                      className="flex items-center gap-3 px-4 py-3.5 hover:bg-blue-50/50 transition group"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <MapPin className="w-4 h-4 text-blue-600 stroke-[1.25] group-hover:scale-110 transition-transform shrink-0" />
                      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">Tambah Destinasi</span>
                    </Link>
                    <div className="h-px bg-gray-100 mx-3" />
                    <Link
                      href="/admin/kategori"
                      className="flex items-center gap-3 px-4 py-3.5 hover:bg-amber-50/50 transition group"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Tag className="w-4 h-4 text-amber-600 stroke-[1.25] group-hover:scale-110 transition-transform shrink-0" />
                      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">Tambah Kategori</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/70">
              <tr>
                <th className="text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 sm:px-6 py-2.5 sm:py-3">Nama Destinasi</th>
                <th className="text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 sm:px-6 py-2.5 sm:py-3">Kategori</th>
                <th className="text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 sm:px-6 py-2.5 sm:py-3 hidden sm:table-cell">Harga</th>
                <th className="text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 sm:px-6 py-2.5 sm:py-3 hidden md:table-cell">Status</th>
                <th className="text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 sm:px-6 py-2.5 sm:py-3 hidden lg:table-cell">Ditambahkan</th>
                <th className="text-right text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 sm:px-6 py-2.5 sm:py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((dest) => (
                <tr key={dest.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-cover bg-center shrink-0 border border-gray-200/80 shadow-sm bg-gray-100 flex items-center justify-center overflow-hidden"
                        style={{
                          backgroundImage: dest.images && dest.images.length > 0 && dest.images[0]
                            ? `url('${dest.images[0]}')`
                            : undefined
                        }}
                      >
                        {(!dest.images || dest.images.length === 0 || !dest.images[0]) && (
                          <MapPin className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <span className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-1">{dest.title}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                      {dest.categories?.name || dest.category || 'Tanpa Kategori'}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                    <span className={`text-xs sm:text-sm font-medium ${dest.price === 0 || !dest.price ? 'text-green-600' : 'text-gray-700'}`}>
                      {formatPrice(dest.price)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                    {dest.is_popular ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-yellow-700 bg-yellow-100 px-2.5 py-1 rounded-full w-fit">
                        <Star className="w-3 h-3" />
                        Populer
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">Biasa</span>
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {new Date(dest.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-1 sm:gap-2 justify-end">
                      <Link href={`/admin/form?id=${dest.id}`}>
                        <button className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg sm:rounded-xl transition" title="Edit">
                          <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => setDeleteId(dest.id)}
                        className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg sm:rounded-xl transition" title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 sm:py-12 text-gray-400 text-xs sm:text-sm">
                    Tidak ada destinasi yang sesuai pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100">
          <p className="text-xs sm:text-sm text-gray-400">Menampilkan {filtered.length} dari {destinations.length} destinasi</p>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Hapus Destinasi"
        message="Apakah Anda yakin ingin menghapus destinasi ini? Data yang dihapus tidak dapat dikembalikan."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
    </main>
  )
}
