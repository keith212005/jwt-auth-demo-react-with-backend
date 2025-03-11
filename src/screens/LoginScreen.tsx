import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { API_URL } from "../constants/constants";
import { useAuth } from "../contexts/AuthProvider";

const LoginScreen = () => {
  const [user, setUser] = useState({ username: "test", password: "password" });
  const [refreshToken, setRefreshToken] = useState("");
  const { login, accessToken, errorMsg } = useAuth();
  // const navigate = useNavigate();

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/refresh`,
        {},
        { withCredentials: true } // Send cookies with request
      );
      // setAccessToken(response.data.accessToken);
    } catch (error) {
      console.error("Failed to refresh token", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        className="border border-gray-300 rounded-md p-2"
        type="text"
        placeholder="Username"
        value={"test"}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />
      <input
        className="border border-gray-300 rounded-md p-2"
        type="password"
        placeholder="Password"
        value={"password"}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <button
        onClick={() => {
          login(user);
        }}
      >
        Login
      </button>
      {errorMsg && <p>{errorMsg}</p>}
      <h3>Refresh Token: {refreshToken ? "Yes" : "No"}</h3>

      <button onClick={refreshAccessToken}>Refresh Token</button>
    </div>
  );
};

export default LoginScreen;
