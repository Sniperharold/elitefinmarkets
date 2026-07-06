import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { api, saveAuth, clearAuth, getStoredUser } from "./api.js";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const INACTIVITY_MS = 10 * 60 * 1000;
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [inactiveLogout, setInactiveLogout] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(false);

  const navigate = useNavigate();
  const inactivityTimer = useRef(null);

  const clearSession = useCallback(() => {
    clearAuth();
    setUser(null);
    setWallet(null);
  }, []);

  const handleExpiry = useCallback(() => {
    clearSession();
    setTokenExpired(true);
    navigate("/signin");
  }, [clearSession, navigate]);

  const handleInactivity = useCallback(() => {
    clearSession();
    setInactiveLogout(true);
    navigate("/signin");
  }, [clearSession, navigate]);

  const resetTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(handleInactivity, INACTIVITY_MS);
  }, [handleInactivity]);

  useEffect(() => {
    const handle401 = () => {
      clearSession();
      setSessionTimeout(true);
      navigate("/signin");
    };
    window.addEventListener("efm:401", handle401);
    return () => window.removeEventListener("efm:401", handle401);
  }, [clearSession, navigate]);

  useEffect(() => {
    if (!user) {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      return;
    }
    resetTimer();
    ACTIVITY_EVENTS.forEach((evt) =>
      window.addEventListener(evt, resetTimer, { passive: true }),
    );
    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
  }, [user, resetTimer]);

  const refreshWallet = async () => {
    if (!user) return;
    try {
      const w = await api.getWallet();
      setWallet(w);
    } catch (err) {
      if (err?.status === 401) handleExpiry();
    }
  };

  useEffect(() => {
    if (!user) return;
    api
      .me()
      .then((data) => {
        setUser(data);
        setWallet(data.wallet);
        localStorage.setItem("efm_user", JSON.stringify(data));
      })
      .catch(() => handleExpiry());
  }, []);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(refreshWallet, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      saveAuth(data);
      setUser(data.user);
      setWallet(data.user.wallet);
      setTokenExpired(false);
      setInactiveLogout(false);
      setSessionTimeout(false);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const data = await api.register(formData);
      saveAuth(data);
      setUser(data.user);
      setWallet(data.user.wallet);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {}
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    clearSession();
  };

  const updateUser = (updates) => {
    const merged = { ...user, ...updates };
    setUser(merged);
    localStorage.setItem("efm_user", JSON.stringify(merged));
  };

  const bannerStyle = {
    position: "fixed",
    top: 20,
    left: "50%",
    transform: "translateX(-50%)",
    padding: "10px 20px",
    borderRadius: 8,
    fontWeight: 600,
    zIndex: 9999,
    fontSize: 14,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    whiteSpace: "nowrap",
  };

  return (
    <AuthContext.Provider
      value={{ user, wallet, loading, login, register, logout, refreshWallet, updateUser }}
    >
      {sessionTimeout && (
        <div style={{ ...bannerStyle, background: "rgba(239,68,68,0.95)", color: "#fff" }}>
          Session timeout. Please log in again.
        </div>
      )}
      {tokenExpired && !sessionTimeout && (
        <div style={{ ...bannerStyle, background: "#dc2626", color: "#fff" }}>
          Session expired. Please log in again.
        </div>
      )}
      {inactiveLogout && (
        <div style={{ ...bannerStyle, background: "rgba(245,158,11,0.95)", color: "#fff" }}>
          Signed out due to 10 minutes of inactivity.
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
