import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useApp } from "../context/AppContext";
import ListingCard from "../components/ListingCard";

export default function WishlistPage() {
  const { wishlist, listings } = useApp();
  const items = listings.filter((l) => wishlist.includes(l._id ?? l.id));

  return (
    <div className="min-h-screen bg-gold-pale">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Header */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold/60 mb-1">Saved Places</p>
          <h1 className="text-3xl font-serif font-bold text-luxury">Your Wishlist</h1>
          <div className="gold-divider w-24 mt-3" />
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-gold/20 bg-white/70 p-12 text-center shadow-gold">
            <Heart className="w-10 h-10 text-gold/30 mx-auto mb-4" />
            <p className="text-xl font-serif font-semibold text-luxury">Nothing saved yet</p>
            <p className="mt-2 text-luxury/50 text-sm">Tap the heart on any listing to save it here.</p>
            <Link to="/" className="mt-6 inline-flex btn-gold rounded-2xl px-6 py-3 text-sm">
              Browse Stays
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((listing) => (
              <ListingCard key={listing._id ?? listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
