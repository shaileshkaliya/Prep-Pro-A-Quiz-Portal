// src/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="mx-auto flex justify-between items-center">
        <h1 className="text-white lg:text-3xl md:text-2xl sm:text-xl text-sm font-bold sm:ml-12"><a href="/">PrepPro.</a></h1>
        <div className="lg:text-lg md:text-md text-sm sm:space-x-8 space-x-2 sm:mr-12 ">
          <Link to="/" className="text-white hover:text-gray-200">Home</Link>
          {/* <Link to="/register" className="text-white hover:text-gray-200">Register</Link> */}
          <Link to="/dashboard" className="text-white hover:text-gray-200">User Dashboard</Link>
          <Link to="/adminlogin" className='text-white hover:text-gray-200'>Admin Dashboard</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
