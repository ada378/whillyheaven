import { useApp } from "../context/AppContext";
import { formatRupees } from "../utils/currency";

export default function TripsPage() {
  const { bookings } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Trips</h1>
        <p className="mt-2 text-gray-600">Review your upcoming and past trips here.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-xl font-semibold">No trips yet</p>
          <p className="mt-3 text-gray-600">Book a stay and it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.listingId + booking.checkIn} className="rounded-3xl border border-gray-200 p-6 bg-white shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
                <div>
                  <h2 className="text-xl font-semibold">{booking.title}</h2>
                  <p className="text-sm text-gray-600">{booking.location}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatRupees(booking.totalPrice)}</p>
                  <p className="text-sm text-gray-500">{booking.guests} guest{booking.guests > 1 ? "s" : ""}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm text-gray-600">
                <div>
                  <p className="font-semibold">Check in</p>
                  <p>{booking.checkIn}</p>
                </div>
                <div>
                  <p className="font-semibold">Check out</p>
                  <p>{booking.checkOut}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
