import React from "react";

const QuizWindowSidebar = ({ questions, userAnswers, setCurrentQuestion }) => {
  const answeredCount = userAnswers.filter((answer) => answer).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <aside className="w-1/4 flex flex-col bg-gray-200 p-4 h-full">
    <h2 className="font-bold text-lg mb-4">Questions</h2>
    <div className="mb-4">
      <p>
        <strong>Answered:</strong> {answeredCount}
      </p>
      <p>
        <strong>Unanswered:</strong> {unansweredCount}
      </p>
    </div>
    <div className="grid grid-cols-4 gap-3">
      {questions.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentQuestion(index)}
          className={`aspect-square w-full rounded text-sm ${
            userAnswers[index]
              ? "bg-green-500 text-white"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  </aside>
  
  );
};

export default QuizWindowSidebar;
