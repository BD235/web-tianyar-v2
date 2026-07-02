'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

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

const BALI_BOUNDS: L.LatLngBoundsExpression = [
  [-8.850, 114.400], // South West
  [-8.050, 115.750]  // North East
]

interface LocationPickerMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  position: { lat: number, lng: number } | null;
}

function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function MapUpdater({ position }: { position: {lat: number, lng: number} | null }) {
  const map = useMapEvents({})
  useEffect(() => {
    if (position && !isNaN(position.lat) && !isNaN(position.lng)) {
      map.flyTo([position.lat, position.lng], map.getZoom(), { animate: true, duration: 1 })
    }
  }, [position, map])
  return null
}

export default function LocationPickerMap({ onLocationSelect, position }: LocationPickerMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-full h-full bg-gray-100 flex items-center justify-center animate-pulse"><span className="text-gray-400 font-medium">Memuat Peta...</span></div>
  }

  // Tianyar center
  const defaultCenter: L.LatLngExpression = [-8.218, 115.495]

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={position && !isNaN(position.lat) && !isNaN(position.lng) ? [position.lat, position.lng] : defaultCenter}
        zoom={14}
        minZoom={9}
        maxBounds={BALI_BOUNDS}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents onLocationSelect={onLocationSelect} />
        <MapUpdater position={position} />
        {position && !isNaN(position.lat) && !isNaN(position.lng) && (
          <Marker position={[position.lat, position.lng]} icon={customIcon} />
        )}
      </MapContainer>
    </div>
  )
}
