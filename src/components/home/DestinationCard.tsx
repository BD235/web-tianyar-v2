'use client'

import { Destination } from '@/types'
import { Heart } from 'lucide-react'
import Link from 'next/link'

interface DestinationCardProps {
  destination: Destination
  isPopular?: boolean
}

export default function DestinationCard({ destination, isPopular = false }: DestinationCardProps) {
  const hasImage = destination.images && destination.images.length > 0 && typeof destination.images[0] === 'string' && destination.images[0].trim().length > 0

  return (
    <Link href={`/wisata/${destination.id}`} className="group relative block aspect-[3/4] w-full max-w-[260px] rounded-[32px] overflow-hidden bg-gray-200 shrink-0">
      {/* Glow Effect for Popular (only visible via shadow wrapper if needed, or we just add a strong shadow) */}
      <div 
        className={`absolute inset-0 z-0 transition-all duration-300 ${
          isPopular 
            ? 'group-hover:shadow-[0_20px_40px_-15px_rgba(25,110,238,0.5)] shadow-[0_15px_35px_-15px_rgba(25,110,238,0.3)] rounded-[32px]'
            : 'group-hover:shadow-xl'
        }`} 
      />

      {/* Background Image or Placeholder */}
      <div 
        className={`absolute inset-0 bg-cover bg-center z-10 rounded-[32px] overflow-hidden ${!hasImage ? 'bg-gray-300 flex items-center justify-center' : ''}`}
        style={hasImage ? { backgroundImage: `url('${destination.images![0]}')` } : undefined}
      >
        {!hasImage && <span className="text-xs text-gray-500 font-medium">No Foto Admin</span>}
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-5">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-white font-semibold text-base sm:text-lg leading-tight line-clamp-1 drop-shadow-md">
              {destination.title}
            </h3>
            

          </div>

          {/* Heart Button */}
          <button 
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform"
            aria-label="Favorite"
            onClick={(e) => {
              e.preventDefault(); // prevent navigation when clicking heart
              // Add favorite logic here later
            }}
          >
            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
          </button>
        </div>
      </div>
    </Link>
  )
}
