
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the token belonging to the current browser tab.
API.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    console.log("AUTH TOKEN CHECK:", {
  url: config.url,
  storedTokenParts: token ? token.split(".").length : 0,
  storedTokenLength: token?.length ?? 0,
  authorizationExists: Boolean(
    config.headers?.Authorization ||
    config.headers?.authorization
  ),
});

    // Temporary debugging: never log the actual token.
    let userRole = null;

    try {
      const user = JSON.parse(
        sessionStorage.getItem("user") || "null"
      );
      userRole = user?.role ?? null;
    } catch {
      userRole = "Invalid session user data";
    }

    console.log("API AUTH DEBUG:", {
      url: config.url,
      method: config.method,
      hasToken: Boolean(token),
      tokenLength: token?.length ?? 0,
      userRole,
    });

    // Add the current tab's token to the request.
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Do not send an old or default Authorization header.
      if (config.headers) {
        delete config.headers.Authorization;
        delete config.headers.authorization;
      }
    }

    // Let the browser set the multipart boundary for uploads.
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
