

import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// ── Create Axios Instance ────────────────────────────────────
// axios.create() gives us a custom copy of axios with preset:
//   - baseURL: so we write api.get('/tasks') not the full URL
//   - headers: every request sends JSON content type
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json", // tells the server we're sending JSON
  },
});

// ── Request Interceptor ──────────────────────────────────────
// This function runs BEFORE every outgoing API request.
// It reads the JWT token from localStorage and adds it to
// the Authorization header so the backend knows who you are.
//
// Flow: Component calls api.get('/tasks')
//       → interceptor runs → adds "Authorization: Bearer <token>"
//       → request goes to the server
api.interceptors.request.use((config) => {
  // Read JWT saved during login (or null if not logged in)
  const token = localStorage.getItem("token");

  // Only add header if token exists and headers object is available
  if (token && config.headers) {
    // Bearer token format is required by the backend JWT middleware
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Must return config — otherwise the request is cancelled
  return config;
});

// ── Response Interceptor ─────────────────────────────────────
// This function runs AFTER every API response comes back.
// It handles the success case normally, but also catches 401
// errors globally — meaning we handle "session expired" in
// ONE place instead of every component.
//
// 401 Unauthorized means:
//   - Token has expired (e.g. 24 hours passed)
//   - Token was tampered with
//   - Token was missing from the request
api.interceptors.response.use(
  // ✅ Success: just pass through the response unchanged
  (response) => response,

  // ❌ Error: check if it's a 401 and handle session expiry
  (error) => {
    if (error?.response?.status === 401) {
      // Remove the invalid/expired token from browser storage
      localStorage.removeItem("token");

      // Only redirect if the user is currently on a dashboard page.
      // We don't redirect from /login or /register because those
      // pages don't need a token and would cause a redirect loop.
      if (window.location.pathname.startsWith("/dashboard")) {
        window.location.assign("/login"); // hard redirect to login page
      }
    }

    // Re-throw the error so individual components can still
    // show their own error messages if needed
    return Promise.reject(error);
  }
);

// Export the configured instance — all components import THIS
// instead of importing axios directly
export default api;