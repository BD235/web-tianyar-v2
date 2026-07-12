'use client'

import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Tag, Loader2, Trash2 } from 'lucide-react'
import { getCategories, createCategory, deleteCategory } from '@/actions/destinations.actions'
import { Category } from '@/types'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

export default function FormKategoriPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    async function loadCategories() {
      const { data } = await getCategories()
      if (data) setCategories(data)
      setIsLoading(false)
    }
    loadCategories()
  }, [])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
  }

  const handleSave = () => {
    if (!name || !slug) return
    startTransition(async () => {
      const res = await createCategory({ name, slug })
      if (res.success) {
        setName('')
        setSlug('')
        const { data } = await getCategories()
        if (data) setCategories(data)
        router.refresh()
      } else {
        alert(res.error || 'Terjadi kesalahan')
      }
    })
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    const res = await deleteCategory(deleteId)
    setIsDeleting(false)
    if (res.success) {
      setDeleteId(null)
      const { data } = await getCategories()
      if (data) setCategories(data)
      router.refresh()
    } else {
      alert(res.error || 'Terjadi kesalahan')
    }
  }

  return (
    <main className="min-h-screen pt-[70px] md:pt-[90px] pb-16 px-4 md:px-6 max-w-7xl mx-auto flex items-start justify-center w-full">
      <div className="w-full max-w-3xl space-y-4 relative">

        {/* Form Card */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 md:border-gray-200 relative flex flex-col">

          {/* Header — tidak sticky */}
          <div className="px-4 sm:px-6 py-4 md:py-6 border-b border-gray-100 flex items-center justify-between rounded-t-2xl md:rounded-t-3xl bg-white z-40 shadow-sm">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <button className="p-2 bg-gray-50 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Tambah Kategori</h1>
                <p className="text-xs text-gray-400">Buat kelompok wisata baru</p>
              </div>
            </div>
            {/* Desktop Save */}
            <button
              onClick={handleSave}
              disabled={isPending || !name || !slug}
              className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isPending ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>

          {/* Form Content */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">

            {/* Nama Kategori */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-gray-700">Nama Kategori</label>
              <div className="relative">
                <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Contoh: Pantai, Air Terjun..."
                  className="w-full bg-[#f4f7f9] border border-transparent text-sm text-gray-900 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-gray-700">Slug URL</label>
              <p className="text-[10px] sm:text-xs text-gray-400">Huruf kecil dan tanda hubung, untuk filter URL.</p>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Contoh: air-terjun"
                className="w-full bg-[#f4f7f9] border border-transparent text-sm text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
              />
            </div>

            {/* Preview */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-gray-700">Pratinjau</label>
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{name || 'Nama Kategori'}</p>
                  <p className="text-xs text-gray-400 font-mono truncate">{slug || 'slug-kategori'}</p>
                </div>
                <span className="ml-auto shrink-0 text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">0 wisata</span>
              </div>
            </div>

          </div>

          {/* Mobile Save Button — inline di bawah form */}
          <div className="md:hidden px-4 pt-1 pb-4">
            <button
              onClick={handleSave}
              disabled={isPending || !name || !slug}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3.5 rounded-2xl font-semibold text-base transition-colors shadow-[0_4px_20px_rgba(37,99,235,0.25)] flex justify-center items-center gap-2"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isPending ? 'Menyimpan...' : 'Simpan Kategori'}
            </button>
          </div>

        </div>

        {/* Daftar Kategori */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 md:border-gray-200 p-4 sm:p-6">
          <h2 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3">Kategori yang Sudah Ada</h2>
          <div className="space-y-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              </div>
            ) : categories.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Belum ada kategori.</p>
            ) : categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Tag className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-semibold text-gray-900">{cat.name}</span>
                    <span className="text-[10px] sm:text-xs text-gray-400 ml-2 font-mono">{cat.slug}</span>
                  </div>
                </div>
                <button
                  onClick={() => setDeleteId(cat.id)}
                  className="shrink-0 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title={`Hapus ${cat.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Hapus Kategori"
        message="Yakin ingin menghapus kategori ini?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
    </main>
  )
}
