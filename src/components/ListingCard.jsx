import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatRupees } from "../utils/currency";

export default function ListingCard({ listing }) {
  const { wishlist, toggleWishlist } = useApp();
  const [imgIdx, setImgIdx] = useState(0);
  const isFav = wishlist.includes(listing.id);

  const prev = (e) => { e.preventDefault(); setImgIdx((i) => (i === 0 ? listing.images.length - 1 : i - 1)); };
  const next = (e) => { e.preventDefault(); setImgIdx((i) => (i === listing.images.length - 1 ? 0 : i + 1)); };

  return (
    <div className="group">
      <Link to={`/listing/${listing.id}`}>
        <div className="relative rounded-2xl overflow-hidden aspect-square bg-gray-100">
          <img
            src={listing.images[imgIdx]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          {/* Nav arrows */}
          {listing.images.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition">
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {listing.images.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition ${i === imgIdx ? "bg-white" : "bg-white/50"}`} />
                ))}
              </div>
            </>
          )}
          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(listing.id); }}
            className="absolute top-3 right-3 p-1"
          >
            <Heart className={`w-5 h-5 transition ${isFav ? "fill-airbnb stroke-airbnb" : "fill-black/20 stroke-white"}`} />
          </button>
          {listing.host?.superhost && (
            <div className="absolute top-3 left-3 bg-white text-xs font-semibold px-2 py-1 rounded-full">
              Superhost
            </div>
          )}
        </div>
        <div className="mt-2 px-1">
          <div className="flex justify-between items-start">
            <p className="font-semibold text-sm truncate">{listing.location}</p>
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-sm">{listing.rating}</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm truncate">{listing.type}</p>
          <p className="text-sm mt-1">
            <span className="font-semibold">{formatRupees(listing.price)}</span>
            <span className="text-gray-500"> night</span>
          </p>
        </div>
      </Link>
    </div>
  );
}
