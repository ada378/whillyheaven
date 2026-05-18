import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Heart } from "lucide-react";
import { useApp } from "../context/AppContext";
import ImageGallery from "../components/ImageGallery";
import { formatRupees } from "../utils/currency";

export default function ListingDetailPage() {
  const { listings, wishlist, toggleWishlist, addBooking, showToast, searchParams } = useApp();
  const { id } = useParams();
  const listingId = Number(id);
  const listing = listings.find((item) => item.id === listingId);
  const [checkIn, setCheckIn] = useState(searchParams.checkIn || "");
  const [checkOut, setCheckOut] = useState(searchParams.checkOut || "");
  const [guests, setGuests] = useState(searchParams.guests || 1);

  if (!listing) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-center text-xl font-semibold">Listing not found.</p>
        <div className="text-center mt-4">
          <Link to="/" className="text-airbnb font-semibold">Return to home</Link>
        </div>
      </div>
    );
  }

  const isFavorite = wishlist.includes(listing.id);
  const totalDays = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))) : 1;
  const totalPrice = listing.price * totalDays;

  const handleBook = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      showToast("Please select check-in and check-out dates.", "error");
      return;
    }
    addBooking({
      listingId: listing.id,
      title: listing.title,
      location: listing.location,
      checkIn,
      checkOut,
      guests,
      totalPrice,
    });
    showToast("Your trip is booked!", "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-gray-500">{listing.location}</p>
          <h1 className="text-3xl font-bold mt-1">{listing.title}</h1>
          <p className="mt-3 text-gray-600 max-w-2xl">{listing.description}</p>
        </div>
        <button
          onClick={() => toggleWishlist(listing.id)}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50 transition"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-airbnb stroke-airbnb" : "stroke-current"}`} />
          {isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        </button>
      </div>

      <ImageGallery images={listing.images} />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-gray-200 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Hosted by {listing.host?.name ?? "Host"}</h2>
                <p className="text-sm text-gray-500">Joined {listing.host?.joined ?? "recently"}</p>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Star className="w-4 h-4 text-airbnb" />
                <span>{listing.rating} · {listing.reviews} reviews</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 p-6">
              <h3 className="font-semibold">Details</h3>
              <p className="mt-3 text-sm text-gray-600">{listing.type} · {listing.beds} beds · {listing.baths} baths · {listing.guests} guests</p>
            </div>
            <div className="rounded-3xl border border-gray-200 p-6">
              <h3 className="font-semibold">Location</h3>
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600"><MapPin className="w-4 h-4" />{listing.location}, {listing.country}</div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 p-6">
            <h3 className="font-semibold">Amenities</h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {listing.amenities.map((amenity) => (
                <span key={amenity} className="rounded-2xl bg-gray-100 px-3 py-2 text-sm text-gray-700">{amenity}</span>
              ))}
            </div>
          </div>
        </section>

        <aside className="rounded-3xl border border-gray-200 p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold">{formatRupees(listing.price)}</p>
              <p className="text-sm text-gray-500">per night</p>
            </div>
          </div>

          <form onSubmit={handleBook} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Check in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-airbnb"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Check out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-airbnb"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Guests</label>
              <input
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-airbnb"
              />
            </div>
            <div className="rounded-3xl bg-gray-50 p-4 text-sm text-gray-700">
              <div className="flex items-center justify-between"><span>Estimated total</span><span className="font-semibold">{formatRupees(totalPrice)}</span></div>
            </div>
            <button type="submit" className="w-full rounded-2xl bg-airbnb px-4 py-3 text-sm font-semibold text-white hover:bg-airbnb-dark transition">
              Reserve
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
