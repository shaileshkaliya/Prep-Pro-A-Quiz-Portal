// AddUser.jsx
import React, { useState } from "react";
import AddUsersFileUpload from "./AddUsersFileUpload";
import AddUsersManual from "./AddUsersManual";

const AddUser = () => {
  const [activeTab, setActiveTab] = useState("manual");
  const [userList, setUserList] = useState([]);

  const handleCSVParsed = (parsedData) => {
    setUserList(parsedData); // Update user list
    setActiveTab("manual"); // Switch to manual tab
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 border rounded shadow bg-white">
      {/* Tabs */}
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab("manual")}
          className={`px-4 py-2 mr-2 rounded-t ${
            activeTab === "manual" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Manual Add
        </button>
        <button
          onClick={() => setActiveTab("csv")}
          className={`px-4 py-2 rounded-t ${
            activeTab === "csv" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Upload CSV
        </button>
      </div>

      {/* Content */}
      <div className="border-t pt-4">
        {activeTab === "manual" ? (
          <AddUsersManual userList={userList} setUserList={setUserList} />
        ) : (
          <AddUsersFileUpload onCSVParsed={handleCSVParsed} />
        )}
      </div>
    </div>
  );
};

export default AddUser;
