import { getDestinationById } from '@/actions/destinations.actions'
import { MapPin, ArrowLeft, Star } from 'lucide-react'
import Link from 'next/link'
import FacilityIcons from '@/components/wisata/FacilityIcons'
import DescriptionToggle from '@/components/wisata/DescriptionToggle'

export default async function WisataDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const res = await getDestinationById(resolvedParams.id)
  const dest: any = res.data
  
  if (!dest) {
    return (
      <main className="min-h-screen pt-32 px-4 flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Destinasi tidak ditemukan</h1>
        <p className="text-gray-500 mb-6">Mungkin data telah dihapus atau URL tidak valid.</p>
        <Link href="/destinasi" className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium">
          Kembali ke Daftar Destinasi
        </Link>
      </main>
    )
  }

  const mapLink = dest.map_url || `https://maps.google.com/?q=${dest.latitude},${dest.longitude}`
  const categoryName = (dest as any).categories?.name || 'Wisata'
  const isFree = !dest.price || dest.price === 0
  const facilities = Array.isArray(dest.facilities) ? dest.facilities : []
  const displayFacilities = facilities.length > 0 ? facilities : ['Area Parkir', 'Spot Foto', 'Toilet Umum', 'Gazebo']

  const validImages = Array.isArray(dest.images) 
    ? dest.images.filter((img: any) => typeof img === 'string' && img.trim().length > 0 && !img.includes('null') && !img.includes('undefined')) 
    : []
  const galleryImages = validImages
  const placeholderColors = ['bg-[#C4C8CC]', 'bg-[#8E9399]', 'bg-[#585D63]', 'bg-[#374151]']

  return (
    <main className="min-h-screen pt-6 md:pt-8 pb-20 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto flex flex-col">
      {/* Top Banner Image with Back Button */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:h-[450px] rounded-[24px] sm:rounded-[32px] overflow-hidden bg-gray-100 shadow-sm mb-6 sm:mb-8 shrink-0">
        {validImages.length > 0 ? (
          <img 
            src={validImages[0]} 
            alt={dest.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 gap-2">
            <MapPin className="w-12 h-12 text-gray-400" />
            <span className="text-xs text-gray-500 font-medium">Belum ada foto dari admin</span>
          </div>
        )}
        
        {/* Back Button */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
          <Link href="/destinasi">
            <button className="w-10 h-10 sm:w-12 sm:h-12 bg-white/95 hover:bg-white rounded-xl sm:rounded-2xl shadow-md flex items-center justify-center text-gray-800 transition-all active:scale-95">
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </Link>
        </div>
      </div>

      {/* Title, Show map Link & Rating Header */}
      <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-snug">{dest.title}</h1>
          <a 
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm sm:text-base font-semibold text-blue-600 hover:text-blue-700 hover:underline shrink-0 pt-1 sm:pt-2"
          >
            Show map
          </a>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400 inline shrink-0" />
          <span className="font-bold text-gray-800">4.8</span>
          <span>({dest.is_popular ? '355 Reviews' : '42 Reviews'})</span>
          <span className="mx-1.5 text-gray-300">•</span>
          <span className="text-blue-600 font-semibold uppercase">{categoryName}</span>
        </div>
      </div>

      {/* Description with Expand/Collapse Toggle */}
      <div className="mb-6 sm:mb-8">
        <DescriptionToggle text={dest.description || 'Tidak ada deskripsi untuk destinasi ini.'} />
      </div>

      {/* Price & Operasional (2-Column Grid) */}
      <div className="grid grid-cols-2 gap-6 py-4 sm:py-6 mb-8 border-t border-b border-gray-100">
        <div>
          <p className="text-xs sm:text-sm font-semibold text-gray-400 mb-1">Price</p>
          <p className="text-2xl sm:text-3xl font-black text-[#18D29B] tracking-tight">
            {isFree ? 'Gratis' : `Rp ${dest.price?.toLocaleString('id-ID')}`}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm font-semibold text-gray-400 mb-1">Oprasional</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-black text-[#18D29B] tracking-tight">
            {dest.operational_hours || '07.00 - 16.00'}
          </p>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="mb-8 sm:mb-10">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Facilities</h2>
        <FacilityIcons facilities={displayFacilities} className="gap-3 sm:gap-4 justify-start" />
      </div>

      {/* Galeri Section */}
      <div className="mb-8 sm:mb-10">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Galeri</h2>
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 -mx-2 px-2 no-scrollbar">
          {/* Show actual images from DB */}
          {galleryImages.map((img: string, idx: number) => (
            <div key={`img-${idx}`} className="w-[110px] sm:w-[180px] md:w-[200px] h-[140px] sm:h-[220px] md:h-[240px] shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100 border border-gray-200/60 shadow-sm">
              <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
          {/* Fill remaining slots up to 4 with aesthetic cards from reference image */}
          {Array.from({ length: Math.max(0, 4 - galleryImages.length) }).map((_, idx) => {
            const colorClass = placeholderColors[idx % placeholderColors.length]
            return (
              <div key={`placeholder-${idx}`} className={`w-[110px] sm:w-[180px] md:w-[200px] h-[140px] sm:h-[200px] md:h-[240px] shrink-0 rounded-2xl sm:rounded-3xl ${colorClass} shadow-sm flex items-center justify-center`}>
                {galleryImages.length === 0 && idx === 0 && (
                  <span className="text-[10px] sm:text-xs text-white/80 font-medium px-2 text-center">Foto Admin Kosong</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Tips dan Aturan */}
      <div className="mb-8 sm:mb-12">
        <div className="bg-[#EAECEF] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center text-sm sm:text-base font-medium text-gray-600 leading-relaxed">
          {dest.tips_and_rules || 'tips berkunjung dan aturan'}
        </div>
      </div>
    </main>
  )
}
