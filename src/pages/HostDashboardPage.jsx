import { useMemo, useState } from "react";
import { Pencil, Trash, Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatRupees } from "../utils/currency";

const emptyForm = {
  title: "",
  location: "",
  country: "",
  category: "trending",
  price: 0,
  rating: 4.5,
  reviews: 0,
  images: "",
  type: "Apartment",
  beds: 1,
  baths: 1,
  guests: 1,
  amenities: "WiFi, Kitchen",
  description: "",
};

function toList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function HostDashboardPage() {
  const { host, listings, createListing, updateListing, deleteListing } = useApp();
  const [activeId, setActiveId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isCreating, setIsCreating] = useState(true);

  const stats = useMemo(() => {
    const total = listings.length;
    const averagePrice = total === 0 ? 0 : Math.round(listings.reduce((sum, item) => sum + item.price, 0) / total);
    return { total, averagePrice };
  }, [listings]);

  const handleEdit = (listing) => {
    setActiveId(listing.id);
    setIsCreating(false);
    setForm({
      title: listing.title,
      location: listing.location,
      country: listing.country,
      category: listing.category,
      price: listing.price,
      rating: listing.rating,
      reviews: listing.reviews,
      images: listing.images.join(", "),
      type: listing.type,
      beds: listing.beds,
      baths: listing.baths,
      guests: listing.guests,
      amenities: listing.amenities.join(", "),
      description: listing.description,
    });
  };

  const handleCreate = () => {
    setActiveId(null);
    setIsCreating(true);
    setForm(emptyForm);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      title: form.title,
      location: form.location,
      country: form.country,
      category: form.category,
      price: Number(form.price),
      rating: Number(form.rating),
      reviews: Number(form.reviews),
      images: toList(form.images),
      type: form.type,
      beds: Number(form.beds),
      baths: Number(form.baths),
      guests: Number(form.guests),
      amenities: toList(form.amenities),
      description: form.description,
    };

    if (isCreating) {
      createListing(payload);
    } else if (activeId !== null) {
      updateListing(activeId, payload);
    }

    setActiveId(null);
    setIsCreating(true);
    setForm(emptyForm);
  };

  if (!host) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-bold">Host login required</h1>
        <p className="mt-4 text-gray-600">Please use the Host panel button in the navbar and enter your host ID and password first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin panel</h1>
        <p className="mt-2 text-gray-600">Manage your listed hotels and update place details from one dashboard.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <p className="text-sm text-gray-500">Total listings</p>
              <p className="mt-4 text-3xl font-semibold">{stats.total}</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <p className="text-sm text-gray-500">Avg. price</p>
              <p className="mt-4 text-3xl font-semibold">{formatRupees(stats.averagePrice)}</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <p className="text-sm text-gray-500">Current mode</p>
              <p className="mt-4 text-3xl font-semibold">{isCreating ? "Create" : "Edit"}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Listings</h2>
                <p className="text-sm text-gray-500">Click a listing to open its edit form.</p>
              </div>
              <button onClick={handleCreate} className="inline-flex items-center gap-2 rounded-2xl bg-airbnb px-4 py-2 text-sm font-semibold text-white hover:bg-airbnb-dark transition">
                <Plus className="w-4 h-4" /> New listing
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {listings.map((listing) => (
                <div key={listing.id} className="rounded-3xl border border-gray-200 p-4 hover:border-airbnb transition">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">{listing.title}</p>
                      <p className="text-sm text-gray-500">{listing.location}, {listing.country} • {listing.category}</p>
                      <p className="text-sm text-gray-500 mt-1">{formatRupees(listing.price)} / night</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(listing)} className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 transition">
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                      <button onClick={() => deleteListing(listing.id)} className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100 transition">
                        <Trash className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {listings.length === 0 && (
                <p className="text-sm text-gray-500">No listings found. Use the form to add a new place.</p>
              )}
            </div>
          </div>
        </section>

        <aside className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{isCreating ? "Create new listing" : "Edit listing"}</h2>
              <p className="text-sm text-gray-500">Update hotel and place information here.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm">
                Title
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-airbnb" required />
              </label>
              <label className="space-y-2 text-sm">
                Location
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-airbnb" required />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm">
                Country
                <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-airbnb" required />
              </label>
              <label className="space-y-2 text-sm">
                Category
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-airbnb" required />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm">
                Price per night
                <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-airbnb" required />
              </label>
              <label className="space-y-2 text-sm">
                Type
                <input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-airbnb" required />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="space-y-2 text-sm">
                Guests
                <input type="number" min="1" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-airbnb" required />
              </label>
              <label className="space-y-2 text-sm">
                Beds
                <input type="number" min="1" value={form.beds} onChange={(e) => setForm({ ...form, beds: e.target.value })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-airbnb" required />
              </label>
              <label className="space-y-2 text-sm">
                Baths
                <input type="number" min="1" value={form.baths} onChange={(e) => setForm({ ...form, baths: e.target.value })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-airbnb" required />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm">
                Images (comma-separated URLs)
                <input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-airbnb" />
              </label>
              <label className="space-y-2 text-sm">
                Amenities
                <input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-airbnb" />
              </label>
            </div>

            <label className="space-y-2 text-sm">
              Description
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="4" className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-airbnb" required />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" className="inline-flex items-center justify-center rounded-2xl bg-airbnb px-5 py-3 text-sm font-semibold text-white hover:bg-airbnb-dark transition">
                {isCreating ? "Create listing" : "Save changes"}
              </button>
              {!isCreating && (
                <button type="button" onClick={handleCreate} className="inline-flex items-center justify-center rounded-2xl border border-gray-200 px-5 py-3 text-sm font-semibold hover:bg-gray-50 transition">
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
}
