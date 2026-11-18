import React from "react";

const QuestionCheck = ({ i, question, options, correctOption, explanation, currentChoice }) => {
  const displayExplanation = explanation ? explanation : "NA";

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Question {i}</h2>
      <p className="text-gray-600 mb-4">{question}</p>
      <div className="space-y-4">
        {options.map((option, index) => {
          let bgColor = "bg-white";
          let symbol = "";
          let textColor = "";

          if (currentChoice === -1) {
            if (index === correctOption) {
              bgColor = "bg-green-100";
              textColor = "text-green-500";
              symbol = "✓";
            }
          } else if (currentChoice === index) {
            if (currentChoice === correctOption) {
              bgColor = "bg-green-100";
              textColor = "text-green-500";
              symbol = "✓";
            } else {
              bgColor = "bg-red-100";
              textColor = "text-red-500";
              symbol = "✗";
            }
          } else if (currentChoice !== correctOption && index === correctOption) {
            bgColor = "bg-green-100";
            textColor = "text-green-500";
            symbol = "✓";
          }

          return (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-md ${bgColor}`}
            >
              <p>{option}</p>
              <span className={`text-2xl ${textColor}`}>{symbol}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-bold mb-2">Explanation</h3>
        <p className="text-gray-600">{displayExplanation}</p>
      </div>
    </div>
  );
};

export default QuestionCheck;
