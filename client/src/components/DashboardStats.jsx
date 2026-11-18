// src/components/DashboardStats.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardStats = ({ totalTestsAttempted, avgScore }) => {
  const avgScoreData = {
    labels: ['Avg. Score', 'Remaining'],
    datasets: [
      {
        data: [avgScore, 100 - avgScore],
        backgroundColor: ['#4CAF50', '#e0e0e0'],
        hoverBackgroundColor: ['#66BB6A', '#f5f5f5'],
      },
    ],
  };

  const testsAttemptedData = {
    labels: ['Tests Attempted', 'Remaining'],
    datasets: [
      {
        data: [totalTestsAttempted, 100 - totalTestsAttempted],
        backgroundColor: ['#FF9800', '#e0e0e0'],
        hoverBackgroundColor: ['#FFB74D', '#f5f5f5'],
      },
    ],
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h3 className="text-lg font-bold">Total Tests Attempted</h3>
        <p className="text-4xl font-bold">{totalTestsAttempted}</p>
        <div className="w-32 h-32 mx-auto mt-4">
          <Pie data={testsAttemptedData} />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold">Avg. Score</h3>
        <p className="text-4xl font-bold">{avgScore}%</p>
        <div className="w-32 h-32 mx-auto mt-4">
          <Pie data={avgScoreData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
