import { getDestinationById } from '@/actions/destinations.actions'
import { MapPin, ArrowLeft, Star, Heart } from 'lucide-react'
import Link from 'next/link'
import FacilityIcons from '@/components/wisata/FacilityIcons'
import DescriptionToggle from '@/components/wisata/DescriptionToggle'
import GalleryCarousel from '@/components/wisata/GalleryCarousel'
import TipsAndRulesCard from '@/components/wisata/TipsAndRulesCard'

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
    <main className="min-h-screen pt-4 mob-l:pt-6 md:pt-8 pb-4 sm:pb-12 px-3 mob-l:px-4 sm:px-6 md:px-8 max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col">

      {/* Hero Card: foto + back button + heart */}
      <div className="relative mb-8 mob-l:mb-10 sm:mb-12">
        {/* Photo Card */}
        <div className="relative w-full aspect-[4/4.5] md:aspect-[16/10] lg:aspect-[16/8] rounded-3xl overflow-hidden bg-gray-100 shadow-sm">
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

          {/* Back Button — di dalam foto, pojok kiri atas */}
          <div className="absolute top-4 left-4 z-10">
            <Link href="/destinasi">
              <button className="w-10 h-10 bg-white rounded-2xl shadow-md flex items-center justify-center text-gray-700 active:scale-95 transition-all">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>

        {/* Heart Button — melayang di pojok kanan bawah card, sedikit keluar */}
        <div className="absolute bottom-[-18px] right-4 z-20">
          <button className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center active:scale-95 transition-all">
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
          </button>
        </div>
      </div>

      {/* Judul + Show map + Rating */}
      <div className="flex items-center justify-between gap-3 mob-l:gap-4 mb-3 mob-l:mb-4">
        {/* Kiri: judul & rating */}
        <div className="flex flex-col gap-2.5 flex-1">
          <h1 className="text-[18px] mob-l:text-[22px] md:text-2xl lg:text-3xl font-bold text-gray-900 leading-snug">{dest.title}</h1>
          <div className="flex items-center gap-1 mob-l:gap-1.5 text-xs mob-l:text-sm md:text-base text-gray-500">
            <Star className="w-3.5 h-3.5 mob-l:w-4 mob-l:h-4 fill-amber-400 text-amber-400 shrink-0" />
            <span className="font-bold text-gray-800">4.5</span>
            <span>({dest.is_popular ? '355 Reviews' : '42 Reviews'})</span>
          </div>
        </div>
        {/* Kanan: show map — rata tengah secara vertikal */}
        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs mob-l:text-sm md:text-base font-bold text-blue-600 hover:underline shrink-0"
        >
          Show map
        </a>
      </div>

      {/* Deskripsi */}
      <div className="mb-4 mob-l:mb-6 md:text-base">
        <DescriptionToggle text={dest.description || 'Tidak ada deskripsi untuk destinasi ini.'} />
      </div>

      {/* Price & Operasional (2-Column Grid) */}
      <div className="grid grid-cols-2 gap-4 mob-l:gap-6 py-4 mob-l:py-5 mb-4 mob-l:mb-6 border-t border-b border-gray-100">
        <div>
          <p className="text-[10px] mob-l:text-xs md:text-sm font-bold mb-2 mob-l:mb-3">Price</p>
          <p className="text-[18px] mob-l:text-[22px] md:text-2xl lg:text-3xl font-bold text-[#18D29B] leading-snug">
            {isFree ? 'Gratis' : `Rp ${dest.price?.toLocaleString('id-ID')}`}
          </p>
        </div>
        <div>
          <p className="text-[10px] mob-l:text-xs md:text-sm font-bold mb-2 mob-l:mb-3">Oprasional</p>
          <p className="text-[18px] mob-l:text-[22px] md:text-2xl lg:text-3xl font-bold text-[#18D29B] leading-snug">
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
        <GalleryCarousel images={galleryImages} placeholderColors={placeholderColors} />
      </div>

      {/* Tips dan Aturan */}
      <div className="mb-2 sm:mb-6">
        <TipsAndRulesCard content={dest.tips_and_rules} />
      </div>
    </main>
  )
}
