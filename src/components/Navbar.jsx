import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, User, X, MapPin, Calendar, Users } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { user, logout, host, loginHost, searchParams, setSearchParams } = useApp();
  const [showMenu, setShowMenu]           = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode]           = useState("login");
  const [showHostModal, setShowHostModal] = useState(false);
  const [hostForm, setHostForm]           = useState({ id: "", password: "" });
  const [hostError, setHostError]         = useState("");
  const [showSearch, setShowSearch]       = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when any modal is open
  useEffect(() => {
    const open = showSearch || showHostModal || showAuthModal;
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showSearch, showHostModal, showAuthModal]);

  const handleHostClick = () => {
    if (host) { navigate("/host"); return; }
    setHostError("");
    setHostForm({ id: "", password: "" });
    setShowHostModal(true);
  };

  const handleHostSubmit = async (e) => {
    e.preventDefault();
    const envEmail    = import.meta.env.VITE_HOST_EMAIL;
    const envPassword = import.meta.env.VITE_HOST_PASSWORD;
    if (hostForm.id !== envEmail || hostForm.password !== envPassword) {
      setHostError("Invalid host credentials");
      return;
    }
    try {
      await loginHost(hostForm);
      setShowHostModal(false);
      navigate("/host");
    } catch (err) {
      setHostError(err.message || "Invalid host credentials");
    }
  };

  return (
    <>
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-airbnb font-bold text-xl sm:text-2xl tracking-tight">
              Whilly Heaven
            </span>
          </Link>

          {/* Desktop search pill */}
          <button
            onClick={() => setShowSearch(true)}
            className="hidden md:flex items-center gap-0 border border-gray-300 rounded-full shadow-sm hover:shadow-md transition divide-x divide-gray-300 text-sm"
          >
            <span className="px-4 py-2 font-medium">Anywhere</span>
            <span className="px-4 py-2 font-medium">Any week</span>
            <span className="flex items-center gap-2 px-4 py-2 text-gray-400">
              Add guests
              <span className="bg-airbnb rounded-full p-1.5">
                <Search className="w-3 h-3 text-white" />
              </span>
            </span>
          </button>

          {/* Mobile search button */}
          <button
            onClick={() => setShowSearch(true)}
            className="md:hidden flex items-center gap-2 border border-gray-200 rounded-full px-3 py-2 shadow-sm text-sm font-medium flex-1 max-w-[200px]"
          >
            <Search className="w-4 h-4 text-airbnb flex-shrink-0" />
            <span className="truncate text-gray-500">Where to?</span>
          </button>

          {/* Right side */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Host panel — hidden on mobile, shown in menu */}
            <button
              onClick={handleHostClick}
              className="hidden md:block text-sm font-medium px-3 py-2 rounded-full hover:bg-gray-100 transition whitespace-nowrap"
            >
              Host panel
            </button>

            {/* User menu button */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-2 hover:shadow-md transition"
                aria-label="Open menu"
              >
                <Menu className="w-4 h-4" />
                <div className="w-7 h-7 bg-gray-500 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                  {user?.avatar
                    ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    : <User className="w-4 h-4 text-white" />
                  }
                </div>
              </button>

              {/* Dropdown */}
              {showMenu && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm font-semibold border-b border-gray-100 truncate">
                        {user.name}
                      </div>
                      <Link to="/trips"    className="block px-4 py-2.5 text-sm hover:bg-gray-50" onClick={() => setShowMenu(false)}>My Trips</Link>
                      <Link to="/wishlist" className="block px-4 py-2.5 text-sm hover:bg-gray-50" onClick={() => setShowMenu(false)}>Wishlists</Link>
                      <Link to="/profile"  className="block px-4 py-2.5 text-sm hover:bg-gray-50" onClick={() => setShowMenu(false)}>Profile</Link>
                      {/* Host panel in menu on mobile */}
                      <button
                        onClick={() => { handleHostClick(); setShowMenu(false); }}
                        className="md:hidden block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50"
                      >
                        Host panel
                      </button>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={() => { logout(); setShowMenu(false); }}
                        className="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-red-500"
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { setAuthMode("login"); setShowAuthModal(true); setShowMenu(false); }}
                        className="block w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
                      >
                        Log in
                      </button>
                      <button
                        onClick={() => { setAuthMode("signup"); setShowAuthModal(true); setShowMenu(false); }}
                        className="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50"
                      >
                        Sign up
                      </button>
                      <hr className="my-1 border-gray-100" />
                      {/* Host panel in menu on mobile */}
                      <button
                        onClick={() => { handleHostClick(); setShowMenu(false); }}
                        className="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50"
                      >
                        Host panel
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Search Modal ───────────────────────────────────────────────────── */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold">Where to?</h2>
              <button
                onClick={() => setShowSearch(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Fields */}
            <div className="p-5 space-y-3">
              {/* Location */}
              <div className="flex items-center gap-3 border-2 border-airbnb rounded-2xl px-4 py-3">
                <MapPin className="w-4 h-4 text-airbnb flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Location</p>
                  <input
                    className="w-full text-sm outline-none mt-0.5 bg-transparent"
                    placeholder="Search destinations"
                    value={searchParams.location}
                    onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                    autoFocus
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Check-in */}
                <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Check in</p>
                    <input
                      type="date"
                      className="w-full text-sm outline-none mt-0.5 bg-transparent"
                      value={searchParams.checkIn}
                      onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3">
                  <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Guests</p>
                    <input
                      type="number"
                      min="1"
                      className="w-full text-sm outline-none mt-0.5 bg-transparent"
                      value={searchParams.guests}
                      onChange={(e) => setSearchParams({ ...searchParams, guests: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Search button */}
            <div className="px-5 pb-6">
              <button
                onClick={() => { setShowSearch(false); navigate("/search"); }}
                className="w-full bg-airbnb text-white py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-airbnb-dark transition text-sm"
              >
                <Search className="w-4 h-4" /> Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Host Login Modal ───────────────────────────────────────────────── */}
      {showHostModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold">Host login</h2>
              <button onClick={() => setShowHostModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleHostSubmit} className="p-5 space-y-3">
              <input
                type="email"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-airbnb transition"
                placeholder="Email address"
                value={hostForm.id}
                onChange={(e) => setHostForm({ ...hostForm, id: e.target.value })}
                required
              />
              <input
                type="password"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-airbnb transition"
                placeholder="Password"
                value={hostForm.password}
                onChange={(e) => setHostForm({ ...hostForm, password: e.target.value })}
                required
              />
              {hostError && <p className="text-sm text-red-500">{hostError}</p>}
              <button
                type="submit"
                className="w-full bg-airbnb text-white py-3.5 rounded-2xl font-semibold hover:bg-airbnb-dark transition text-sm"
              >
                Continue to host panel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Auth Modal ─────────────────────────────────────────────────────── */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          setMode={setAuthMode}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}

/* ── Auth Modal Component ──────────────────────────────────────────────────── */
function AuthModal({ mode, setMode, onClose }) {
  const { login } = useApp();
  const [form, setForm]   = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Use real API if available, fallback to local login
      const { login: apiLogin, register: apiRegister } = await import("../services/api");
      let userData;
      if (mode === "login") {
        userData = await apiLogin(form.email, form.password);
      } else {
        userData = await apiRegister(form.name, form.email, form.password);
      }
      await login(userData);
      onClose();
    } catch (err) {
      // Fallback: local login (no backend)
      if (err?.message?.includes("fetch") || err?.message?.includes("connect")) {
        login({ name: form.name || form.email.split("@")[0], email: form.email, avatar: "" });
        onClose();
      } else {
        setError(err?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold">{mode === "login" ? "Log in" : "Sign up"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          {mode === "signup" && (
            <input
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-airbnb transition"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          )}
          <input
            type="email"
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-airbnb transition"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-airbnb transition"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-airbnb text-white py-3.5 rounded-2xl font-semibold hover:bg-airbnb-dark transition text-sm disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>

        {/* Switch mode */}
        <p className="text-center text-sm pb-6 text-gray-500">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
            className="font-semibold text-gray-800 underline"
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
