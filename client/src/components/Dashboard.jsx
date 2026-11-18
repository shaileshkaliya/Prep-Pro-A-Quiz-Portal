import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';

const Dashboard = ({ onLogout }) => {
  const [activePanel, setActivePanel] = useState('Dashboard');
  const navigate = useNavigate();

  const handlePanelChange = (panel, path) => {
    setActivePanel(panel);
    navigate(`/dashboard${path}`); 
  };

  return (
    <div className="flex mt-16 h-full w-full min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-6 flex-shrink-0">
        <ul className="space-y-4">
          <li>
            <button
              className={`w-full py-2 px-4 rounded ${activePanel === 'Dashboard' ? 'bg-blue-500' : 'hover:bg-gray-600'}`}
              onClick={() => handlePanelChange('Dashboard', '')}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              className={`w-full py-2 px-4 rounded ${activePanel === 'quizzes' ? 'bg-blue-500' : 'hover:bg-gray-600'}`}
              onClick={() => handlePanelChange('quizzes', '/companies')}
            >
              Quizzes
            </button>
          </li>
          <li>
            <button
              className={`w-full py-2 px-4 rounded ${activePanel === 'My Results' ? 'bg-blue-500' : 'hover:bg-gray-600'}`}
              onClick={() => handlePanelChange('My Results', '/resultdashboard')}
            >
              My Results
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col">
        {/* DashboardHeader */}
        <DashboardHeader onLogout={onLogout} />

        {/* Render content based on route using Outlet */}
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
