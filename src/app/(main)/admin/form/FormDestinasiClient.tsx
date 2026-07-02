'use client'

import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Image as ImageIcon, MapPin, Loader2 } from 'lucide-react'
import { Category } from '@/types'
import { createDestination, updateDestination } from '@/actions/destinations.actions'
import { createClient } from '@/lib/supabase/client'

const LocationPickerMap = dynamic(() => import('@/components/map/LocationPickerMap'), { ssr: false })

const FACILITIES_LIST = ['Area Parkir', 'Toilet Umum', 'Warung Makanan', 'Tempat Ibadah', 'Gazebo/Istirahat', 'Spot Foto', 'Pusat Informasi', 'Penyewaan Alat']

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

  const [latInput, setLatInput] = useState(initialData?.latitude?.toString() || '')
  const [lngInput, setLngInput] = useState(initialData?.longitude?.toString() || '')

  const handleMapClick = (lat: number, lng: number) => {
    setLatInput(lat.toFixed(6))
    setLngInput(lng.toFixed(6))
  }

  const mapPosition = (parseFloat(latInput) && parseFloat(lngInput) && !isNaN(parseFloat(latInput)) && !isNaN(parseFloat(lngInput))) 
    ? { lat: parseFloat(latInput), lng: parseFloat(lngInput) } 
    : null;

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
        const MAX_SIZE = 5 * 1024 * 1024 // 5MB
        const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

        for (const file of imageFiles) {
          if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_SIZE) {
            alert(`File "${file.name}" tidak valid atau ukurannya melebihi 5MB. Proses simpan dibatalkan.`)
            return
          }
          const fileExt = file.name.split('.').pop()
          const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('wisata-images')
            .upload(fileName, file)
          
          if (uploadError) {
            alert(`Gagal mengunggah gambar: ${uploadError.message}`)
            return // Stop saving if image upload fails
          }
          if (uploadData) {
            const { data: publicUrlData } = supabase.storage.from('wisata-images').getPublicUrl(uploadData.path)
            uploadedUrls.push(publicUrlData.publicUrl)
          }
        }
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
        router.push('/admin')
      } else {
        alert(res.error || 'Gagal menyimpan destinasi.')
      }
    })
  }

  return (
    <>
    {/* Curtain mask to hide scrolling content below navbar */}
    <div className="fixed top-0 left-0 right-0 h-[70px] md:h-[90px] bg-slate-50 z-30 pointer-events-none" />

    <main className="min-h-screen pt-[70px] md:pt-[90px] pb-32 px-4 md:px-6 max-w-7xl mx-auto flex items-start justify-center w-full">
      <div className="bg-white md:rounded-3xl shadow-sm md:border md:border-gray-200 w-full max-w-3xl relative flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 md:py-6 border-b border-gray-100 flex items-center justify-between sticky top-[70px] md:top-[90px] bg-white/95 backdrop-blur-md z-40 md:rounded-t-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <button className="p-2 bg-gray-50 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900">{initialData ? 'Edit Destinasi' : 'Tambah Destinasi'}</h1>
            <p className="text-sm text-gray-500">Masukkan detail destinasi wisata</p>
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
      <div className="p-6 space-y-6 mb-24 md:mb-0 relative">

        {/* Nama Tempat */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Nama Tempat Wisata</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Contoh: Pantai Tianyar"
            className="w-full bg-[#f4f7f9] border border-transparent text-gray-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Kategori & Harga */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Kategori</label>
            <select 
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full bg-[#f4f7f9] border border-transparent text-gray-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">Pilih kategori...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Harga Tiket (Rp)</label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="0 untuk gratis"
              className="w-full bg-[#f4f7f9] border border-transparent text-gray-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Jam Operasional */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Jam Operasional</label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-500 ml-1">Jam Buka</span>
              <input
                type="time"
                value={openTime}
                onChange={e => setOpenTime(e.target.value)}
                className="w-full bg-[#f4f7f9] border border-transparent text-gray-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-text"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-500 ml-1">Jam Tutup</span>
              <input
                type="time"
                value={closeTime}
                onChange={e => setCloseTime(e.target.value)}
                className="w-full bg-[#f4f7f9] border border-transparent text-gray-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-text"
              />
            </div>
          </div>
        </div>

        {/* Lokasi Alamat & Peta */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Alamat Lengkap</label>
            <p className="text-xs text-gray-400">Alamat ini hanya untuk tampilan teks, tidak mengubah titik di peta.</p>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Contoh: Jl. Raya Singaraja-Amlapura, Tianyar..."
                className="w-full bg-[#f4f7f9] border border-transparent text-gray-900 rounded-xl pl-9 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">Koordinat Lokasi di Peta</label>
            </div>
            <p className="text-xs text-gray-500">Anda dapat mengisi koordinat manual, atau geser peta dan klik pada lokasi yang tepat untuk menaruh titik penanda merah.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={latInput}
                  onChange={(e) => setLatInput(e.target.value)}
                  placeholder="Latitude (mis: -8.1993)"
                  className="w-full bg-[#f4f7f9] border border-transparent text-gray-900 rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-sm"
                />
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={lngInput}
                  onChange={(e) => setLngInput(e.target.value)}
                  placeholder="Longitude (mis: 115.5262)"
                  className="w-full bg-[#f4f7f9] border border-transparent text-gray-900 rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5 mt-4 mb-4">
              <label className="text-sm font-semibold text-gray-700">Tautan (Link) Google Maps</label>
              <p className="text-xs text-gray-400">Tempelkan link dari Google Maps agar pengunjung bisa langsung membuka rute di aplikasi mereka.</p>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={mapUrl}
                  onChange={(e) => setMapUrl(e.target.value)}
                  placeholder="Contoh: https://maps.app.goo.gl/..."
                  className="w-full bg-[#f4f7f9] border border-transparent text-gray-900 rounded-xl pl-9 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
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

        {/* Deskripsi */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Deskripsi</label>
          <textarea
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Jelaskan daya tarik, fasilitas, dll..."
            className="w-full bg-[#f4f7f9] border border-transparent text-gray-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
          />
        </div>

        {/* Fasilitas */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Fasilitas Tersedia</label>
          <div className="flex flex-wrap gap-2 pt-1">
            {FACILITIES_LIST.map(fas => {
              const isSelected = selectedFacilities.includes(fas)
              return (
                <button
                  key={fas}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      setSelectedFacilities(prev => prev.filter(f => f !== fas))
                    } else {
                      setSelectedFacilities(prev => [...prev, fas])
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                    isSelected 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-[0_2px_10px_rgba(37,99,235,0.1)]' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {fas}
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

        {/* Upload Gambar */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Foto Destinasi</label>
          <div className="flex flex-col gap-4">
            {/* Previews */}
            {(existingImages.length > 0 || imageFiles.length > 0) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map((url, i) => (
                  <div key={`existing-${i}`} className="relative group rounded-2xl overflow-hidden aspect-video border border-gray-200">
                    <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setExistingImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
                {imageFiles.map((file, i) => (
                  <div key={`new-${i}`} className="relative group rounded-2xl overflow-hidden aspect-video border border-gray-200">
                    <img src={URL.createObjectURL(file)} alt={`Preview New ${i}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setImageFiles(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Dropzone */}
            <label className="w-full border-2 border-dashed border-blue-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer group relative overflow-hidden">
              <input 
                type="file" 
                multiple 
                accept="image/png, image/jpeg, image/webp" 
                className="hidden" 
                onChange={e => {
                  if (e.target.files) {
                    const files = Array.from(e.target.files)
                    const validFiles: File[] = []
                    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
                    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

                    for (const file of files) {
                      if (!ALLOWED_TYPES.includes(file.type)) {
                        alert(`File "${file.name}" bukan format gambar yang diizinkan (hanya PNG, JPG, WEBP).`)
                        continue
                      }
                      if (file.size > MAX_SIZE) {
                        alert(`File "${file.name}" melebihi batas ukuran maksimal 5MB (ukuran saat ini: ${(file.size / (1024 * 1024)).toFixed(2)} MB).`)
                        continue
                      }
                      validFiles.push(file)
                    }

                    if (validFiles.length > 0) {
                      setImageFiles(prev => [...prev, ...validFiles])
                    }
                  }
                }}
              />
              <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-blue-100 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:text-blue-600 transition-all text-blue-500">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-blue-900">Klik untuk unggah gambar</p>
              <p className="text-xs text-blue-500/70 mt-1">PNG, JPG, WEBP maksimal 5MB. Bisa lebih dari 1 foto.</p>
            </label>
          </div>
        </div>

        {/* Populer Toggle */}
        <div className="flex items-center justify-between bg-yellow-50 rounded-2xl px-5 py-4 border border-yellow-100">
          <div>
            <p className="text-sm font-semibold text-gray-900">Tandai sebagai Wisata Populer</p>
            <p className="text-xs text-gray-500 mt-0.5">Destinasi ini akan tampil di bagian unggulan di halaman Beranda</p>
          </div>
          <div className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={isPopular}
              onChange={e => setIsPopular(e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 transition-all"></div>
          </div>
        </div>

      </div>

      {/* Mobile Save Button (Sticky bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full p-6 bg-white border-t border-gray-100 z-20">
        <button 
          onClick={handleSave}
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-4 rounded-full font-semibold text-lg transition-colors shadow-[0_4px_20px_rgba(37,99,235,0.3)] flex justify-center items-center gap-2"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {isPending ? 'Menyimpan...' : 'Simpan Data Wisata'}
        </button>
      </div>
      </div>
    </main>
    </>
  )
}
