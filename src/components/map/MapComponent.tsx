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
}

export default function MapComponent({ destinations, className = "w-full h-[calc(100vh-160px)] min-h-[600px]" }: MapComponentProps) {
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
    <div className={`${className} relative rounded-3xl overflow-hidden shadow-sm border border-gray-200`}>
      <MapContainer
        center={defaultCenter}
        zoom={14}
        minZoom={9}
        maxBounds={BALI_BOUNDS}
        maxBoundsViscosity={1.0}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {destinations.map((dest) => {
          if (!dest.latitude || !dest.longitude) return null
          
          return (
            <Marker 
              key={dest.id} 
              position={[Number(dest.latitude), Number(dest.longitude)]}
              icon={customIcon}
            >
              <Popup className="rounded-xl overflow-hidden custom-popup">
                <div className="w-[220px] flex flex-col gap-2 p-1">
                  <div 
                    className="w-full h-[120px] bg-cover bg-center rounded-lg shadow-inner"
                    style={{ backgroundImage: `url('${dest.images && dest.images.length > 0 ? dest.images[0] : 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800'}')` }}
                  />
                  
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{dest.title}</h3>
                    <p className="text-xs text-blue-600 font-semibold mt-0.5">
                      {(dest as any).categories?.name || 'Wisata'}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <a 
                      href={`/wisata/${dest.id}`}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition"
                    >
                      <Info className="w-3.5 h-3.5" />
                      Detail
                    </a>
                    <a 
                      href={dest.map_url || `https://maps.google.com/?q=${dest.latitude},${dest.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition shadow-md shadow-blue-200"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Rute
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
