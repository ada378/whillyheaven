const BASE_URL = "http://localhost:5000/api";

// Callback registered by AppContext to handle 401 globally
let _onUnauthorized = null;

export function setUnauthorizedHandler(fn) {
  _onUnauthorized = fn;
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Core fetch helper.
 * - Reads JWT from localStorage at call time (never at module load)
 * - Never mutates the caller's options object
 * - Returns parsed JSON on 2xx
 * - Throws ApiError on non-2xx
 */
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.ok) {
    // Some DELETE endpoints return 204 No Content
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  let body;
  try {
    body = await response.json();
  } catch {
    body = { message: response.statusText };
  }

  if (response.status === 401 && _onUnauthorized) {
    _onUnauthorized();
  }

  throw new ApiError(body.message || "Something went wrong", response.status);
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const login = (email, password) =>
  apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

// Host login uses the same /auth/login endpoint — host access is determined by user.isHost
export const loginHost = (email, password) =>
  apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const register = (name, email, password) =>
  apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

export const getMe = () => apiFetch("/auth/me");

export const updateProfile = (data) =>
  apiFetch("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });

// ─── Listings ────────────────────────────────────────────────────────────────

/**
 * Serialises a ListingQuery object to a URL query string.
 * Skips undefined/null values. Always returns a valid query string.
 */
export function buildQueryString(params = {}) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      qs.set(key, String(value));
    }
  }
  const str = qs.toString();
  return str ? `?${str}` : "";
}

export const getListings = (params = {}) =>
  apiFetch(`/listings${buildQueryString(params)}`);

export const getListing = (id) => apiFetch(`/listings/${id}`);

export const createListing = (data) =>
  apiFetch("/listings", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateListing = (id, data) =>
  apiFetch(`/listings/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteListing = (id) =>
  apiFetch(`/listings/${id}`, { method: "DELETE" });

export const getHostListings = () => apiFetch("/listings/host/my");

// ─── Bookings ────────────────────────────────────────────────────────────────

export const createBooking = (data) =>
  apiFetch("/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getMyBookings = () => apiFetch("/bookings/my");

export const getHostBookings = () => apiFetch("/bookings/host");

export const cancelBooking = (id) =>
  apiFetch(`/bookings/${id}/cancel`, { method: "PUT" });

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const getListingReviews = (listingId) =>
  apiFetch(`/reviews/${listingId}`);

export const createReview = (data) =>
  apiFetch("/reviews", {
    method: "POST",
    body: JSON.stringify(data),
  });

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export const getWishlist = () => apiFetch("/wishlist");

export const toggleWishlist = (listingId) =>
  apiFetch(`/wishlist/${listingId}`, { method: "POST" });
