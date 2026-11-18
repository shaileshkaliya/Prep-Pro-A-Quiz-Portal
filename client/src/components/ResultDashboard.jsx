import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../utils/Constants';

const ResultDashboard = () => {
  const [testResults, setTestResults] = useState([]);
  const [expandedTest, setExpandedTest] = useState(null);

  const userId = localStorage.getItem("userId"); // or however you're storing it
  const jwtToken = localStorage.getItem("jwtToken"); // assuming stored after login

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(ENDPOINTS.QPFENTRY.GET_STUDENTS_QUIZ_RESULTS(userId), {
          headers: {
            jwtToken: jwtToken,
          },
        });
        console.log(response);

        // Transform the data to match the required UI structure
        const transformedData = response.data.map((item) => ({
          id: item.quizId,
          testName: item.quizTitle,
          maxScore: item.params.maxScore,
          totalTestTime: item.params.totalTime,
          totalQuestions: item.params.totalQuestions,
          yourScore: item.params.gainedScore,
          youSpend: item.params.timeSpent,
          percentage: ((item.params.gainedScore / item.params.maxScore) * 100).toFixed(2),
          correct: item.params.correctAttempted,
          incorrect: item.params.incorrectAttempted,
          unattempted: item.params.unAttempted,
        }));

        setTestResults(transformedData);
      } catch (error) {
        console.error("Error fetching quiz results:", error);
      }
    };

    fetchResults();
  }, [userId, jwtToken]);

  const toggleTestDetails = (index) => {
    setExpandedTest(expandedTest === index ? null : index);
  };

  return (
    <div className="p-6">
      <section className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Test-Wise Performance Report</h2>
        {testResults.length > 0 ? (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Quiz Name</th>
                <th className="py-2 px-4 text-center">Max Score</th>
                <th className="py-2 px-4 text-center">Your Score</th>
                <th className="py-2 px-4 text-center">Percentage</th>
                <th className="py-2 px-4 text-left">More Details</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((quiz, index) => (
                <React.Fragment key={quiz.id}>
                  <tr className="bg-gray-50">
                    <td className="py-2 px-4 text-left">{quiz.testName}</td>
                    <td className="py-2 px-4 text-center">{quiz.maxScore}</td>
                    <td className="py-2 px-4 text-center">{quiz.yourScore}</td>
                    <td className="py-2 px-4 text-center">{quiz.percentage}%</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => toggleTestDetails(index)}
                        className="text-blue-500 hover:underline"
                      >
                        {expandedTest === index ? "Hide" : "Show"}
                      </button>
                    </td>
                  </tr>
                  {expandedTest === index && (
                    <tr>
                      <td colSpan={5} className="pr-20">
                        <div className="space-y-4 w-full bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <p className="text-gray-500">Total Test Time (Mins)</p>
                            <p className="font-bold">{quiz.totalTestTime}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-gray-500">Your Time Spent (Mins)</p>
                            <p className="font-bold">{quiz.youSpend}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-gray-500">Total Questions</p>
                            <p className="font-bold">{quiz.totalQuestions}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-gray-500">Correct Answers</p>
                            <p className="font-bold">{quiz.correct}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-gray-500">Incorrect Answers</p>
                            <p className="font-bold">{quiz.incorrect}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-gray-500">Unattempted Questions</p>
                            <p className="font-bold">{quiz.unattempted}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No test data available.</p>
        )}
      </section>
    </div>
  );
};

export default ResultDashboard;
