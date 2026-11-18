import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { ENDPOINTS } from "../utils/Constants";

const QuizResultsPage = () => {
  const { quizName,quizId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [results, setResults] = useState([]);

  const fetchQuizResults = async () => {
    try {
      const token = localStorage.getItem("jwtToken");

      const response = await axios.get(
        ENDPOINTS.QPFENTRY.GET_QUIZ_RESULTS(quizId),
        {
          headers: { jwtToken: token },
        }
      );

      setResults(response.data);
    } catch (error) {
      console.error("Error fetching quiz results:", error);
      toast.error("Failed to fetch quiz results.");
    }
  };

  useEffect(() => {
    fetchQuizResults();
  }, [quizId]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
  };

  const filteredResults = useMemo(() => {
    return results
      .filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => (sortAsc ? a.gainedScore - b.gainedScore : b.gainedScore - a.gainedScore));
  }, [results, searchQuery, sortAsc]);

  const exportToCSV = () => {
    const headers = ["Name", "Score", "Total", "Time Taken", "Percentage"];
    const rows = filteredResults.map((item) => [
      item.name,
      item.gainedScore,
      item.maxScore,
      formatTime(item.timeSpent),
      item.percentage.toFixed(2) + "%",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `quiz_${quizId}_results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full p-6 overflow-auto">
      <div className="bg-white rounded-xl shadow-md p-6 min-h-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Quiz Results for quiz : {quizName}
          </h2>
          <div className="flex gap-2 items-center w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setSortAsc((prev) => !prev)}
              className="flex items-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
              title="Sort by Score"
            >
              {sortAsc ? (
                <>
                  <FaArrowUp className="mr-1" /> Score
                </>
              ) : (
                <>
                  <FaArrowDown className="mr-1" /> Score
                </>
              )}
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <FiDownload className="mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 border-b text-left">Student Name</th>
                <th className="px-4 py-3 border-b">Score</th>
                <th className="px-4 py-3 border-b">Time Taken</th>
                <th className="px-4 py-3 border-b">% Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.length > 0 ? (
                filteredResults.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 transition text-center"
                  >
                    <td className="px-4 py-3 border-b text-left">{item.name}</td>
                    <td className="px-4 py-3 border-b">
                      {item.gainedScore}/{item.maxScore}
                    </td>
                    <td className="px-4 py-3 border-b">{formatTime(item.timeSpent)}</td>
                    <td className="px-4 py-3 border-b">
                      {item.percentage.toFixed(2)}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No results match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuizResultsPage;
