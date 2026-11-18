// DashboardContent.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardStats from './DashboardStats';
import LastTestReport from './LastTestReport';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ENDPOINTS } from '../utils/Constants';

const DashboardContent = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [lastTestReportData, setLastTestReportData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const userId = localStorage.getItem('userId'); 

        const response = await axios.get(ENDPOINTS.QPFENTRY.GET_DASHBOARD_DATA(userId), {
          headers: {
            'Content-Type': 'application/json',
            jwtToken: token,
          }
        });

        const data = response.data;

        console.log(data);

        setDashboardStats({
          totalTestsAttempted: data.totalTestsAttempted,
          avgScore: data.averageScorePercentage,
        });

        setLastTestReportData({
          maxScore: data.maxScore,
          totalTestTime: data.totalTestTimeMins,
          totalQuestions: data.totalQuestions,
          yourScore: data.yourScore,
          youSpend: data.totalTimeSpentMins,
          correct: data.totalCorrectAnswers,
          incorrect: data.totalIncorrectAnswers,
          percentage: data.percentage,
        });

        toast.success('Dashboard data loaded successfully!');
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Something went wrong while loading dashboard data!');
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-16">
      {/* <ToastContainer /> */}
      <div className="bg-white p-4 rounded-lg shadow-md flex-1">
        {dashboardStats && (
          <DashboardStats
            totalTestsAttempted={dashboardStats.totalTestsAttempted}
            avgScore={dashboardStats.avgScore}
          />
        )}
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md flex-1">
        {lastTestReportData && <LastTestReport {...lastTestReportData} />}
      </div>
    </div>
  );
};

export default DashboardContent;
