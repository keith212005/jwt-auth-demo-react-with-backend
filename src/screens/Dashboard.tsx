import React, { useEffect, useState } from "react";
import Details from "../components/Details";
import { useAuth } from "../contexts/AuthProvider";
import axios from "axios";
import { API_URL } from "../constants/constants";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const navigate = useNavigate();
  const { accessToken, logout, refreshAccessToken } = useAuth();
  const [message, setMessage] = useState("");

  const [data, setData] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    axios
      .get(`${API_URL}/protected`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setData(res.data.message))
      .catch(() => logout());
  }, [accessToken, logout]);

  const getProtectedData = async () => {
    try {
      const response = await axios.get(`${API_URL}/protected`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error("Access denied", error);
      setMessage(error.message);
      // setAccessToken("");
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <Details />

      {accessToken && <p>Access Token: {accessToken}</p>}

      <button onClick={getProtectedData}>Access Protected Route</button>
      {message && <p>{message}</p>}

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
