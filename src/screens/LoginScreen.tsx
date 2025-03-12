import React, { useState } from "react";
import { useAuth } from "../contexts/AuthProvider";

const LoginScreen = () => {
  const [user, setUser] = useState({ username: "test", password: "password" });
  const { login, errorMsg } = useAuth();

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
      <button onClick={() => login(user)}>Login</button>
      {errorMsg && <p>{errorMsg}</p>}
    </div>
  );
};

export default LoginScreen;
