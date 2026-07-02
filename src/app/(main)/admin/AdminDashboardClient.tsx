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
    <main className="min-h-screen px-6 py-8 max-w-7xl mx-auto pb-32 space-y-8">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-400">Kelola seluruh data wisata Tianyar</p>
        </div>

        {/* Tambah Baru Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition shadow-md shadow-blue-200"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>

          {dropdownOpen && (
            <>
              {/* Overlay to close dropdown */}
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20 min-w-max">
                <Link
                  href="/admin/form"
                  className="flex items-center gap-3 px-5 py-4 hover:bg-blue-50/50 transition group"
                  onClick={() => setDropdownOpen(false)}
                >
                  <MapPin className="w-5 h-5 text-blue-600 stroke-[1.25] group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">Tambah Destinasi</span>
                </Link>
                <div className="h-px bg-gray-100 mx-4" />
                <Link
                  href="/admin/kategori"
                  className="flex items-center gap-3 px-5 py-4 hover:bg-amber-50/50 transition group"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Tag className="w-5 h-5 text-amber-600 stroke-[1.25] group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">Tambah Kategori</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <MapPin className="w-8 h-8 text-blue-600 stroke-[1.25]" />
          <div>
            <p className="text-3xl font-semibold text-gray-900">{destinations.length}</p>
            <p className="text-sm font-semibold text-gray-500 mt-1">Total Destinasi</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <Layers className="w-8 h-8 text-amber-600 stroke-[1.25]" />
          <div>
            <p className="text-3xl font-semibold text-gray-900">{categories.length}</p>
            <p className="text-sm font-semibold text-gray-500 mt-1">Total Kategori</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <Star className="w-8 h-8 text-yellow-500 stroke-[1.25]" />
          <div>
            <p className="text-3xl font-semibold text-gray-900">{destinations.filter(d => d.is_popular).length}</p>
            <p className="text-sm font-semibold text-gray-500 mt-1">Wisata Populer</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <BarChart3 className="w-8 h-8 text-green-600 stroke-[1.25]" />
          <div>
            <p className="text-3xl font-semibold text-gray-900">{destinations.filter(d => d.price === 0 || !d.price).length}</p>
            <p className="text-sm font-semibold text-gray-500 mt-1">Wisata Gratis</p>
          </div>
        </div>
      </div>


      {/* Destinations Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="font-bold text-gray-900">Daftar Destinasi Wisata</h2>
          <div className="relative w-full sm:w-auto">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari destinasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition w-full sm:w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/70">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Nama Destinasi</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Kategori</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden sm:table-cell">Harga</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Ditambahkan</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((dest) => (
                <tr key={dest.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">{dest.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                      {dest.categories?.name || dest.category || 'Tanpa Kategori'}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`text-sm font-medium ${dest.price === 0 || !dest.price ? 'text-green-600' : 'text-gray-700'}`}>
                      {formatPrice(dest.price)}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    {dest.is_popular ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-yellow-700 bg-yellow-100 px-2.5 py-1 rounded-full w-fit">
                        <Star className="w-3 h-3" />
                        Populer
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">Biasa</span>
                    )}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-sm text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(dest.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/admin/form?id=${dest.id}`}>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                      </Link>
                      <button 
                        onClick={() => setDeleteId(dest.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition" title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                    Tidak ada destinasi yang sesuai pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">Menampilkan {filtered.length} dari {destinations.length} destinasi</p>
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
