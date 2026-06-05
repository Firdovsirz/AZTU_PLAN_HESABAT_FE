import axios from 'axios';
import { RootState, store } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = (store.getState() as RootState).auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global auth-failure handling: the backend now requires a valid token on
// (almost) every endpoint. If a request fails with 401/403 because the token
// is missing or expired, clear the session and redirect to sign-in.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url ?? "";
    const isAuthEndpoint = url.includes("/auth/");

    // Only 401 (missing/expired/invalid token) forces logout. A 403 means the
    // user is authenticated but lacks the role for that action — keep them in.
    if (status === 401 && !isAuthEndpoint) {
      const hadToken = Boolean((store.getState() as RootState).auth.token);
      if (hadToken) {
        store.dispatch(logout());
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/signin")) {
          window.location.href = "/signin";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;