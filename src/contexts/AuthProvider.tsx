import React from "react";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../constants/constants";
import { useNavigate } from "react-router";

const AuthContext = createContext({
  accessToken: "",
  login: async (user) => {},
  logout: () => {},
  refreshAccessToken: async () => {},
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
        console.error("Failed >>>>>>>>.", JSON.stringify(error, null, 2));
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

  const logout = () => {
    setAccessToken("");
    sessionStorage.removeItem("accessToken");
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/refresh`,
        {},
        { withCredentials: true }
      );
      console.log("Refreshed access token>>>>", response.data.accessToken);
      setAccessToken(response.data.accessToken);
    } catch (error) {
      console.error("Failed to refresh access token");
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, login, logout, refreshAccessToken, errorMsg }}
    >
      {children}
    </AuthContext.Provider>
  );
};
