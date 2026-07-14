'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface DescriptionToggleProps {
  text: string
}

export default function DescriptionToggle({ text }: DescriptionToggleProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const maxLength = 160

  if (!text) return null

  const shouldTruncate = text.length > maxLength

  return (
    <div className="w-full">
      <p className={`text-gray-600 text-sm leading-relaxed text-justify ${shouldTruncate && !isExpanded ? 'line-clamp-4' : ''}`}>
        {text}
      </p>

      {shouldTruncate && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ width: 'fit-content', maxWidth: '100%' }}
          className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span className="whitespace-nowrap">
            {isExpanded ? 'Show less' : 'Read more'}
          </span>
          {isExpanded
            ? <ChevronUp className="w-4 h-4 shrink-0" />
            : <ChevronDown className="w-4 h-4 shrink-0" />
          }
        </button>
      )}
    </div>
  )
}
