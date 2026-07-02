'use client'

import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Tag, Loader2 } from 'lucide-react'
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

  // Load existing categories
  useEffect(() => {
    async function loadCategories() {
      const { data } = await getCategories()
      if (data) setCategories(data)
      setIsLoading(false)
    }
    loadCategories()
  }, [])

  // Auto-generate slug from name if user hasn't typed in the slug field manually
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
        // Refresh categories
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
    <>
    {/* Curtain mask to hide scrolling content below navbar */}
    <div className="fixed top-0 left-0 right-0 h-[70px] md:h-[90px] bg-slate-50 z-30 pointer-events-none" />

    <main className="min-h-screen pt-[70px] md:pt-[90px] pb-32 px-4 md:px-6 max-w-7xl mx-auto flex items-start justify-center w-full">
      <div className="w-full max-w-3xl space-y-6 relative">
        {/* Form Card */}
        <div className="bg-white md:rounded-3xl shadow-sm md:border md:border-gray-200 relative flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 md:py-6 border-b border-gray-100 flex items-center justify-between sticky top-[70px] md:top-[90px] bg-white/95 backdrop-blur-md z-40 md:rounded-t-3xl shadow-sm">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <button className="p-2 bg-gray-50 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900">Tambah Kategori</h1>
              <p className="text-sm text-gray-500">Buat kelompok wisata baru</p>
            </div>
          </div>
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
        <div className="p-6 space-y-6 mb-24 md:mb-0 relative">

          {/* Nama Kategori */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Nama Kategori</label>
            <div className="relative">
              <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Contoh: Pantai, Air Terjun, Budaya..."
                className="w-full bg-[#f4f7f9] border border-transparent text-gray-900 rounded-xl pl-9 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Slug / URL */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Slug URL</label>
            <p className="text-xs text-gray-400">Digunakan untuk filter di URL. Gunakan huruf kecil dan tanda hubung.</p>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Contoh: air-terjun, pantai-pasir..."
              className="w-full bg-[#f4f7f9] border border-transparent text-gray-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-sm"
            />
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Pratinjau</label>
            <div className="bg-gray-50 rounded-2xl p-5 flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                <Tag className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{name || 'Nama Kategori'}</p>
                <p className="text-xs text-gray-400">{slug || 'slug-kategori'}</p>
              </div>
              <span className="ml-auto text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">0 wisata</span>
            </div>
          </div>

          </div>
        </div>

      {/* Existing Categories Reference */}
      <div className="bg-white md:rounded-3xl shadow-sm md:border md:border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Kategori yang Sudah Ada</h2>
            <div className="space-y-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
              ) : categories.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Belum ada kategori.</p>
              ) : categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between py-2.5 px-4 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Tag className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-900">{cat.name}</span>
                      <span className="text-xs text-gray-400 ml-2 font-mono">{cat.slug}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setDeleteId(cat.id)}
                    className="text-xs text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all font-semibold"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      {/* Mobile Save Button */}
      <div className="md:hidden fixed bottom-0 left-0 w-full p-6 bg-white border-t border-gray-100 z-20">
        <button 
          onClick={handleSave}
          disabled={isPending || !name || !slug}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-4 rounded-full font-semibold text-lg transition-colors shadow-[0_4px_20px_rgba(37,99,235,0.3)] flex justify-center items-center gap-2"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {isPending ? 'Menyimpan...' : 'Simpan Kategori'}
        </button>
      </div>

      <ConfirmDialog 
        isOpen={!!deleteId}
        title="Hapus Kategori"
        message="Yakin ingin menghapus kategori ini? Destinasi yang terhubung ke kategori ini akan kehilangan label kategorinya."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
    </main>
    </>
  )
}
