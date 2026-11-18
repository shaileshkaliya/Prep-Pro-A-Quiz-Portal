// AddUsersFileUpload.js
import React, { useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../utils/Constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddUsersFileUpload = ({ onCSVParsed }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleCSVUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.warning("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsUploading(true);

      const jwtToken = localStorage.getItem("jwtToken");

      const res = await axios.post(ENDPOINTS.USER.BULK_ADD, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "jwtToken": jwtToken, // 🔐 Include token here
        },
      });

      onCSVParsed(res.data);
      toast.success("Users successfully uploaded!");
    } catch (err) {
      console.error("CSV upload failed:", err);
      toast.error("Failed to parse CSV.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleCSVUpload}
      className="w-full max-w-lg border p-6 rounded-md shadow-md"
    >
      <label className="block mb-4">
        <span className="text-lg font-medium">Upload CSV File:</span>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="mt-2 block w-full border p-2"
          required
        />
      </label>

      <div className="mb-4 text-sm text-gray-700">
        <p>
          📄 Your CSV file should follow the{" "}
          <a
            href="https://your-domain.com/sample.csv"
            download
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            sample format
          </a>
          .
        </p>
      </div>

      <button
        type="submit"
        disabled={isUploading}
        className={`${
          isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"
        } text-white px-4 py-2 rounded-md`}
      >
        {isUploading ? "Uploading..." : "Submit CSV"}
      </button>
    </form>
  );
};

export default AddUsersFileUpload;
