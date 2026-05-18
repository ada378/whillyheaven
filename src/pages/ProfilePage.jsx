import { useState } from "react";
import { User, Crown, LogOut } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ProfilePage() {
  const { user, updateProfile, logout } = useApp();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(form);
  };

  return (
    <div className="min-h-screen bg-gold-pale">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Header */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold/60 mb-1">Account</p>
          <h1 className="text-3xl font-serif font-bold text-luxury">Your Profile</h1>
          <div className="gold-divider w-24 mt-3" />
        </div>

        {/* Avatar card */}
        <div className="rounded-3xl border border-gold/20 bg-white/80 p-6 shadow-gold flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center flex-shrink-0">
            {user?.avatar
              ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              : <User className="w-7 h-7 text-gold" />
            }
          </div>
          <div>
            <p className="font-serif font-bold text-lg text-luxury">{user?.name}</p>
            <p className="text-sm text-luxury/50">{user?.email}</p>
            {user?.isSuperhost && (
              <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-gold border border-gold/30 rounded-full px-2 py-0.5">
                <Crown className="w-3 h-3" /> Superhost
              </span>
            )}
          </div>
        </div>

        {/* Edit form */}
        <div className="rounded-3xl border border-gold/20 bg-white/80 p-6 shadow-gold">
          <h2 className="font-serif font-semibold text-luxury mb-5">Edit Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gold/70 mb-2">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-2xl border border-gold/30 bg-gold-pale px-4 py-3 text-sm text-luxury outline-none focus:border-gold transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gold/70 mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-2xl border border-gold/30 bg-gold-pale px-4 py-3 text-sm text-luxury outline-none focus:border-gold transition"
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button type="submit" className="btn-gold flex-1 py-3 rounded-2xl text-sm">
                Save Changes
              </button>
              <button
                type="button"
                onClick={logout}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-300/50 text-red-400 text-sm hover:bg-red-50/50 transition"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
