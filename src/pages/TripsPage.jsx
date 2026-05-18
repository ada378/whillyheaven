import { Link } from "react-router-dom";
import { MapPin, Calendar, Users, Crown } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatRupees } from "../utils/currency";

export default function TripsPage() {
  const { bookings } = useApp();

  return (
    <div className="min-h-screen bg-gold-pale">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Header */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold/60 mb-1">Your Journey</p>
          <h1 className="text-3xl font-serif font-bold text-luxury">My Trips</h1>
          <div className="gold-divider w-24 mt-3" />
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-3xl border border-gold/20 bg-white/70 p-12 text-center shadow-gold">
            <Crown className="w-10 h-10 text-gold/40 mx-auto mb-4" />
            <p className="text-xl font-serif font-semibold text-luxury">No trips yet</p>
            <p className="mt-2 text-luxury/50 text-sm">Your booked stays will appear here.</p>
            <Link to="/" className="mt-6 inline-flex btn-gold rounded-2xl px-6 py-3 text-sm">
              Explore Stays
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, i) => (
              <div key={i} className="rounded-3xl border border-gold/20 bg-white/80 p-6 shadow-gold hover:shadow-gold-lg transition">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-serif font-semibold text-luxury">{booking.title}</h2>
                    <div className="flex items-center gap-1 mt-1 text-sm text-luxury/50">
                      <MapPin className="w-3.5 h-3.5 text-gold" />
                      {booking.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gold">{formatRupees(booking.totalPrice)}</p>
                    <div className="flex items-center gap-1 justify-end mt-1 text-xs text-luxury/50">
                      <Users className="w-3 h-3" /> {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
                <div className="gold-divider my-4" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-luxury/70">
                    <Calendar className="w-4 h-4 text-gold" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gold/60 font-bold">Check in</p>
                      <p>{booking.checkIn}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-luxury/70">
                    <Calendar className="w-4 h-4 text-gold" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gold/60 font-bold">Check out</p>
                      <p>{booking.checkOut}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
