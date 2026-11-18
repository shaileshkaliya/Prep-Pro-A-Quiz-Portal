import React from 'react';
import { useNavigate } from 'react-router-dom';

const WarningModal = ({ isOpen, onClose, testName }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleStartTest = () => {
    onClose(); 
    navigate('/quizwindow');  
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-xl font-semibold mb-4">Warning</h3>
        <p className="mb-4">Are you sure you want to start the test: <strong>{testName}</strong>?</p>
        <div className="flex justify-end">
          <button
            className="py-2 px-4 mr-2 bg-gray-500 text-white rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="py-2 px-4 bg-blue-500 text-white rounded"
            onClick={handleStartTest}
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
