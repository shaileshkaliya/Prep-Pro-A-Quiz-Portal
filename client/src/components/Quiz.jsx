import React from 'react';
import QuizQuestion from './QuizQuestion';

const Quiz = ({ quizData }) => {
  return (
    <div className="container mx-auto">
      {quizData.map((questionData, index) => (
        <QuizQuestion key={index} {...questionData} />
      ))}
    </div>
  );
};

export default Quiz;