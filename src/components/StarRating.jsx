import { Star } from 'lucide-react'

/**
 * Renders 1–5 stars.
 * - Supports decimal ratings (e.g. 4.7 → 4 full + 1 partial)
 * - Interactive mode: clicking a star calls onChange(n)
 */
export default function StarRating({
  rating = 0,
  size = 'sm',
  interactive = false,
  onChange,
}) {
  const sizeClass = size === 'md' ? 'w-5 h-5' : 'w-3.5 h-3.5'
  const filled = Math.floor(rating)
  const partial = rating - filled

  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const isFull = i < filled
        const isPartial = i === filled && partial > 0

        return (
          <span
            key={i}
            className={`relative inline-block ${interactive ? 'cursor-pointer' : ''}`}
            onClick={() => interactive && onChange?.(i + 1)}
          >
            {/* Background (empty) star */}
            <Star className={`${sizeClass} text-gray-300`} />
            {/* Filled overlay */}
            {(isFull || isPartial) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: isFull ? '100%' : `${partial * 100}%` }}
              >
                <Star className={`${sizeClass} fill-gray-800 text-gray-800`} />
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}
