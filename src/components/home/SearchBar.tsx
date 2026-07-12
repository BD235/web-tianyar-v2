'use client'

import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

interface SearchBarProps {
  placeholder?: string
  className?: string
}

export default function SearchBar({ placeholder = "Find things to do", className = "w-full max-w-md" }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim()) {
      params.set('q', query.trim())
    } else {
      params.delete('q')
    }
    params.delete('page') // Reset pagination on new search

    let targetPath = pathname
    if (pathname === '/home' || pathname === '/') {
      targetPath = '/destinasi'
    }
    router.push(`${targetPath}?${params.toString()}`)
  }

  const handleClear = () => {
    setQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    params.delete('page')

    let targetPath = pathname
    if (pathname === '/home' || pathname === '/') {
      targetPath = '/destinasi'
    }
    router.push(`${targetPath}?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" strokeWidth={2.5} />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#F4F7FE] text-gray-700 rounded-full py-3.5 pl-11 pr-10 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  )
}

