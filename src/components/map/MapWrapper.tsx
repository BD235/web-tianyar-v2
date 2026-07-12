'use client'

import dynamic from 'next/dynamic'
import { Destination } from '@/types'

// Load MapComponent dynamically with ssr: false inside a Client Component wrapper
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[450px] bg-gray-50 flex flex-col items-center justify-center rounded-3xl animate-pulse border border-gray-100">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
      <span className="text-gray-500 font-medium">Memuat Peta Interaktif...</span>
    </div>
  )
})

export default function MapWrapper({ 
  destinations, 
  className,
  frameless = false
}: { 
  destinations: Destination[]
  className?: string
  frameless?: boolean
}) {
  return <MapComponent destinations={destinations} className={className} frameless={frameless} />
}

