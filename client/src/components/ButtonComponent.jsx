// src/components/ButtonComponent.jsx

import React from 'react';

const ButtonComponent = ({ onButtonClick }) => {
  return (
    <div className="flex space-x-4 justify-center mt-4">
      <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => onButtonClick('home')}>
        Home
      </button>
      <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => onButtonClick('about')}>
        About Us
      </button>
      <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => onButtonClick('login')}>
        Login
      </button>
      <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => onButtonClick('register')}>
        Register
      </button>
    </div>
  );
};

export default ButtonComponent;
