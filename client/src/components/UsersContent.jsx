import React from 'react';
import { useNavigate } from 'react-router-dom';

const UsersContent = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 max-w-4xl w-full mt-16 mx-auto items-center p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4">User Management</h2>

      <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-md shadow text-lg w-full md:w-auto"
          onClick={() => navigate('/admindashboard/showusers')}
        >
          Show All Users
        </button>

        <button
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-md shadow text-lg w-full md:w-auto"
          onClick={() => navigate('/admindashboard/adduser')}
        >
          Add New User
        </button>
      </div>
    </div>
  );
};

export default UsersContent;
