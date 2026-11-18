import React from 'react';
import QuizScorecard from './Score'; // Adjust the path if needed

function App() {
  const quizData = {
    quizName: 'My Quiz',
    score: 78,
    maxQuestions: 90,
    questionsAttempted: 75,
    totalTime: 90,
    timeUtilized: 88.5,
    correctAnswers: 54,
    wrongAnswers: 16,
    unattempted: 5,
  };
  return (
    <div>
      <QuizScorecard {...quizData} />
    </div>
  );
}

export default App;