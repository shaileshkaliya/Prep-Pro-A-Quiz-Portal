import React, { useState, useEffect } from "react";
import { ENDPOINTS } from "../utils/Constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddUsersManual = ({ userList, setUserList }) => {
  const [userCount, setUserCount] = useState(userList.length || 1);
  const token = localStorage.getItem('jwtToken');
  const navigate = useNavigate();

  useEffect(() => {
    const updatedList = Array.from(
      { length: userCount },
      (_, i) => userList[i] || { name: "", email: "", password: "" }
    );
    setUserList(updatedList);
  }, [userCount]);

  const handleInputChange = (index, field, value) => {
    const updated = [...userList];
    updated[index][field] = value;
    setUserList(updated);
  };

  const handleUserCountSubmit = (e) => {
    e.preventDefault();
    const newCount = parseInt(e.target.userCount.value) || 0;

    if (newCount < userCount) {
      const confirmed = window.confirm(
        "Reducing number of users will erase some data. Continue?"
      );
      if (!confirmed) return;
    } else if (newCount !== userCount) {
      const confirmed = window.confirm(
        "Changing count will reset all existing user input. Continue?"
      );
      if (!confirmed) return;
    }

    setUserCount(newCount);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(ENDPOINTS.USER.SIGNUP, userList, {
        headers: {
          "Content-Type": "application/json",
          jwtToken: token
        },
      });

      alert("Users added successfully!");
      navigate("/admindashboard/userscontent");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to add users.");
    }
  };

  const isFormValid = userList.every(
    (user) => user.name && user.email && user.password
  );

  return (
    <div>
      {/* User Count Input Form */}
      <form onSubmit={handleUserCountSubmit} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of users to add:
        </label>
        <input
          type="number"
          name="userCount"
          min="1"
          defaultValue={userCount}
          className="border p-2 w-32 rounded"
        />
        <p className="text-xs text-gray-500 mt-1">
          Hit <span className="font-semibold">Enter</span> to change number of
          users to add
        </p>
      </form>

      {/* User Entries */}
      <div className="space-y-6">
        {userList.map((user, index) => (
          <div key={index} className="p-4 border rounded-md bg-gray-50">
            <h4 className="font-semibold mb-2">User {index + 1}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                required
                placeholder="Name"
                value={user.name}
                onChange={(e) =>
                  handleInputChange(index, "name", e.target.value)
                }
                className="p-2 border rounded"
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={user.email}
                onChange={(e) =>
                  handleInputChange(index, "email", e.target.value)
                }
                className="p-2 border rounded"
              />
              <input
                type="text"
                required
                placeholder="Password"
                value={user.password}
                onChange={(e) =>
                  handleInputChange(index, "password", e.target.value)
                }
                className="p-2 border rounded"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!isFormValid}
        className={`mt-6 px-4 py-2 rounded text-white ${
          isFormValid
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Submit Users
      </button>
    </div>
  );
};

export default AddUsersManual;
