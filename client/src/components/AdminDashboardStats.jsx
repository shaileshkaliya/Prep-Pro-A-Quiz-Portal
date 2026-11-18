import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboardStats = ({ totalTests, activeTests, participants }) => {
  const testsData = {
    labels: ['Active Tests', 'Inactive Tests'],
    datasets: [
      {
        data: [activeTests, totalTests - activeTests],
        backgroundColor: ['#7e57c2', '#e0e0e0'], // purple for active
        hoverBackgroundColor: ['#9575cd', '#f5f5f5'],
      },
    ],
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h3 className="text-lg font-bold">Total Tests</h3>
        <p className="text-4xl font-bold">{totalTests}</p>
        <div className="w-32 h-32 mx-auto mt-4">
          <Pie data={testsData} />
        </div>
        <p className="text-center text-purple-600 font-semibold mt-2">
          Active Tests: {activeTests}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-bold">Total Participants</h3>
        <p className="text-5xl font-bold text-center mt-12 text-[#009688]">
          {participants}
        </p>
      </div>
    </div>
  );
};

export default AdminDashboardStats;
