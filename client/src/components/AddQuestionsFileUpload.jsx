import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ENDPOINTS } from "../utils/Constants";
import { toast } from "react-toastify";

export default function AddQuestionsFileUpload() {
  const [csvFile, setCsvFile] = useState(null);
  const { quizId } = useParams();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleCSVUpload = async (e) => {
    e.preventDefault();

    if (!csvFile) {
      toast.warning("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      const response = await axios.post(
        ENDPOINTS.QUESTION.BULK_ADD, // <-- should be bulk-add/{quizId}
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
            // jwtToken: localStorage.getItem("jwtToken"), // or however you're storing it
          },
        }
      );

      if (response.status === 201) {
        const importedQuestions = response.data;
        const numQuestions = importedQuestions.length;

        toast.success("CSV uploaded successfully!", {
          position: "top-right",
          autoClose: 1500,
        });

        setTimeout(() => {
          navigate(`/${quizId}/addQuestions`, {
            state: {
              importedQuestions,
              numQuestions,
            },
          });
        }, 1600);
      } else if (response.status === 400) {
        toast.warning("CSV format is incorrect.");
      } else {
        toast.error("Something went wrong while uploading.");
      }
    } catch (err) {
      console.error("Upload Error:", err);
      toast.error("Upload failed. Please try again.");
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
        className="bg-green-600 text-white px-4 py-2 rounded-md"
      >
        Submit CSV
      </button>
    </form>
  );
}
