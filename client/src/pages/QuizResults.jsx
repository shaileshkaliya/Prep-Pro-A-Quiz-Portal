import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Clock,
  ClipboardList,
  CheckCircle,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  Percent,
} from "lucide-react";
import { ENDPOINTS } from "../utils/Constants";

const QuizResults = () => {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { quizId } = useParams(); // Assumes route like /result/:userId/:quizId
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(ENDPOINTS.QPFENTRY.GET_ENTRY(userId, quizId), {
        headers: {
          jwtToken: token,
        },
      })
      .then((res) => {
        setQuizData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        navigate("/dashboard");
      });
  }, [userId, quizId, navigate]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-blue-50 text-xl font-semibold">
        Loading Results...
      </div>
    );
  }

  const {
    totalQuestions,
    correctAttempted,
    incorrectAttempted,
    unAttempted,
    timeSpent,
    gainedScore,
    maxScore,
  } = quizData;

  const stats = [
    {
      label: "Total Time Taken",
      value: formatTime(timeSpent),
      icon: <Clock className="text-blue-600 w-8 h-8 mr-4" />,
      bg: "bg-blue-50",
      text: "text-blue-800",
    },
    {
      label: "Total Questions",
      value: totalQuestions,
      icon: <ClipboardList className="text-purple-600 w-8 h-8 mr-4" />,
      bg: "bg-purple-50",
      text: "text-purple-800",
    },
    {
      label: "Correct Answers",
      value: correctAttempted,
      icon: <ThumbsUp className="text-emerald-600 w-8 h-8 mr-4" />,
      bg: "bg-emerald-50",
      text: "text-emerald-800",
    },
    {
      label: "Incorrect Answers",
      value: incorrectAttempted,
      icon: <ThumbsDown className="text-orange-600 w-8 h-8 mr-4" />,
      bg: "bg-orange-50",
      text: "text-orange-800",
    },
    {
      label: "Unattempted",
      value: unAttempted,
      icon: <XCircle className="text-red-600 w-8 h-8 mr-4" />,
      bg: "bg-red-50",
      text: "text-red-800",
    },
  ];

  const scorePercentage = Math.round((gainedScore / maxScore) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          🎯 Test Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className={`flex items-center ${stat.bg} p-5 rounded-xl shadow`}>
              {stat.icon}
              <div>
                <p className="text-gray-500">{stat.label}</p>
                <p className={`text-lg font-semibold ${stat.text}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Score Section */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center bg-indigo-50 p-8 rounded-xl shadow-lg w-3/4 sm:w-1/2">
            <Percent className="text-indigo-600 w-12 h-12 mr-6" />
            <div>
              <p className="text-gray-500">Score</p>
              <p className="text-4xl font-semibold text-indigo-800">{scorePercentage}%</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg transition-all duration-200 shadow-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
