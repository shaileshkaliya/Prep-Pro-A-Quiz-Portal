import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validatePassword = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pwd);

  const handleReset = () => {
    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    if (!validatePassword(password)) {
      return alert(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol."
      );
    }

    // Perform password reset logic here (API call etc.)
    alert("Password reset successful!");
    navigate("/login"); // 🔁 Redirect to login page
  };

  return (
    <div className="max-w-md w-full mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Set New Password</h2>
      <p className="mb-2 text-gray-600 text-sm">Email: {email}</p>
      <input
        type="password"
        placeholder="Enter New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded p-2 w-full mb-4"
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="border rounded p-2 w-full mb-4"
      />
      <button
        onClick={handleReset}
        className="bg-blue-600 text-white w-full py-2 rounded"
      >
        Reset Password
      </button>
    </div>
  );
};

export default ResetPassword;
