import React from 'react';

const QuizScorecard = ({ quizName, score, maxQuestions, questionsAttempted, totalTime, timeUtilized, correctAnswers, wrongAnswers, unattempted }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{quizName}</h2>
      <p className="text-green-500 mb-4">Your Quiz has been successfully submitted!</p>

      <div className="flex items-center mb-4">

        <div className="flex items-center justify-center w-[160px] h-[160px] border-4 border-gray-500 rounded-full m-10">
          <div className="bg-blue-500 border-3 border-white rounded-full flex items-center justify-center w-[150px] h-[150px] px-2 py-0 ">
            <span className="text-2xl font-bold">{score}%</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Max. Questions</p>
              <p className="font-bold">{maxQuestions}</p>
            </div>
            <div>
              <p className="text-gray-600">Questions Attempted</p>
              <p className="font-bold">{questionsAttempted}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Time</p>
              <p className="font-bold">{totalTime} mins</p>
            </div>
            <div>
              <p className="text-gray-600">Time Utilized</p>
              <p className="font-bold">{timeUtilized} mins</p>
            </div>
            <div>
              <p className="text-gray-600">Correct Answer</p>
              <p className="font-bold">{correctAnswers}</p>
            </div>
            <div>
              <p className="text-gray-600">Wrong Answer</p>
              <p className="font-bold">{wrongAnswers}</p>
            </div>
            <div>
              <p className="text-gray-600">Unattempted</p>
              <p className="font-bold">{unattempted}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizScorecard;