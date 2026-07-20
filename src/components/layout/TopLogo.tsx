'use client'

import Link from 'next/link'

export default function TopLogo() {
  return (
    <div className="fixed top-3 left-0 right-0 z-50 hidden md:block pointer-events-none h-[64px]">
      <div className="max-w-7xl mx-auto px-6 w-full h-full flex items-center">
        <Link href="/home" className="pointer-events-auto relative z-50 inline-flex items-center">
          <span className="font-logo text-3xl font-normal text-gray-900 drop-shadow-sm transition-colors cursor-pointer">
            Tianyar
          </span>
        </Link>
      </div>
    </div>
  )
}
