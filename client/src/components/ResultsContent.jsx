import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../utils/Constants";

const ResultsContent = () => {
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("jwtToken"); // Assuming token is stored in localStorage
        const response = await axios.get(
          ENDPOINTS.QPFENTRY.GET_RESULTS_OVERVIEW, // ✅ Your actual API endpoint
          {
            headers: {
              jwtToken: token,
            },
          }
        );

        // Convert the returned map to an array
        const resultsArray = Object.entries(response.data).map(([quizId, stats]) => ({
          quizId,
          quizTitle: stats.title,
          attempts: stats.totalAttempts,
          avgScore: stats.averageScore,
          maxScore: stats.maxScore,
        }));

        setQuizResults(resultsArray);
      } catch (error) {
        console.error("Failed to fetch quiz results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-500 text-lg">Loading quiz results...</div>
    );
  }

  return (
    <div className="w-full mx-auto mt-16 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Quiz Results Overview</h2>
      <table className="w-full border text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border-b">Quiz Title</th>
            <th className="p-3 border-b">Total Attempts</th>
            <th className="p-3 border-b">Average Score</th>
            <th className="p-3 border-b">Max Score</th>
          </tr>
        </thead>
        <tbody>
          {quizResults.map((quiz) => (
            <tr
              key={quiz.quizId}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/admindashboard/quiz/${quiz.quizTitle}/${quiz.quizId}/results`)}
            >
              <td className="p-3 border-b">{quiz.quizTitle}</td>
              <td className="p-3 border-b">{quiz.attempts}</td>
              <td className="p-3 border-b">{quiz.avgScore.toFixed(2)}%</td>
              <td className="p-3 border-b">{quiz.maxScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsContent;
