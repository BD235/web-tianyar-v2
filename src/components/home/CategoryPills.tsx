'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CategoryPills({ categories = [] }: { categories?: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentCategory = searchParams.get('category') || 'all'

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug === 'all') {
      params.delete('category')
    } else {
      params.set('category', slug)
    }
    params.delete('page') // Reset paginasi

    // Target route default
    let targetPath = pathname
    if (pathname === '/home' || pathname === '/') {
      targetPath = '/destinasi'
    }

    router.push(`${targetPath}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
      <button
        onClick={() => handleCategoryClick('all')}
        className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm transition-all font-medium ${currentCategory === 'all'
            ? 'bg-[#F0F5FF] text-[#196EEE]'
            : 'text-gray-400 hover:text-gray-600 bg-transparent'
          }`}
      >
        Semua
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleCategoryClick(cat.slug)}
          className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm transition-all font-medium ${currentCategory === cat.slug
              ? 'bg-[#F0F5FF] text-[#196EEE]'
              : 'text-gray-400 hover:text-gray-600 bg-transparent'
            }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
