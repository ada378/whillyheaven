import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { setUnauthorizedHandler, getWishlist as apiGetWishlist } from "../services/api";
import { listings as initialListings } from "../data/listings";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || null; } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [host, setHost] = useState(() => {
    try { return JSON.parse(localStorage.getItem("host")) || null; } catch { return null; }
  });
  const [hostToken, setHostToken] = useState(() => localStorage.getItem("hostToken") || null);
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wishlist")) || []; } catch { return []; }
  });
  const [searchParams, setSearchParams] = useState({
    location: "", checkIn: "", checkOut: "", guests: 1,
  });
  const [listings, setListings] = useState(() => {
    try { return JSON.parse(localStorage.getItem("listings")) || initialListings; } catch { return initialListings; }
  });
  const [bookings, setBookings] = useState(() => {
    try { return JSON.parse(localStorage.getItem("bookings")) || []; } catch { return []; }
  });
  const [toast, setToast] = useState(null);

  // Persist wishlist and bookings
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);
  useEffect(() => {
    localStorage.setItem("listings", JSON.stringify(listings));
  }, [listings]);
  useEffect(() => {
    if (host) {
      localStorage.setItem("host", JSON.stringify(host));
    } else {
      localStorage.removeItem("host");
    }
  }, [host]);
  useEffect(() => {
    if (hostToken) {
      localStorage.setItem("hostToken", hostToken);
    } else {
      localStorage.removeItem("hostToken");
    }
  }, [hostToken]);

  // ─── Toast ──────────────────────────────────────────────────────────────────
  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ─── Wishlist sync ──────────────────────────────────────────────────────────
  const syncWishlistFromAPI = useCallback(async () => {
    try {
      const listings = await apiGetWishlist();
      const ids = listings.map((l) => l._id);
      setWishlist(ids);
      localStorage.setItem("wishlist", JSON.stringify(ids));
    } catch {
      // silently retain local wishlist
    }
  }, []);

  // ─── Auth ───────────────────────────────────────────────────────────────────
  const login = useCallback(async (userData) => {
    const { token: tok, ...rest } = userData;
    setUser(rest);
    localStorage.setItem("user", JSON.stringify(rest));
    if (tok) {
      setToken(tok);
      localStorage.setItem("token", tok);
    }
    // Sync wishlist after login
    await syncWishlistFromAPI();
  }, [syncWishlistFromAPI]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  const loginHost = useCallback(async ({ id, password }) => {
    // Credentials already validated in Navbar against VITE_HOST_EMAIL / VITE_HOST_PASSWORD
    // Set host state locally — no separate backend host route needed
    const hostData = { email: id, name: "Host", isHost: true };
    setHost(hostData);
    localStorage.setItem("host", JSON.stringify(hostData));
    return hostData;
  }, []);

  const logoutHost = useCallback(() => {
    setHost(null);
    setHostToken(null);
  }, []);

  // Register 401 handler with api.js
  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
      showToast("Session expired. Please log in again.", "error");
    });
  }, [logout, showToast]);

  // ─── Wishlist toggle ────────────────────────────────────────────────────────
  const toggleWishlist = useCallback((id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  // ─── Bookings ───────────────────────────────────────────────────────────────
  const addBooking = useCallback((booking) => {
    setBookings((prev) => [...prev, { ...booking, id: Date.now(), status: "confirmed" }]);
  }, []);

  const updateListing = useCallback((id, updatedData) => {
    setListings((prev) => prev.map((listing) => (listing.id === id ? { ...listing, ...updatedData } : listing)));
    showToast("Listing updated successfully.", "success");
  }, [showToast]);

  const deleteListing = useCallback((id) => {
    setListings((prev) => prev.filter((listing) => listing.id !== id));
    showToast("Listing deleted successfully.", "success");
  }, [showToast]);

  const createListing = useCallback((data) => {
    const newListing = { ...data, id: Date.now() };
    setListings((prev) => [newListing, ...prev]);
    showToast("Listing created successfully.", "success");
  }, [showToast]);

  // ─── Profile updates ─────────────────────────────────────────────────────────
  const updateProfile = useCallback((profileData) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;
      const nextUser = { ...currentUser, ...profileData };
      localStorage.setItem("user", JSON.stringify(nextUser));
      showToast("Profile updated successfully.", "success");
      return nextUser;
    });
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        setToken,
        login,
        logout,
        host,
        hostToken,
        loginHost,
        logoutHost,
        updateProfile,
        listings,
        createListing,
        updateListing,
        deleteListing,
        wishlist,
        toggleWishlist,
        syncWishlistFromAPI,
        searchParams,
        setSearchParams,
        bookings,
        addBooking,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
