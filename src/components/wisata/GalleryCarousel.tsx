'use client'

import { useState, useRef } from 'react'
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

interface GalleryCarouselProps {
  images: string[]
  placeholderColors?: string[]
}

export default function GalleryCarousel({
  images,
  placeholderColors = ['bg-[#C4C8CC]', 'bg-[#8E9399]', 'bg-[#585D63]', 'bg-[#374151]'],
}: GalleryCarouselProps) {
  // Ambil 1-5 gambar
  const actualImages = images && images.length > 0 ? images.slice(0, 5) : []

  const displayItems =
    actualImages.length > 0
      ? actualImages.map((url) => ({ type: 'image' as const, url }))
      : [{ type: 'placeholder' as const, label: 'Foto Belum Tersedia', color: placeholderColors[0] }]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const total = displayItems.length

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const diff = touchStartX.current - touchEndX.current
    if (diff > 40 && currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else if (diff < -40 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
    touchStartX.current = 0
    touchEndX.current = 0
  }

  return (
    <div className="w-full">

      <div
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/8] lg:aspect-[21/9] rounded-2xl mob-l:rounded-3xl overflow-hidden bg-gray-100 border border-gray-200/60 shadow-sm select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex w-full h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {displayItems.map((item, idx) => (
            <div
              key={idx}
              className="w-full h-full shrink-0 relative cursor-pointer group"
              onClick={() => {
                if (item.type === 'image') {
                  setLightboxOpen(true)
                }
              }}
            >
              {item.type === 'image' ? (
                <>
                  <img
                    src={item.url}
                    alt={`Galeri ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                </>
              ) : (
                <div className={`w-full h-full ${item.color} flex items-center justify-center`}>
                  <span className="text-xs text-white/90 font-medium px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm">
                    {item.label}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 bg-black/35 backdrop-blur-md px-3 py-1.5 rounded-full z-10">
            {displayItems.map((_, idx) => {
              const isActive = idx === currentIndex
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentIndex(idx)
                  }}
                  aria-label={`Lihat gambar ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${isActive ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                    }`}
                />
              )
            })}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-[150] flex flex-col items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
            aria-label="Tutup detail gambar"
          >
            <X className="w-6 h-6" />
          </button>

          {total > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1))
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
                aria-label="Gambar sebelumnya"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0))
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
                aria-label="Gambar berikutnya"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            className="max-w-4xl max-h-[80vh] w-full flex items-center justify-center overflow-hidden rounded-2xl animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            {displayItems[currentIndex]?.type === 'image' && (
              <img
                src={displayItems[currentIndex].url}
                alt={`Detail Galeri ${currentIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
