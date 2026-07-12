'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Destination } from '@/types'
import { Navigation, Info } from 'lucide-react'

// Fix for default marker icon in Leaflet + Next.js
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Bali approximate bounds
const BALI_BOUNDS: L.LatLngBoundsExpression = [
  [-8.850, 114.400], // South West
  [-8.050, 115.750]  // North East
]

interface MapComponentProps {
  destinations: Destination[]
  className?: string
  frameless?: boolean
}

// Controller agar peta langsung terbang/direct (flyTo) ke lokasi sesuai hasil pencarian
function MapController({ destinations }: { destinations: Destination[] }) {
  const map = useMap()

  useEffect(() => {
    if (!destinations || destinations.length === 0) return

    const size = map.getSize()
    if (!size || size.x <= 0 || size.y <= 0) return

    const validDests = destinations.filter(d => {
      const lat = Number(d.latitude)
      const lng = Number(d.longitude)
      return !isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng) && lat !== 0 && lng !== 0
    })
    if (validDests.length === 0) return

    if (validDests.length === 1) {
      const dest = validDests[0]
      const lat = Number(dest.latitude)
      const lng = Number(dest.longitude)

      const targetZoom = 16
      const point = map.project([lat, lng], targetZoom)
      // Geser proporsional ke atas supaya marker & popup card muncul lebih ke bawah secara aman di layar mobile maupun desktop
      const offsetY = Math.min(160, Math.floor(size.y * 0.22))
      const offsetPoint = L.point(point.x, point.y - offsetY)
      const targetLatLng = map.unproject(offsetPoint, targetZoom)

      map.flyTo(targetLatLng, targetZoom, {
        animate: true,
        duration: 1.2
      })
    } else {
      const points = validDests.map(d => [Number(d.latitude), Number(d.longitude)] as [number, number])
      const bounds = L.latLngBounds(points)
      if (bounds.isValid()) {
        const padY = Math.min(60, Math.floor(size.y * 0.12))
        const padX = Math.min(50, Math.floor(size.x * 0.1))
        map.flyToBounds(bounds, {
          padding: [padY, padX],
          maxZoom: 15,
          animate: true,
          duration: 1.2
        })
      }
    }
  }, [destinations, map])

  return null
}

export default function MapComponent({ 
  destinations, 
  className = "w-full h-[calc(100vh-160px)] min-h-[600px]",
  frameless = false
}: MapComponentProps) {
  const [mounted, setMounted] = useState(false)

  // Avoid SSR issues with window/leaflet
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={`${className} bg-gray-100 flex flex-col items-center justify-center rounded-3xl animate-pulse`}>
      <span className="text-gray-400 font-medium">Memuat Peta...</span>
    </div>
  }

  // Posisi awal peta agak kekiri atas sedikit
  const defaultCenter: L.LatLngExpression = [-8.218, 115.495]

  return (
    <div className={`${className} relative overflow-hidden ${frameless ? 'rounded-none border-none shadow-none' : 'rounded-3xl shadow-sm border border-gray-200'}`}>
      <MapContainer
        center={defaultCenter}
        zoom={14}
        minZoom={9}
        maxBounds={BALI_BOUNDS}
        maxBoundsViscosity={1.0}
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <MapController destinations={destinations} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {destinations.map((dest) => {
          const lat = Number(dest.latitude)
          const lng = Number(dest.longitude)
          if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) return null

          return (
            <Marker
              key={dest.id}
              position={[lat, lng]}
              icon={customIcon}
              ref={(markerRef) => {
                if (markerRef && destinations.length === 1) {
                  setTimeout(() => {
                    markerRef.openPopup()
                  }, 800)
                }
              }}
            >
              <Popup className="rounded-xl overflow-hidden custom-popup">
                <div className="w-[240px] flex flex-col gap-2 p-1.5">
                  <div
                    className="w-full h-[125px] bg-cover bg-center rounded-xl shadow-inner relative overflow-hidden"
                    style={{ backgroundImage: `url('${dest.images && dest.images.length > 0 ? dest.images[0] : 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800'}')` }}
                  >
                    {(dest as any).categories?.name && (
                      <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                        {(dest as any).categories?.name}
                      </span>
                    )}
                  </div>

                  <div className="px-0.5">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1">{dest.title}</h3>
                    {dest.description ? (
                      <p className="text-[11px] text-gray-600 leading-normal line-clamp-2 mt-1 font-normal">
                        {dest.description.replace(/<[^>]*>?/gm, '')}
                      </p>
                    ) : (
                      <p className="text-[11px] text-gray-400 italic mt-0.5 font-normal">
                        Destinasi wisata di Tianyar
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 mt-1.5">
                    <a
                      href={`/wisata/${dest.id}`}
                      className="flex-1 bg-white hover:bg-gray-50 !text-black text-xs font-medium py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition border border-gray-200 shadow-sm no-underline"
                    >
                      <Info className="w-3.5 h-3.5 !text-black stroke-[1.75] shrink-0" />
                      <span className="!text-black font-medium">Detail</span>
                    </a>
                    <a
                      href={dest.map_url || `https://maps.google.com/?q=${dest.latitude},${dest.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white hover:bg-blue-50/40 !text-blue-600 text-xs font-medium py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition border border-blue-200 shadow-sm no-underline"
                    >
                      <Navigation className="w-3.5 h-3.5 !text-blue-600 stroke-[1.75] shrink-0" />
                      <span className="!text-blue-600 font-medium">Rute</span>
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}

      </MapContainer>

      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 16px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
        .leaflet-popup-content {
          margin: 12px;
        }
        .leaflet-popup-close-button {
          margin-top: 4px !important;
          margin-right: 4px !important;
          background-color: white !important;
          border-radius: 100% !important;
          width: 24px !important;
          height: 24px !important;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: #333 !important;
        }
      `}</style>
    </div>
  )
}

