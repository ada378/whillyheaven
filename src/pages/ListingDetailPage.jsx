import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Heart, Crown } from "lucide-react";
import { useApp } from "../context/AppContext";
import ImageGallery from "../components/ImageGallery";
import { formatRupees } from "../utils/currency";

export default function ListingDetailPage() {
  const { listings, wishlist, toggleWishlist, addBooking, showToast, searchParams } = useApp();
  const { id } = useParams();
  const listingId = Number(id);
  const listing   = listings.find((item) => (item._id ?? item.id) === listingId || String(item._id ?? item.id) === id);
  const [checkIn,  setCheckIn]  = useState(searchParams.checkIn  || "");
  const [checkOut, setCheckOut] = useState(searchParams.checkOut || "");
  const [guests,   setGuests]   = useState(searchParams.guests   || 1);

  if (!listing) {
    return (
      <div className="min-h-screen bg-gold-pale flex flex-col items-center justify-center px-6 py-12">
        <Crown className="w-12 h-12 text-gold mb-4" />
        <p className="text-xl font-serif font-bold text-luxury mb-2">Listing not found</p>
        <Link to="/" className="text-gold font-semibold underline">Return to home</Link>
      </div>
    );
  }

  const lid        = listing._id ?? listing.id;
  const isFavorite = wishlist.includes(lid);
  const totalDays  = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86_400_000))
    : 1;
  const totalPrice = listing.price * totalDays;

  const handleBook = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) { showToast("Please select check-in and check-out dates.", "error"); return; }
    addBooking({ listingId: lid, title: listing.title, location: listing.location, checkIn, checkOut, guests, totalPrice });
    showToast("✦ Your luxury stay is booked!", "success");
  };

  return (
    <div className="min-h-screen bg-gold-pale">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-gold" />
              <p className="text-sm text-gold/70 font-medium">{listing.location}</p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-luxury leading-tight">{listing.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-4 h-4 fill-gold text-gold" />
              <span className="text-sm font-semibold text-luxury">{listing.rating}</span>
              <span className="text-sm text-luxury/50">· {listing.reviews} reviews</span>
            </div>
            <p className="mt-3 text-luxury/70 max-w-2xl leading-relaxed">{listing.description}</p>
          </div>
          <button
            onClick={() => toggleWishlist(lid)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
              isFavorite
                ? "border-gold bg-gold/10 text-gold"
                : "border-gold/30 text-luxury/60 hover:border-gold hover:text-gold"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-gold stroke-gold" : "stroke-current"}`} />
            {isFavorite ? "Saved" : "Save"}
          </button>
        </div>

        {/* Gallery */}
        <ImageGallery images={listing.images} title={listing.title} />

        {/* Body */}
        <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">

          {/* Left */}
          <section className="space-y-6">

            {/* Host */}
            <div className="rounded-3xl border border-gold/20 bg-white/60 backdrop-blur-sm p-6 shadow-gold">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-serif font-semibold text-luxury">
                    Hosted by {listing.host?.name ?? "Host"}
                  </h2>
                  <p className="text-sm text-luxury/50 mt-0.5">Joined {listing.host?.joined ?? "recently"}</p>
                </div>
                {(listing.host?.superhost || listing.host?.isSuperhost) && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-gold border border-gold/30 rounded-full px-3 py-1">
                    <Crown className="w-3 h-3" /> Superhost
                  </span>
                )}
              </div>
            </div>

            {/* Details + Location */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-gold/20 bg-white/60 p-6 shadow-gold">
                <h3 className="font-serif font-semibold text-luxury mb-3">Details</h3>
                <div className="space-y-1 text-sm text-luxury/70">
                  <p>{listing.type}</p>
                  <p>{listing.beds} beds · {listing.baths} baths · {listing.guests} guests max</p>
                </div>
              </div>
              <div className="rounded-3xl border border-gold/20 bg-white/60 p-6 shadow-gold">
                <h3 className="font-serif font-semibold text-luxury mb-3">Location</h3>
                <div className="flex items-start gap-2 text-sm text-luxury/70">
                  <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                  <span>{listing.location}, {listing.country}</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="rounded-3xl border border-gold/20 bg-white/60 p-6 shadow-gold">
              <h3 className="font-serif font-semibold text-luxury mb-4">Amenities</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {listing.amenities?.map((a) => (
                  <span key={a} className="flex items-center gap-2 rounded-2xl bg-gold-muted border border-gold/20 px-3 py-2 text-sm text-luxury/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Booking Widget */}
          <aside className="lg:sticky lg:top-24 self-start rounded-3xl border border-gold/30 bg-white/80 backdrop-blur-sm p-6 shadow-gold-lg">
            {/* Price */}
            <div className="mb-6">
              <p className="text-2xl font-serif font-bold text-luxury">{formatRupees(listing.price)}</p>
              <p className="text-sm text-luxury/50">per night</p>
            </div>

            <div className="gold-divider mb-6" />

            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gold/70 mb-2">Check in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full rounded-2xl border border-gold/30 bg-gold-pale px-4 py-3 text-sm text-luxury outline-none focus:border-gold transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gold/70 mb-2">Check out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full rounded-2xl border border-gold/30 bg-gold-pale px-4 py-3 text-sm text-luxury outline-none focus:border-gold transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gold/70 mb-2">Guests</label>
                <input
                  type="number"
                  min="1"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full rounded-2xl border border-gold/30 bg-gold-pale px-4 py-3 text-sm text-luxury outline-none focus:border-gold transition"
                />
              </div>

              {/* Price breakdown */}
              <div className="rounded-2xl bg-gold-muted border border-gold/20 p-4 space-y-2 text-sm">
                <div className="flex justify-between text-luxury/70">
                  <span>{formatRupees(listing.price)} × {totalDays} night{totalDays > 1 ? "s" : ""}</span>
                  <span>{formatRupees(listing.price * totalDays)}</span>
                </div>
                <div className="gold-divider" />
                <div className="flex justify-between font-bold text-luxury">
                  <span>Total</span>
                  <span className="text-gold">{formatRupees(totalPrice)}</span>
                </div>
              </div>

              <button type="submit" className="btn-gold w-full py-3.5 rounded-2xl text-sm tracking-wide">
                ✦ Reserve Now
              </button>
            </form>
          </aside>
        </div>
      </div>
    </div>
  );
}
