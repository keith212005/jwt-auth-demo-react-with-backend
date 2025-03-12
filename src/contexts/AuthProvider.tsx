import React from "react";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext({
  accessToken: "",
  login: async (user) => {},
  logout: () => {},
  refreshAccessToken: async () => {},
  accessProtectedRoute: async () => {},
  errorMsg: "",
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  console.log("API_URL", API_URL);
  const [accessToken, setAccessToken] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // 🔄 Automatically fetch access token when app loads
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await axios.post(
          `${API_URL}/refresh`,
          {},
          { withCredentials: true } // ✅ Include cookies automatically
        );
        setAccessToken(response.data.accessToken);
        navigate("/dashboard", { replace: true });
      } catch (error) {
        navigate("/", { replace: true });
      }
    };

    fetchAccessToken();
  }, []); // ✅ Runs only once on mount

  const login = async (user) => {
    try {
      const response = await axios.post(`${API_URL}/login`, user, {
        withCredentials: true, // ✅ Enables HTTP-only cookies
      });
      setAccessToken(response.data.accessToken);
      sessionStorage.setItem("accessToken", response.data.accessToken); // ✅ Store in sessionStorage
      setErrorMsg("");
      navigate("/dashboard");
    } catch (error) {
      setErrorMsg("Login failed!");
    }
  };

  /**
   * Logs out the user and clears tokens across tabs.
   */
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      setAccessToken("");
      sessionStorage.removeItem("accessToken");
      localStorage.setItem("logout", Date.now().toString()); // 🔥 Sync logout across tabs
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed.", error);
    }
  };

  // 🔄 Listen for logout events across tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "logout") {
        setAccessToken("");
        sessionStorage.removeItem("accessToken");
        navigate("/", { replace: true });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/refresh`,
        {},
        { withCredentials: true }
      );
      setAccessToken(response.data.accessToken);
    } catch (error) {
      console.error("Failed to refresh access token");
      logout();
    }
  };

  const accessProtectedRoute = async () => {
    try {
      const response: any = await axios.get(`${API_URL}/protected`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.message;
    } catch (error) {
      console.error("Access denied", error);
      return error.message;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        login,
        logout,
        refreshAccessToken,
        accessProtectedRoute,
        errorMsg,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
