import { useState } from "react";
import ListingCard from "../components/ListingCard";
import SkeletonCard from "../components/SkeletonCard";
import { useApp } from "../context/AppContext";

export default function HomePage({ selectedCategory }) {
  const { listings } = useApp();
  const [search, setSearch] = useState({ location: "", checkIn: "", checkOut: "", guests: "" });

  const filtered = selectedCategory === "all"
    ? listings
    : listings.filter((l) => l.category === selectedCategory);

  return (
    <section className="space-y-8">
      {/* Mini hero card below navbar */}
      <div className="rounded-[2rem] border border-gold/20 bg-luxury-2 p-6 shadow-gold-lg text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold/70">Luxury Travel Made Easy</p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gold-light">
              Discover premium stays in golden style.
            </h2>
            <p className="text-sm text-gold/70 max-w-md">
              Use the quick search below to explore curated properties, all wrapped in a refined golden theme.
            </p>
          </div>

          <form className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto] items-end" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-3 sm:col-span-2 lg:col-span-1">
              <label className="block text-xs uppercase tracking-[0.2em] text-gold/60">Location</label>
              <input
                value={search.location}
                onChange={(e) => setSearch({ ...search, location: e.target.value })}
                className="w-full rounded-2xl border border-gold/30 bg-[#1c2430] px-4 py-3 text-sm text-white outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                placeholder="Search destination"
              />
            </div>

            <div className="space-y-3 sm:col-span-1">
              <label className="block text-xs uppercase tracking-[0.2em] text-gold/60">Check-in</label>
              <input
                type="date"
                value={search.checkIn}
                onChange={(e) => setSearch({ ...search, checkIn: e.target.value })}
                className="w-full rounded-2xl border border-gold/30 bg-[#1c2430] px-4 py-3 text-sm text-white outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </div>

            <div className="space-y-3 sm:col-span-1">
              <label className="block text-xs uppercase tracking-[0.2em] text-gold/60">Check-out</label>
              <input
                type="date"
                value={search.checkOut}
                onChange={(e) => setSearch({ ...search, checkOut: e.target.value })}
                className="w-full rounded-2xl border border-gold/30 bg-[#1c2430] px-4 py-3 text-sm text-white outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </div>

            <div className="space-y-3 sm:col-span-1">
              <label className="block text-xs uppercase tracking-[0.2em] text-gold/60">Guests</label>
              <input
                type="number"
                min="1"
                value={search.guests}
                onChange={(e) => setSearch({ ...search, guests: e.target.value })}
                className="w-full rounded-2xl border border-gold/30 bg-[#1c2430] px-4 py-3 text-sm text-white outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                placeholder="1"
              />
            </div>

            <button
              type="submit"
              className="sm:col-span-2 lg:col-span-1 rounded-2xl bg-gradient-to-r from-gold via-gold-light to-gold-dark px-6 py-3 text-sm font-semibold text-luxury shadow-gold transition hover:opacity-95"
            >
              Search stays
            </button>
          </form>
        </div>
      </div>

      {/* Hero heading */}
      <div className="space-y-2 pt-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold/60">Curated Luxury Stays</p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-luxury leading-tight">
          Find Your Perfect <span className="gold-text">Escape</span>
        </h1>
        <p className="text-luxury/60 max-w-xl text-sm sm:text-base">
          Handpicked villas, heritage havelis, and extraordinary stays across India and beyond.
        </p>
        <div className="gold-divider w-32 mt-3" />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <SkeletonCard count={8} />
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((listing) => (
            <ListingCard key={listing._id ?? listing.id} listing={listing} />
          ))}
        </div>
      )}
    </section>
  );
}
