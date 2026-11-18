import React from "react";

const QuizWindowHeader = ({ timeLeft, handleFinish }) => {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <header className="flex justify-between items-center mb-4 p-4 bg-blue-500 text-white">
  <h1 className="font-bold text-lg">Mock Test - Quiz Name</h1>
  <div className="flex items-center gap-4">
    <button
      onClick={handleFinish}
      className="bg-green-500 px-4 py-2 rounded"
    >
      Finish
    </button>
    <div className="font-bold text-lg">{formatTime(timeLeft)}</div>
  </div>
</header>

  );
};

export default QuizWindowHeader;
