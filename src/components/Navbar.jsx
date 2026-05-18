import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, User, X, MapPin, Calendar, Users, Crown } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { user, logout, host, loginHost, searchParams, setSearchParams } = useApp();
  const [showMenu,      setShowMenu]      = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode,      setAuthMode]      = useState("login");
  const [showHostModal, setShowHostModal] = useState(false);
  const [hostForm,      setHostForm]      = useState({ id: "", password: "" });
  const [hostError,     setHostError]     = useState("");
  const [showSearch,    setShowSearch]    = useState(false);
  const menuRef  = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    const open = showSearch || showHostModal || showAuthModal;
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showSearch, showHostModal, showAuthModal]);

  const handleHostClick = () => {
    if (host) { navigate("/host"); return; }
    setHostError(""); setHostForm({ id: "", password: "" }); setShowHostModal(true);
  };

  const handleHostSubmit = async (e) => {
    e.preventDefault();
    const envEmail = import.meta.env.VITE_HOST_EMAIL;
    const envPass  = import.meta.env.VITE_HOST_PASSWORD;
    if (hostForm.id !== envEmail || hostForm.password !== envPass) { setHostError("Invalid host credentials"); return; }
    try { await loginHost(hostForm); setShowHostModal(false); navigate("/host"); }
    catch (err) { setHostError(err.message || "Invalid host credentials"); }
  };

  return (
    <>
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-luxury border-b border-gold/30 shadow-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <Crown className="w-5 h-5 text-gold" />
            <span className="font-serif text-xl sm:text-2xl font-bold gold-text tracking-wide">
              Whilly Heaven
            </span>
          </Link>

          {/* Desktop search pill */}
          <button
            onClick={() => setShowSearch(true)}
            className="hidden md:flex items-center divide-x divide-gold/30 border border-gold/40 rounded-full bg-luxury-2 hover:border-gold/70 hover:shadow-gold transition text-sm"
          >
            <span className="px-4 py-2 font-medium text-gold-light">Anywhere</span>
            <span className="px-4 py-2 font-medium text-gold-light">Any week</span>
            <span className="flex items-center gap-2 px-4 py-2 text-gold/60">
              Add guests
              <span className="btn-gold rounded-full p-1.5">
                <Search className="w-3 h-3 text-luxury" />
              </span>
            </span>
          </button>

          {/* Mobile search pill */}
          <button
            onClick={() => setShowSearch(true)}
            className="md:hidden flex items-center gap-2 border border-gold/40 rounded-full px-3 py-2 bg-luxury-2 text-sm flex-1 max-w-[200px]"
          >
            <Search className="w-4 h-4 text-gold flex-shrink-0" />
            <span className="truncate text-gold/60">Where to?</span>
          </button>

          {/* Right side */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={handleHostClick}
              className="hidden md:block text-sm font-medium px-3 py-2 rounded-full text-gold hover:bg-gold/10 transition whitespace-nowrap"
            >
              Host panel
            </button>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 border border-gold/40 rounded-full px-3 py-2 bg-luxury-2 hover:border-gold/70 hover:shadow-gold transition"
              >
                <Menu className="w-4 h-4 text-gold" />
                <div className="w-7 h-7 bg-gold/20 border border-gold/40 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                  {user?.avatar
                    ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    : <User className="w-4 h-4 text-gold" />
                  }
                </div>
              </button>

              {showMenu && (
                <div className="absolute right-0 top-12 w-56 bg-luxury-2 border border-gold/30 rounded-2xl shadow-gold-lg py-2 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm font-semibold border-b border-gold/20 text-gold truncate">{user.name}</div>
                      <Link to="/trips"    className="block px-4 py-2.5 text-sm text-gold-light hover:bg-gold/10 transition" onClick={() => setShowMenu(false)}>My Trips</Link>
                      <Link to="/wishlist" className="block px-4 py-2.5 text-sm text-gold-light hover:bg-gold/10 transition" onClick={() => setShowMenu(false)}>Wishlists</Link>
                      <Link to="/profile"  className="block px-4 py-2.5 text-sm text-gold-light hover:bg-gold/10 transition" onClick={() => setShowMenu(false)}>Profile</Link>
                      <button onClick={() => { handleHostClick(); setShowMenu(false); }} className="md:hidden block w-full text-left px-4 py-2.5 text-sm text-gold-light hover:bg-gold/10 transition">Host panel</button>
                      <hr className="my-1 border-gold/20" />
                      <button onClick={() => { logout(); setShowMenu(false); }} className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gold/10 transition">Log out</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setAuthMode("login"); setShowAuthModal(true); setShowMenu(false); }} className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-gold hover:bg-gold/10 transition">Log in</button>
                      <button onClick={() => { setAuthMode("signup"); setShowAuthModal(true); setShowMenu(false); }} className="block w-full text-left px-4 py-2.5 text-sm text-gold-light hover:bg-gold/10 transition">Sign up</button>
                      <hr className="my-1 border-gold/20" />
                      <button onClick={() => { handleHostClick(); setShowMenu(false); }} className="block w-full text-left px-4 py-2.5 text-sm text-gold-light hover:bg-gold/10 transition">Host panel</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Search Modal ───────────────────────────────────────────────── */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-luxury-2 border border-gold/30 w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl shadow-gold-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gold/20">
              <h2 className="text-lg font-serif font-bold text-gold">Where to?</h2>
              <button onClick={() => setShowSearch(false)} className="p-2 hover:bg-gold/10 rounded-full text-gold transition"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3 border-2 border-gold rounded-2xl px-4 py-3 bg-luxury">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gold/60">Location</p>
                  <input className="w-full text-sm outline-none mt-0.5 bg-transparent text-gold-light placeholder-gold/40" placeholder="Search destinations" value={searchParams.location} onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })} autoFocus />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 border border-gold/30 rounded-2xl px-4 py-3 bg-luxury">
                  <Calendar className="w-4 h-4 text-gold/60 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gold/60">Check in</p>
                    <input type="date" className="w-full text-sm outline-none mt-0.5 bg-transparent text-gold-light" value={searchParams.checkIn} onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center gap-3 border border-gold/30 rounded-2xl px-4 py-3 bg-luxury">
                  <Users className="w-4 h-4 text-gold/60 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gold/60">Guests</p>
                    <input type="number" min="1" className="w-full text-sm outline-none mt-0.5 bg-transparent text-gold-light" value={searchParams.guests} onChange={(e) => setSearchParams({ ...searchParams, guests: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 pb-6">
              <button onClick={() => { setShowSearch(false); navigate("/search"); }} className="btn-gold w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm">
                <Search className="w-4 h-4" /> Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Host Login Modal ───────────────────────────────────────────── */}
      {showHostModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-luxury-2 border border-gold/30 w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-gold-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gold/20">
              <h2 className="text-lg font-serif font-bold text-gold">Host Login</h2>
              <button onClick={() => setShowHostModal(false)} className="p-2 hover:bg-gold/10 rounded-full text-gold transition"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleHostSubmit} className="p-5 space-y-3">
              <input type="email" className="w-full border border-gold/30 bg-luxury rounded-2xl px-4 py-3 text-sm text-gold-light placeholder-gold/40 outline-none focus:border-gold transition" placeholder="Email address" value={hostForm.id} onChange={(e) => setHostForm({ ...hostForm, id: e.target.value })} required />
              <input type="password" className="w-full border border-gold/30 bg-luxury rounded-2xl px-4 py-3 text-sm text-gold-light placeholder-gold/40 outline-none focus:border-gold transition" placeholder="Password" value={hostForm.password} onChange={(e) => setHostForm({ ...hostForm, password: e.target.value })} required />
              {hostError && <p className="text-sm text-red-400">{hostError}</p>}
              <button type="submit" className="btn-gold w-full py-3.5 rounded-2xl text-sm">Continue to Host Panel</button>
            </form>
          </div>
        </div>
      )}

      {/* ── Auth Modal ─────────────────────────────────────────────────── */}
      {showAuthModal && <AuthModal mode={authMode} setMode={setAuthMode} onClose={() => setShowAuthModal(false)} />}
    </>
  );
}

function AuthModal({ mode, setMode, onClose }) {
  const { login } = useApp();
  const [form,    setForm]    = useState({ name: "", email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const { login: apiLogin, register: apiRegister } = await import("../services/api");
      const userData = mode === "login"
        ? await apiLogin(form.email, form.password)
        : await apiRegister(form.name, form.email, form.password);
      await login(userData); onClose();
    } catch (err) {
      if (err?.message?.includes("fetch") || err?.message?.includes("connect")) {
        login({ name: form.name || form.email.split("@")[0], email: form.email, avatar: "" }); onClose();
      } else { setError(err?.message || "Something went wrong"); }
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-luxury-2 border border-gold/30 w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-gold-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gold/20">
          <h2 className="text-lg font-serif font-bold text-gold">{mode === "login" ? "Welcome Back" : "Join Us"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gold/10 rounded-full text-gold transition"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          {mode === "signup" && (
            <input className="w-full border border-gold/30 bg-luxury rounded-2xl px-4 py-3 text-sm text-gold-light placeholder-gold/40 outline-none focus:border-gold transition" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          )}
          <input type="email" className="w-full border border-gold/30 bg-luxury rounded-2xl px-4 py-3 text-sm text-gold-light placeholder-gold/40 outline-none focus:border-gold transition" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input type="password" className="w-full border border-gold/30 bg-luxury rounded-2xl px-4 py-3 text-sm text-gold-light placeholder-gold/40 outline-none focus:border-gold transition" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 rounded-2xl text-sm disabled:opacity-60">
            {loading ? "Please wait…" : mode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>
        <p className="text-center text-sm pb-6 text-gold/60">
          {mode === "login" ? "New here? " : "Already a member? "}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} className="font-semibold text-gold underline">
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
