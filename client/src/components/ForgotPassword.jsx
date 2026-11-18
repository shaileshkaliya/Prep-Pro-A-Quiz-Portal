// src/components/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = () => {
    // Send OTP logic here
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    // Check OTP logic here
    if (otp === "123456") { // replace with real check
      navigate("/reset-password", { state: { email } });
    } else {
      alert("Incorrect OTP");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
      <input
        type="email"
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded p-2 w-full mb-4"
        required
      />
      {!otpSent ? (
        <button
          onClick={handleSendOtp}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Send OTP
        </button>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border rounded p-2 w-full my-4"
          />
          <button
            onClick={handleVerifyOtp}
            className="bg-green-600 text-white w-full py-2 rounded"
          >
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
