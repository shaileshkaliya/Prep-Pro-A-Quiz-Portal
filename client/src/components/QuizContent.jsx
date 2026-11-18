import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuizContent = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 max-w-4xl w-full mx-auto items-center mt-16 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4">Quiz Management</h2>

      <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-md shadow text-lg w-full md:w-auto"
          onClick={() => navigate('/admindashboard/createquiz')}
        >
          Create New Quiz
        </button>

        <button
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-md shadow text-lg w-full md:w-auto"
          onClick={() => navigate('/admindashboard/showquizzes')}
        >
          Show All Quizzes
        </button>
      </div>
    </div>
  );
};

export default QuizContent;
