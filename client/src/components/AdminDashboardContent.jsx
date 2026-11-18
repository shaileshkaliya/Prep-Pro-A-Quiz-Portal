import React, { useEffect, useState } from 'react';
import AdminDashboardStats from './AdminDashboardStats';
import axios from 'axios';
import { ENDPOINTS } from '../utils/Constants';

const AdminDashboardContent = () => {
  const [dashboardData, setDashboardData] = useState({
    totalTests: 0,
    activeTests: 0,
    participants: 0,
  });

  const fetchAdminDashboardData = async () => {
    try {
      const jwtToken = localStorage.getItem('jwtToken'); // Assumes token is stored here
      if (!jwtToken) {
        console.error('JWT token not found in localStorage');
        return;
      }

      const response = await axios.get(ENDPOINTS.USER.FETCH_ADMIN_DASHBOARD_DATA, {
        headers: {
          jwtToken: jwtToken,
        },
      });

      const data = response.data;

      if (
        data.totalTests !== undefined &&
        data.activeTests !== undefined &&
        data.participants !== undefined
      ) {
        setDashboardData({
          totalTests: data.totalTests,
          activeTests: data.activeTests,
          participants: data.participants,
        });
      } else {
        console.error('Incomplete data received:', data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchAdminDashboardData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-16">
      <div className="bg-white p-4 rounded-lg shadow-md flex-1">
        <AdminDashboardStats 
          totalTests={dashboardData.totalTests}
          activeTests={dashboardData.activeTests}
          participants={dashboardData.participants}
        />
      </div>
    </div>
  );
};

export default AdminDashboardContent;
