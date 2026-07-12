'use client'

import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Image as ImageIcon, MapPin, Loader2, Plus, Trash2, Car, Bath, Utensils, Landmark, Umbrella, Camera, Info, ShoppingBag } from 'lucide-react'
import { Category } from '@/types'
import { createDestination, updateDestination } from '@/actions/destinations.actions'
import { createClient } from '@/lib/supabase/client'

const LocationPickerMap = dynamic(() => import('@/components/map/LocationPickerMap'), { ssr: false })

const FACILITIES_LIST = [
  { key: 'Area Parkir',      icon: Car,         label: 'Parkir' },
  { key: 'Toilet Umum',      icon: Bath,        label: 'Toilet' },
  { key: 'Warung Makanan',   icon: Utensils,    label: 'Warung' },
  { key: 'Tempat Ibadah',    icon: Landmark,    label: 'Ibadah' },
  { key: 'Gazebo/Istirahat', icon: Umbrella,    label: 'Gazebo' },
  { key: 'Spot Foto',        icon: Camera,      label: 'Foto' },
  { key: 'Pusat Informasi',  icon: Info,        label: 'Info' },
  { key: 'Penyewaan Alat',   icon: ShoppingBag, label: 'Sewa' },
]

interface FormDestinasiClientProps {
  categories: Category[]
  initialData?: any
}

export default function FormDestinasiClient({ categories, initialData }: FormDestinasiClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [title, setTitle] = useState(initialData?.title || '')
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '')
  const [price, setPrice] = useState(initialData?.price?.toString() || '')
  const [openTime, setOpenTime] = useState(initialData?.operational_hours?.split(' - ')[0] || '08:00')
  const [closeTime, setCloseTime] = useState(initialData?.operational_hours?.split(' - ')[1] || '18:00')
  const [description, setDescription] = useState(initialData?.description || '')
  const [tips, setTips] = useState(initialData?.tips_and_rules || '')
  const [isPopular, setIsPopular] = useState(initialData?.is_popular || false)
  const [mapUrl, setMapUrl] = useState(initialData?.map_url || '')
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(
    Array.isArray(initialData?.facilities) ? initialData.facilities : []
  )

  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || [])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [isUploadingImages, setIsUploadingImages] = useState(false)

  const [latInput, setLatInput] = useState(initialData?.latitude?.toString() || '')
  const [lngInput, setLngInput] = useState(initialData?.longitude?.toString() || '')

  const handleMapClick = (lat: number, lng: number) => {
    setLatInput(lat.toFixed(6))
    setLngInput(lng.toFixed(6))
  }

  const mapPosition = (parseFloat(latInput) && parseFloat(lngInput) && !isNaN(parseFloat(latInput)) && !isNaN(parseFloat(lngInput)))
    ? { lat: parseFloat(latInput), lng: parseFloat(lngInput) }
    : null;

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 1200
        let width = img.width
        let height = img.height
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width)
          width = MAX_WIDTH
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }

  const handleSave = () => {
    if (!title || !categoryId || !description || !latInput || !lngInput) {
      alert('Mohon lengkapi semua field wajib (Nama, Kategori, Deskripsi, Koordinat Peta).')
      return
    }

    startTransition(async () => {
      const supabase = createClient()
      let uploadedUrls: string[] = []

      // Upload new images
      if (imageFiles.length > 0) {
        setIsUploadingImages(true)
        const MAX_SIZE = 5 * 1024 * 1024 // 5MB
        const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

        for (const file of imageFiles) {
          if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_SIZE) {
            alert(`File "${file.name}" tidak valid atau ukurannya melebihi 5MB. Proses simpan dibatalkan.`)
            setIsUploadingImages(false)
            return
          }
          const fileExt = file.name.split('.').pop()
          const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('wisata-images')
            .upload(fileName, file)

          if (uploadError) {
            console.error('Supabase Storage error:', uploadError.message)
            alert(`Gagal mengunggah gambar "${file.name}": ${uploadError.message}. Pastikan bucket "wisata-images" sudah dibuat dan memiliki izin akses yang benar di Supabase.`)
            setIsUploadingImages(false)
            return
          } else if (uploadData) {
            const { data: publicUrlData } = supabase.storage.from('wisata-images').getPublicUrl(uploadData.path)
            uploadedUrls.push(publicUrlData.publicUrl)
          }
        }
        setIsUploadingImages(false)
      }

      const finalImages = [...existingImages, ...uploadedUrls]

      const data = {
        title,
        category_id: categoryId,
        price: price ? parseInt(price) : 0,
        operational_hours: `${openTime} - ${closeTime}`,
        latitude: parseFloat(latInput),
        longitude: parseFloat(lngInput),
        description,
        tips_and_rules: tips,
        is_popular: isPopular,
        map_url: mapUrl,
        facilities: selectedFacilities,
        images: finalImages,
      }

      let res;
      if (initialData?.id) {
        res = await updateDestination(initialData.id, data)
      } else {
        res = await createDestination(data)
      }

      if (res.success) {
        router.refresh()
        router.push('/admin')
      } else {
        alert(res.error || 'Gagal menyimpan destinasi.')
      }
    })
  }

  return (
      <main className="min-h-screen pt-[70px] md:pt-[90px] pb-32 px-4 md:px-6 max-w-7xl mx-auto flex items-start justify-center w-full">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 md:border-gray-200 w-full max-w-3xl relative flex flex-col">
          {/* Header — tidak sticky di mana pun */}
          <div className="px-4 sm:px-6 py-4 md:py-6 border-b border-gray-100 flex items-center justify-between rounded-t-2xl md:rounded-t-3xl bg-white z-40 shadow-sm">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <button className="p-2 bg-gray-50 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">{initialData ? 'Edit Destinasi' : 'Tambah Destinasi'}</h1>
                <p className="text-xs text-gray-400">Isi detail destinasi wisata</p>
              </div>
            </div>

            {/* Desktop Save Button */}
            <button
              onClick={handleSave}
              disabled={isPending}
              className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isPending ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>

          {/* Form Content */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 relative">

            {/* Nama Tempat */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-gray-700">Nama Tempat Wisata</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Contoh: Pantai Tianyar"
                className="w-full bg-[#f4f7f9] border border-transparent text-sm text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Deskripsi — dipindah tepat di bawah Nama */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-gray-700">Deskripsi</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Jelaskan daya tarik tempat ini..."
                className="w-full bg-[#f4f7f9] border border-transparent text-sm text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              />
            </div>

            {/* Kategori & Harga */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-gray-700">Kategori</label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full bg-[#f4f7f9] border border-transparent text-sm text-gray-900 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Pilih...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-gray-700">Harga (Rp)</label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="0 = gratis"
                  className="w-full bg-[#f4f7f9] border border-transparent text-sm text-gray-900 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Jam Operasional */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-gray-700">Jam Operasional</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-xs font-medium text-gray-500 ml-1">Buka</span>
                  <input
                    type="time"
                    value={openTime}
                    onChange={e => setOpenTime(e.target.value)}
                    className="w-full bg-[#f4f7f9] border border-transparent text-sm text-gray-900 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-text"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-xs font-medium text-gray-500 ml-1">Tutup</span>
                  <input
                    type="time"
                    value={closeTime}
                    onChange={e => setCloseTime(e.target.value)}
                    className="w-full bg-[#f4f7f9] border border-transparent text-sm text-gray-900 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-text"
                  />
                </div>
              </div>
            </div>

            {/* Lokasi Alamat & Peta */}
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-gray-700">Alamat</label>
                <p className="text-[10px] sm:text-xs text-gray-400">Hanya tampilan teks, tidak mengubah titik peta.</p>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Jl. Raya Tianyar..."
                    className="w-full bg-[#f4f7f9] border border-transparent text-sm text-gray-900 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700">Koordinat Lokasi di Peta</label>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500">Isi manual atau klik langsung di peta.</p>

                <div className="grid grid-cols-2 gap-3 mb-3 mt-2">
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={latInput}
                      onChange={(e) => setLatInput(e.target.value)}
                      placeholder="Latitude"
                      className="w-full bg-[#f4f7f9] border border-transparent text-gray-900 rounded-xl pl-8 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-xs"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={lngInput}
                      onChange={(e) => setLngInput(e.target.value)}
                      placeholder="Longitude"
                      className="w-full bg-[#f4f7f9] border border-transparent text-gray-900 rounded-xl pl-8 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1 mt-3 mb-3">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">Link Google Maps</label>
                  <p className="text-[10px] sm:text-xs text-gray-400">Tempel link Maps agar pengunjung bisa buka rute.</p>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={mapUrl}
                      onChange={(e) => setMapUrl(e.target.value)}
                      placeholder="https://maps.app.goo.gl/..."
                      className="w-full bg-[#f4f7f9] border border-transparent text-sm text-gray-900 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="w-full h-[350px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
                  <LocationPickerMap
                    position={mapPosition}
                    onLocationSelect={handleMapClick}
                  />
                </div>
              </div>
            </div>

            {/* Deskripsi sudah dipindah ke atas — bagian ini dihapus */}

            {/* Fasilitas */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Fasilitas Tersedia</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {FACILITIES_LIST.map(fas => {
                  const isSelected = selectedFacilities.includes(fas.key)
                  return (
                    <button
                      key={fas.key}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedFacilities(prev => prev.filter(f => f !== fas.key))
                        } else {
                          setSelectedFacilities(prev => [...prev, fas.key])
                        }
                      }}
                      className={`flex flex-col items-center gap-1 w-16 sm:w-20 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                        isSelected
                          ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-[0_2px_10px_rgba(37,99,235,0.1)]'
                          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <fas.icon className="w-5 h-5" />
                      <span>{fas.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tips & Aturan */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Tips & Aturan Kunjungan <span className="text-gray-400 font-normal">(opsional)</span></label>
              <textarea
                rows={3}
                value={tips}
                onChange={e => setTips(e.target.value)}
                placeholder="Contoh: Gunakan baju sopan, dilarang membuang sampah sembarangan..."
                className="w-full bg-[#f4f7f9] border border-transparent text-gray-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              />
            </div>

            {/* Foto Destinasi */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">Foto Destinasi</label>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP · maks. 5MB</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  {existingImages.length + imageFiles.length} foto
                </span>
              </div>

              {/* Dropzone */}
              <label className="w-full border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-2xl p-5 flex flex-col items-center justify-center bg-blue-50/20 hover:bg-blue-50/40 transition-all cursor-pointer group">
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files) {
                      const files = Array.from(e.target.files)
                      const validFiles: File[] = []
                      const MAX_SIZE = 5 * 1024 * 1024
                      const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
                      for (const file of files) {
                        if (!ALLOWED_TYPES.includes(file.type)) {
                          alert(`File "${file.name}" bukan format yang diizinkan.`)
                          continue
                        }
                        if (file.size > MAX_SIZE) {
                          alert(`File "${file.name}" melebihi 5MB.`)
                          continue
                        }
                        validFiles.push(file)
                      }
                      if (validFiles.length > 0) setImageFiles(prev => [...prev, ...validFiles])
                    }
                  }}
                />
                <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-all">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-gray-700 text-center group-hover:text-blue-600">Pilih atau Drag &amp; Drop Foto</p>
                <p className="text-[10px] text-gray-400 mt-0.5 text-center">PNG · JPG · WEBP · maks. 5MB</p>
              </label>

              {/* Previews Daftar Foto */}
              {(existingImages.length > 0 || imageFiles.length > 0) && (
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-semibold text-gray-700">Daftar Foto yang Akan Disimpan ke Database:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {existingImages.map((url, i) => (
                      <div key={`existing-${i}`} className="relative group rounded-2xl overflow-hidden aspect-video border border-gray-200 bg-gray-100 shadow-sm">
                        <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                          Tersimpan {i + 1}
                        </div>
                        <button
                          type="button"
                          onClick={() => setExistingImages(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg transition-opacity"
                          title="Hapus foto ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {imageFiles.map((file, i) => (
                      <div key={`new-${i}`} className="relative group rounded-2xl overflow-hidden aspect-video border border-blue-300 bg-blue-50 shadow-sm">
                        <img src={URL.createObjectURL(file)} alt={`Foto Baru ${i + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-sm">
                          Siap Diunggah {i + 1}
                        </div>
                        <button
                          type="button"
                          onClick={() => setImageFiles(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg transition-opacity"
                          title="Hapus foto ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Populer Toggle */}
            <div 
              onClick={() => setIsPopular(!isPopular)}
              className="flex items-center justify-between bg-yellow-50 hover:bg-yellow-100/70 rounded-2xl px-5 py-4 border border-yellow-100 cursor-pointer select-none transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">Tandai sebagai Wisata Populer</p>
                <p className="text-xs text-gray-500 mt-0.5">Destinasi ini akan tampil di bagian unggulan di halaman Beranda</p>
              </div>
              <div className="relative inline-flex items-center pointer-events-none">
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={() => {}}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 transition-all"></div>
              </div>
            </div>

          </div>

          {/* Mobile Save Button — rapat di bawah toggle populer */}
          <div className="md:hidden px-4 pt-1 pb-4">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3.5 rounded-2xl font-semibold text-base transition-colors shadow-[0_4px_20px_rgba(37,99,235,0.25)] flex justify-center items-center gap-2"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isPending ? 'Menyimpan...' : 'Simpan Destinasi'}
            </button>
          </div>
        </div>
      </main>
  )
}
