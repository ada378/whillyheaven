import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function ProfilePage() {
  const { user, updateProfile, logout } = useApp();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(form);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="mt-2 text-gray-600">Update your account details and manage your settings.</p>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-airbnb"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-airbnb"
              required
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="submit" className="inline-flex items-center justify-center rounded-2xl bg-airbnb px-6 py-3 text-sm font-semibold text-white hover:bg-airbnb-dark transition">
              Save profile
            </button>
            <button type="button" onClick={logout} className="inline-flex items-center justify-center rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold hover:bg-gray-50 transition">
              Log out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
