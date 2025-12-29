import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Add /api/v1 prefix to all requests that don't already have it
api.interceptors.request.use((config) => {
  if (config.url && !config.url.startsWith("/api") && !config.url.startsWith("http")) {
    config.url = `/api/v1${config.url}`;
  }
  return config;
});

export default api;
