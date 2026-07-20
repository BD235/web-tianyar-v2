'use client'

import { Destination } from '@/types'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface DestinationCardProps {
  destination: Destination
  isPopular?: boolean
  priority?: boolean
  className?: string // kontrol ukuran dari parent (scroll vs grid)
}

export default function DestinationCard({
  destination,
  isPopular = false,
  priority = false,
  className = '',
}: DestinationCardProps) {
  const hasImage =
    destination.images &&
    destination.images.length > 0 &&
    typeof destination.images[0] === 'string' &&
    destination.images[0].trim().length > 0

  return (
    <Link
      href={`/wisata/${destination.id}`}
      className={`group relative block w-full rounded-[28px] overflow-hidden bg-gray-200 shrink-0 aspect-[3/4] ${className}`}
    >
      {/* Shadow efek saat hover */}
      <div
        className={`absolute inset-0 z-0 transition-all duration-300 rounded-[28px] ${
          isPopular
            ? 'group-hover:shadow-[0_20px_40px_-15px_rgba(25,110,238,0.5)] shadow-[0_10px_30px_-12px_rgba(25,110,238,0.25)]'
            : 'group-hover:shadow-xl'
        }`}
      />

      {/* Gambar */}
      <div
        className={`absolute inset-0 z-10 rounded-[28px] overflow-hidden ${
          !hasImage ? 'bg-gray-300 flex items-center justify-center' : ''
        }`}
      >
        {hasImage ? (
          <Image
            src={destination.images![0]}
            alt={destination.title}
            fill
            unoptimized
            sizes="(max-width: 375px) 45vw, (max-width: 425px) 45vw, (max-width: 640px) 45vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 260px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
            loading={priority ? undefined : 'lazy'}
          />
        ) : (
          <span className="text-xs text-gray-500 font-medium px-2 text-center">Belum ada foto</span>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      </div>

      {/* Nama + deskripsi + tombol hati — pojok kiri & kanan bawah */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex items-end justify-between gap-2">
        {/* Kolom kiri: judul di atas, deskripsi di bawah — masing-masing punya badge sendiri */}
        <div className="flex flex-col gap-2 min-w-0 max-w-[calc(100%-2.5rem)]">
          {/* Badge judul */}
          <span className="inline-block self-start bg-white/20 backdrop-blur-md rounded-xl px-3 py-1.5 shadow-sm">
            <h3 className="text-white font-semibold text-sm leading-tight line-clamp-1 drop-shadow-sm">
              {destination.title}
            </h3>
          </span>

          {/* Badge deskripsi — hanya pada card biasa (bukan popular) */}
          {!isPopular && destination.description && (
            <span className="inline-block self-start bg-black/30 backdrop-blur-sm rounded-lg px-2.5 py-1 shadow-sm">
              <p className="text-white/85 text-[10px] leading-tight line-clamp-2 drop-shadow-sm">
                {destination.description}
              </p>
            </span>
          )}
        </div>

        {/* Tombol favorit — hanya muncul jika admin menandai sebagai populer */}
        {destination.is_popular && (
          <button
            className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform"
            aria-label="Favorite"
            onClick={(e) => {
              e.preventDefault()
              // TODO: favorit
            }}
          >
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-red-500 text-red-500" />
          </button>
        )}
      </div>
    </Link>
  )
}


