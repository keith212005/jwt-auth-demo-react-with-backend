import React from "react";
import LoginScreen from "./screens/LoginScreen";

import { Route, Routes, Navigate } from "react-router";
import Dashboard from "./screens/Dashboard";
import { useAuth } from "./contexts/AuthProvider";

function App() {
  const PrivateRoute = ({ element }) => {
    const { accessToken } = useAuth();
    console.log("Navigationg to login>>>>>>");
    return accessToken ? element : <Navigate to="/login" />;
  };
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route
        path="/dashboard"
        element={<PrivateRoute element={<Dashboard />} />}
      />
    </Routes>
  );
}

export default App;
