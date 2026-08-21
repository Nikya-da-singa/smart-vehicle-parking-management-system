import axios from "axios";

// Read API URL dynamically from environment or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// REQUEST INTERCEPTOR: Automatically attach JWT
// =====================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =====================================================
// RESPONSE INTERCEPTOR: Handle Common Errors
// =====================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        console.warn("Session expired or unauthorized. Clearing credentials.");
        localStorage.removeItem("token");
      }
    } else if (error.request) {
      console.error("Network error: Server did not respond.");
    }
    return Promise.reject(error);
  }
);

export default api;