import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatRupees } from "../utils/currency";

function ListingCard({ listing }) {
  const { wishlist, toggleWishlist } = useApp();
  const [imgIdx, setImgIdx] = useState(0);
  const id    = listing._id ?? listing.id;
  const isFav = wishlist.includes(id);
  const isSuperhost = listing.host?.isSuperhost ?? listing.host?.superhost ?? false;

  const prev = (e) => { e.preventDefault(); setImgIdx((i) => (i === 0 ? listing.images.length - 1 : i - 1)); };
  const next = (e) => { e.preventDefault(); setImgIdx((i) => (i === listing.images.length - 1 ? 0 : i + 1)); };

  return (
    <div className="group luxury-card">
      <Link to={`/listing/${id}`}>
        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden aspect-square bg-luxury-3 border border-gold/10">
          <img
            src={listing.images[imgIdx]}
            alt={listing.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-luxury/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

          {/* Arrows */}
          {listing.images.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-luxury/80 border border-gold/30 rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition">
                <ChevronLeft className="w-3.5 h-3.5 text-gold" />
              </button>
              <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-luxury/80 border border-gold/30 rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition">
                <ChevronRight className="w-3.5 h-3.5 text-gold" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {listing.images.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition ${i === imgIdx ? "bg-gold" : "bg-gold/30"}`} />
                ))}
              </div>
            </>
          )}

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(id); }}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-luxury/60 border border-gold/20 backdrop-blur-sm"
          >
            <Heart className={`w-4 h-4 transition ${isFav ? "fill-gold stroke-gold" : "fill-transparent stroke-gold/70"}`} />
          </button>

          {/* Superhost badge */}
          {isSuperhost && (
            <div className="absolute top-3 left-3 bg-luxury/80 border border-gold/40 text-gold text-[10px] font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
              ✦ Superhost
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-3 px-1 space-y-0.5">
          <div className="flex justify-between items-start gap-2">
            <p className="font-semibold text-sm text-gold truncate leading-snug">{listing.location}</p>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-3 h-3 fill-gold text-gold" />
              <span className="text-xs text-gold">{listing.rating}</span>
            </div>
          </div>
          <p className="text-gold/80 text-xs truncate">{listing.type}</p>
          <p className="text-sm mt-1">
            <span className="font-bold text-gold">{formatRupees(listing.price)}</span>
            <span className="text-gold/80 text-xs"> / night</span>
          </p>
        </div>
      </Link>
    </div>
  );
}

export default memo(ListingCard);
