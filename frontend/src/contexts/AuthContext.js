import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const TOKEN_KEY = "cybercopilote_access_token";
const REFRESH_KEY = "cybercopilote_refresh_token";

function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}
function getStoredRefresh() {
  return localStorage.getItem(REFRESH_KEY);
}
function storeTokens(access, refresh) {
  if (access) localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}
function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

// Add auth header to every request
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const url = error.config?.url || "";
    const isAuthEndpoint = url.includes("/auth/");
    if (error.response?.status === 401 && !error.config._retry && !isAuthEndpoint) {
      error.config._retry = true;
      const refreshToken = getStoredRefresh();
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BACKEND_URL}/api/auth/refresh`, { refresh_token: refreshToken });
          storeTokens(data.access_token, data.refresh_token);
          error.config.headers.Authorization = `Bearer ${data.access_token}`;
          return api(error.config);
        } catch {
          clearTokens();
          return Promise.reject(error);
        }
      }
    }
    return Promise.reject(error);
  }
);

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function useApi() {
  return api;
}

function formatApiErrorDetail(detail) {
  if (detail == null) return "Une erreur est survenue.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export { formatApiErrorDetail };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(false);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch {
      clearTokens();
      setUser(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    storeTokens(data.access_token, data.refresh_token);
    setUser({ id: data.id, email: data.email, name: data.name, role: data.role });
    return data;
  };

  const register = async (email, password, name) => {
    const { data } = await api.post("/auth/register", { email, password, name });
    storeTokens(data.access_token, data.refresh_token);
    setUser({ id: data.id, email: data.email, name: data.name, role: data.role });
    return data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    clearTokens();
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth, api }}>
      {children}
    </AuthContext.Provider>
  );
}
