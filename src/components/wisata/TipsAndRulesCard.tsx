import { CheckCircle2 } from 'lucide-react'

interface TipsAndRulesCardProps {
  content?: string | null
}

export default function TipsAndRulesCard({ content }: TipsAndRulesCardProps) {
  const text = content && content.trim()
    ? content.trim()
    : 'Jaga kebersihan lingkungan.\nGunakan pakaian yang sopan & nyaman.\nPatuhi petunjuk petugas di lokasi.'

  // Parsing tips per baris
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim().replace(/^[•\-\*]\s*/, ''))
    .filter(line => line.length > 0)

  return (
    <div className="w-full">

      <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
        Tips
      </h2>

      <div className="bg-[#F0F3F7] rounded-2xl mob-l:rounded-3xl p-5 mob-l:p-6">
        <div className="space-y-3">
          {lines.map((line, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 mob-l:w-5 mob-l:h-5 text-[#8A95A2] shrink-0 mt-0.5" />
              <p className="text-xs mob-l:text-sm font-medium text-gray-700 leading-relaxed text-left">
                {line}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
