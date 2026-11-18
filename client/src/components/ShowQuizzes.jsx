import React, { useEffect, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../utils/Constants";
import { FaEllipsisV } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // 🔸 Import useNavigate
import "react-toastify/dist/ReactToastify.css";

const ShowQuizzes = () => {
  const [activeQuizzes, setActiveQuizzes] = useState([]);
  const [draftQuizzes, setDraftQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 🔸 Initialize navigate

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("jwtToken");

      const response = await axios.get(ENDPOINTS.QUIZ.GET_ALL_QUIZZES, {
        headers: {
          jwtToken: token,
        },
      });

      const allQuizzes = response.data;

      if (!Array.isArray(allQuizzes)) {
        throw new Error("Expected an array but got: " + typeof allQuizzes);
      }

      const active = allQuizzes.filter((q) => q.state === 1);
      const draft = allQuizzes.filter((q) => q.state === 0);

      setActiveQuizzes(active);
      setDraftQuizzes(draft);
    } catch (error) {
      console.error("Error fetching quizzes", error);
      toast.error("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  const deleteQuiz = async (quizId) => {
    const confirmDelete = window.confirm("Do you want to delete this quiz?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("jwtToken");
      await axios.delete(ENDPOINTS.QUIZ.DELETE_QUIZ(quizId), {
        headers: {
          jwtToken: token,
        },
      });

      // Update UI
      setActiveQuizzes((prev) => prev.filter((q) => q.quizId !== quizId));
      setDraftQuizzes((prev) => prev.filter((q) => q.quizId !== quizId));

      toast.success("Quiz deleted successfully!");
    } catch (error) {
      console.error("Error deleting quiz", error);
      toast.error("Failed to delete quiz");
    }
  };

  const renderTable = (quizzes) => (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Title
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Company
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Duration
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Questions
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz.quizId} className="border-b hover:bg-gray-50">
              <td
                className={`px-6 py-4 text-sm ${
                  quiz.state === 0
                    ? "text-blue-600 cursor-pointer hover:underline"
                    : ""
                }`}
                onClick={() => {
                  if (quiz.state === 0) {
                    navigate(`/${quiz.quizId}/addQuestions`, {
                      state: {
                        numQuestions: quiz.numQuestions,
                      },
                    });
                  }
                }}
                title={quiz.state === 0 ? "Click to add questions" : ""}
              >
                {quiz.title}
              </td>

              <td className="px-6 py-4 text-sm">{quiz.companyName}</td>
              <td className="px-6 py-4 text-sm">{quiz.quizTime} mins</td>
              <td className="px-6 py-4 text-sm">{quiz.numQuestions}</td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                    quiz.state === 1 ? "bg-green-500" : "bg-yellow-500"
                  }`}
                >
                  {quiz.state === 1 ? "Active" : "Draft"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <button
                  className="text-gray-600 hover:text-red-500"
                  onClick={() => deleteQuiz(quiz.quizId)}
                  title="Delete Quiz"
                >
                  <FaEllipsisV />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return <div className="text-center text-lg mt-6">Loading quizzes...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-center mb-6">
        <h2 className="text-2xl font-bold">All Quizzes</h2>
      </div>

      {activeQuizzes.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2 text-green-700">
            Active Quizzes
          </h3>
          {renderTable(activeQuizzes)}
        </div>
      )}

      {draftQuizzes.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2 text-yellow-600">
            Draft Quizzes
          </h3>
          {renderTable(draftQuizzes)}
        </div>
      )}

      {activeQuizzes.length === 0 && draftQuizzes.length === 0 && (
        <div className="text-center text-gray-600 mt-6">No quizzes found.</div>
      )}
    </div>
  );
};

export default ShowQuizzes;
