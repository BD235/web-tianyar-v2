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
  const displayText = shouldTruncate && !isExpanded ? text.slice(0, maxLength) + ' ....' : text

  return (
    <div className="space-y-2">
      <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify">
        {displayText}
      </p>
      {shouldTruncate && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 transition-colors"
        >
          <span>{isExpanded ? 'Show less' : 'Read more'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      )}
    </div>
  )
}
