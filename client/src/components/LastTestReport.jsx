// src/components/LastTestReport.jsx
import React from 'react';

const LastTestReport = ({
  maxScore = 0,
  totalTestTime = 0,
  totalQuestions = 0,
  yourScore = 0,
  youSpend = 0,
  correct = 0,
  incorrect = 0,
  percentage = 0
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Last Test Report</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500">Max Score of Test</p>
          <p className="text-2xl font-bold">{maxScore}</p>
        </div>
        <div>
          <p className="text-gray-500">Total Test Time (Mins)</p>
          <p className="text-2xl font-bold">{totalTestTime}</p>
        </div>
        <div>
          <p className="text-gray-500">Total Questions</p>
          <p className="text-2xl font-bold">{totalQuestions}</p>
        </div>
        <div>
          <p className="text-gray-500">Your Score</p>
          <p className="text-2xl font-bold">{yourScore}</p>
        </div>
        <div>
          <p className="text-gray-500">You Spend (Mins)</p>
          <p className="text-2xl font-bold">{youSpend.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500">Correct Answers</p>
          <p className="text-2xl font-bold">{correct}</p>
        </div>
        <div>
          <p className="text-gray-500">Incorrect Answers</p>
          <p className="text-2xl font-bold">{incorrect}</p>
        </div>
        <div>
          <p className="text-gray-500">Percentage</p>
          <p className="text-2xl font-bold">{percentage.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
};

export default LastTestReport;
