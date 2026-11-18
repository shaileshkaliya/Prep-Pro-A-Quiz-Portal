import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ENDPOINTS } from "../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginContent = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(ENDPOINTS.USER.LOGIN, { email, password });

      // Destructuring the response to get token, userId, and message
      const { token, userId, message } = res.data;


      // Check if the token is received and valid
      if (token && token.startsWith("Bearer ")) {
        const expiryTime = new Date().getTime() + 5 * 60 * 60 * 1000; // 5 hours

        // Store the token, userId, and expiry time in localStorage
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("jwtExpiry", expiryTime.toString());
        localStorage.setItem("loginContext", "user");

        // Show success toast with the message
        toast.success(message || "Login successful!");

        // Update the login state and navigate to the dashboard
        onLogin(); // update isAuthenticated
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500); // wait for toast to show
      } else {
        // Show error toast if token is invalid or missing
        toast.error(message || "Login failed. Please try again.");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Invalid credentials or server error.";
      // Show error toast if something goes wrong
      toast.error(errorMsg);
      console.error("Login error:", error);
    }
  };

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

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
