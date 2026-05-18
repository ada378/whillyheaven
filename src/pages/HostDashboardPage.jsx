import { useMemo, useState } from "react";
import { Pencil, Trash, Plus, Crown, BarChart2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatRupees } from "../utils/currency";

const emptyForm = {
  title: "", location: "", country: "", category: "india",
  price: 0, rating: 4.5, reviews: 0, images: "",
  type: "Apartment", beds: 1, baths: 1, guests: 1,
  amenities: "WiFi, Kitchen", description: "",
};

const toList = (v) => v.split(",").map((s) => s.trim()).filter(Boolean);

export default function HostDashboardPage() {
  const { host, listings, createListing, updateListing, deleteListing } = useApp();
  const [activeId,   setActiveId]   = useState(null);
  const [form,       setForm]       = useState(emptyForm);
  const [isCreating, setIsCreating] = useState(true);

  const stats = useMemo(() => ({
    total: listings.length,
    avgPrice: listings.length === 0 ? 0 : Math.round(listings.reduce((s, l) => s + l.price, 0) / listings.length),
  }), [listings]);

  const handleEdit = (l) => {
    setActiveId(l.id); setIsCreating(false);
    setForm({ title: l.title, location: l.location, country: l.country, category: l.category,
      price: l.price, rating: l.rating, reviews: l.reviews, images: l.images.join(", "),
      type: l.type, beds: l.beds, baths: l.baths, guests: l.guests,
      amenities: l.amenities.join(", "), description: l.description });
  };

  const handleCreate = () => { setActiveId(null); setIsCreating(true); setForm(emptyForm); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), rating: Number(form.rating),
      reviews: Number(form.reviews), beds: Number(form.beds), baths: Number(form.baths),
      guests: Number(form.guests), images: toList(form.images), amenities: toList(form.amenities) };
    isCreating ? createListing(payload) : updateListing(activeId, payload);
    handleCreate();
  };

  if (!host) {
    return (
      <div className="min-h-screen bg-gold-pale flex flex-col items-center justify-center px-6 py-12 text-center">
        <Crown className="w-12 h-12 text-gold/40 mb-4" />
        <h1 className="text-2xl font-serif font-bold text-luxury">Host Access Required</h1>
        <p className="mt-3 text-luxury/50 text-sm max-w-sm">Use the Host panel button in the navbar and enter your credentials.</p>
      </div>
    );
  }

  const inputCls = "w-full rounded-2xl border border-gold/30 bg-gold-pale px-4 py-3 text-sm text-luxury outline-none focus:border-gold transition";
  const labelCls = "block text-xs font-bold uppercase tracking-wider text-gold/70 mb-1.5";

  return (
    <div className="min-h-screen bg-gold-pale">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Header */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold/60 mb-1">Management</p>
          <h1 className="text-3xl font-serif font-bold text-luxury">Host Dashboard</h1>
          <div className="gold-divider w-24 mt-3" />
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total Listings", value: stats.total },
            { label: "Avg. Price / Night", value: formatRupees(stats.avgPrice) },
            { label: "Mode", value: isCreating ? "Create" : "Edit" },
          ].map((s) => (
            <div key={s.label} className="rounded-3xl border border-gold/20 bg-white/80 p-6 shadow-gold">
              <div className="flex items-center gap-2 mb-3">
                <BarChart2 className="w-4 h-4 text-gold" />
                <p className="text-xs font-bold uppercase tracking-wider text-gold/60">{s.label}</p>
              </div>
              <p className="text-2xl font-serif font-bold text-luxury">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">

          {/* Listings list */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-semibold text-xl text-luxury">All Listings</h2>
              <button onClick={handleCreate} className="btn-gold inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm">
                <Plus className="w-4 h-4" /> New
              </button>
            </div>

            <div className="space-y-3">
              {listings.map((l) => (
                <div key={l.id} className="rounded-3xl border border-gold/20 bg-white/80 p-4 shadow-gold hover:border-gold/50 transition">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-luxury">{l.title}</p>
                      <p className="text-xs text-luxury/50 mt-0.5">{l.location}, {l.country} · {l.category}</p>
                      <p className="text-sm font-bold text-gold mt-1">{formatRupees(l.price)} / night</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(l)} className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 px-3 py-1.5 text-xs text-gold hover:bg-gold/10 transition">
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button onClick={() => deleteListing(l.id)} className="inline-flex items-center gap-1.5 rounded-full border border-red-300/50 px-3 py-1.5 text-xs text-red-400 hover:bg-red-50/50 transition">
                        <Trash className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {listings.length === 0 && (
                <p className="text-sm text-luxury/40 text-center py-8">No listings yet. Create your first one →</p>
              )}
            </div>
          </section>

          {/* Form */}
          <aside className="rounded-3xl border border-gold/20 bg-white/80 p-6 shadow-gold-lg self-start sticky top-24">
            <h2 className="font-serif font-semibold text-xl text-luxury mb-5">
              {isCreating ? "Create Listing" : "Edit Listing"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={labelCls}>Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} required /></div>
                <div><label className={labelCls}>Location</label><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputCls} required /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={labelCls}>Country</label><input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inputCls} required /></div>
                <div><label className={labelCls}>Category</label><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls} required /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={labelCls}>Price / night (₹)</label><input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} required /></div>
                <div><label className={labelCls}>Type</label><input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputCls} required /></div>
              </div>
              <div className="grid gap-4 grid-cols-3">
                <div><label className={labelCls}>Guests</label><input type="number" min="1" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} className={inputCls} required /></div>
                <div><label className={labelCls}>Beds</label><input type="number" min="1" value={form.beds} onChange={(e) => setForm({ ...form, beds: e.target.value })} className={inputCls} required /></div>
                <div><label className={labelCls}>Baths</label><input type="number" min="1" value={form.baths} onChange={(e) => setForm({ ...form, baths: e.target.value })} className={inputCls} required /></div>
              </div>
              <div><label className={labelCls}>Image URLs (comma-separated)</label><input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Amenities (comma-separated)</label><input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="3" className={inputCls} required /></div>

              <div className="flex gap-3 pt-1">
                <button type="submit" className="btn-gold flex-1 py-3 rounded-2xl text-sm">
                  {isCreating ? "Create" : "Save Changes"}
                </button>
                {!isCreating && (
                  <button type="button" onClick={handleCreate} className="flex-1 py-3 rounded-2xl border border-gold/30 text-sm text-luxury/60 hover:bg-gold/5 transition">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </aside>
        </div>
      </div>
    </div>
  );
}
