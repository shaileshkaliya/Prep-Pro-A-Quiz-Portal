import React, { useState, useEffect } from "react";

const QuizWindowQuestionContent = ({
  currentQuestion,
  questions,
  userAnswers,
  handleOptionClick,
  setCurrentQuestion,
}) => {
  const [selectedOptions, setSelectedOptions] = useState(new Map()); // For storing selected options

  useEffect(() => {
    // Initialize the selectedOptions map when questions or userAnswers change
    const initialMap = new Map();
    userAnswers.forEach((answer, index) => {
      initialMap.set(questions[index].questionId, answer); // Map questionId to selected answer
    });
    setSelectedOptions(initialMap);
  }, [userAnswers, questions]);

  const handleOptionSelect = (option) => {
    // Save the selected option in the map
    const updatedMap = new Map(selectedOptions);
    updatedMap.set(questions[currentQuestion].questionId, option); // Use questionId instead of question text
    setSelectedOptions(updatedMap);
    handleOptionClick(option); // Update the parent component's userAnswers
  };

  return (
    <div className="flex-grow p-6 bg-gray-50 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">
        Question {currentQuestion + 1}
      </h2>
      <p className="mb-6">{questions[currentQuestion].questionContent}</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {Object.entries(questions[currentQuestion].options).map(([key, value], index) => {
          const isSelected = selectedOptions.get(questions[currentQuestion].questionId) === key;
          return (
            <button
              key={index}
              onClick={() => handleOptionSelect(key)}
              className={`w-full text-left p-3 rounded border hover:bg-blue-100 ${
                isSelected ? "bg-green-500 text-white hover:bg-green-500" : ""
              }`}
            >
              {`${key}: ${value}`}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between">
        <button
          onClick={() =>
            setCurrentQuestion((prev) => Math.max(prev - 1, 0))
          }
          disabled={currentQuestion === 0}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() =>
            setCurrentQuestion((prev) =>
              Math.min(prev + 1, questions.length - 1)
            )
          }
          disabled={currentQuestion === questions.length - 1}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuizWindowQuestionContent;
