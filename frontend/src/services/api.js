
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// AUTHENTICATION INTERCEPTOR
// =====================================================

API.interceptors.request.use(
  (config) => {
    // Get the JWT token from the current browser tab.
    const token = sessionStorage.getItem("token");

    config.headers = config.headers || {};

    // Attach the token to the request.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
      delete config.headers.authorization;
    }

    // Support file uploads using FormData.
    // The browser will automatically set the multipart boundary.
    if (
      typeof FormData !== "undefined" &&
      config.data instanceof FormData
    ) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
