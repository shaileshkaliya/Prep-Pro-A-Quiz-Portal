// src/components/RegisterContent.jsx

import React from "react";
import { Link } from "react-router-dom";

const RegisterContent = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-8 m-8 w-7/12 backdrop-blur-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <div className="w-full">
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                E-Mail
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Confirm your password"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full py-2 bg-blue-500 text-white rounded"
            >
              Register
            </button>
          </form>
        </div>

        {/* Hyperlink to Login Page */}
        <p className="mt-4 text-center">
          Already have an account?
          <Link to="/login" className="text-blue-500">
            {" "}
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterContent;