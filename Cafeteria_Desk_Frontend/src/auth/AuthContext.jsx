import React, { createContext, useContext, useState, useEffect } from "react";
import api, { setToken } from "../services/api";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on load
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);

    // Listen for auth:logout event from api interceptor
    const handleAuthLogout = () => {
      logout(true); // logout triggered by 401
    };

    window.addEventListener("auth:logout", handleAuthLogout);

    return () => {
      window.removeEventListener("auth:logout", handleAuthLogout);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });

      const { access_token, user } = response.data;

      // Set token in memory & storage
      setToken(access_token);
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed"
      };
    }
  };

  const logout = async (isSessionExpired = false) => {
    try {
      if (!isSessionExpired) {
        // Only call API if manually logging out, otherwise we are already 401
        await api.post("/auth/logout");
      }
    } catch (e) {
      console.error("Logout error", e);
    }

    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (isSessionExpired) {
      toast.error("Session expired. Please login again.", { toastId: "session_expired" });
    } else {
      toast.success("Logged out successfully", { toastId: "logout_success" });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

