import React, { useEffect, useState } from "react";
import Details from "../components/Details";
import { useAuth } from "../contexts/AuthProvider";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const { accessToken, logout, accessProtectedRoute } = useAuth();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    axios
      .get(`${API_URL}/protected`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {})
      .catch(() => logout());
  }, [accessToken, logout]);

  const handleAccessProtectedRoute = async () => {
    try {
      const response: any = await accessProtectedRoute();
      setMessage(response);
    } catch (error) {
      console.error("Access denied", error);
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <Details />
      {accessToken && <p>Access Token: {accessToken}</p>}
      <button onClick={handleAccessProtectedRoute}>
        Access Protected Route
      </button>
      <br />
      {message && <p>{message}</p>}
      <br /> <br />
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
