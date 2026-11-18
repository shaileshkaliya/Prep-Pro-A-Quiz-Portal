// src/components/LoginContent.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ENDPOINTS } from "../utils/Constants";

const LoginContent = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(ENDPOINTS.USER.LOGIN, {
        params: { email, password },
      });

      const token = res.data;

      if (token.startsWith("Bearer ")) {
        localStorage.setItem("jwtToken", token); // Optional: store token
        alert("Login successful!");
        onLogin(); // Set isAuthenticated
        navigate("/dashboard");
      } else {
        alert("Login failed: " + token);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials or server error.");
    }
  };

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center bg-white bg-opacity-80 rounded-lg shadow-lg p-8 m-8 max-w-md w-full backdrop-blur-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">User Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-Mail"
            className="border rounded p-2 mb-4 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded p-2 mb-4 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginContent;

