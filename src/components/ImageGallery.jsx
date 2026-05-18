import { useState } from 'react'
import { X, Grid } from 'lucide-react'

export default function ImageGallery({ images = [], title = '' }) {
  const [showAll, setShowAll] = useState(false)

  // Ensure we always have at least one image
  const imgs = images.length > 0 ? images : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800']

  return (
    <>
      {/* Main gallery grid */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[480px]">
          {/* Large first image */}
          <div className="col-span-2 row-span-2 overflow-hidden">
            <img
              src={imgs[0]}
              alt={title}
              className="w-full h-full object-cover hover:brightness-95 transition cursor-pointer"
              loading="eager"
              onClick={() => setShowAll(true)}
            />
          </div>
          {/* 4 thumbnails */}
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="overflow-hidden">
              {imgs[idx] ? (
                <img
                  src={imgs[idx]}
                  alt={`${title} ${idx + 1}`}
                  className="w-full h-full object-cover hover:brightness-95 transition cursor-pointer"
                  loading="lazy"
                  onClick={() => setShowAll(true)}
                />
              ) : (
                <div className="w-full h-full bg-gray-100" />
              )}
            </div>
          ))}
        </div>

        {/* Show all photos button */}
        <button
          onClick={() => setShowAll(true)}
          className="absolute bottom-4 right-4 flex items-center gap-2 bg-white border border-gray-800 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition shadow-sm"
        >
          <Grid className="w-4 h-4" />
          Show all photos
        </button>
      </div>

      {/* Full-screen modal */}
      {showAll && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{title}</h2>
              <button
                onClick={() => setShowAll(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
                aria-label="Close gallery"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {imgs.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${title} ${i + 1}`}
                  className="w-full rounded-2xl object-cover aspect-video"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
