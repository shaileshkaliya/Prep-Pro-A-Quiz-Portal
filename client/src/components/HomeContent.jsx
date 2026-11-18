// src/components/HomeContent.jsx

import React from 'react';
import homeImage from '../assets/image.png'; // Import your image
import contactImage from '../assets/contact-us.jpg';
import bgImage from '../assets/bgimage.png'; // Import your background image

const HomeContent = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
      {/* Full-Screen Hero Section */}
      <div
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Overlay */}
        {/* <div className="absolute inset-0 bg-black bg-opacity-50"></div> */}

        {/* Hero Content */}
        {/* <div className="relative text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Our Platform
          </h1>
          <p className="text-lg md:text-2xl">
            Empowering Learning and Assessment with Innovation
          </p>
        </div> */}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-8 px-4 md:px-16 items-center">
        {/* Left - Home Image */}
        <div className="flex justify-center">
          <img
            src={homeImage}
            alt="Home"
            className="shadow-lg rounded-lg w-full h-auto max-w-md lg:max-w-lg object-cover"
          />
        </div>

        {/* Right - About Us */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            About Us
          </h2>
          <p className="text-gray-600 text-lg mb-4">
            Welcome to our platform, where innovation meets convenience. We
            specialize in creating cutting-edge solutions to make learning and
            assessment processes more effective. Whether you’re a student aiming
            to excel, an educator looking for streamlined tools, or an
            organization needing comprehensive assessment services, we have you
            covered.
          </p>
          <p className="text-gray-600 text-lg">
            Our platform offers a seamless experience with features like real-time
            analytics, personalized feedback, and adaptive assessments. With a
            focus on user-friendly design and reliability, we empower our users to
            achieve their goals with confidence.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-8 px-4 md:px-16 bg-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Platform Stats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {/* Card 1 */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700">
              Total Tests Taken
            </h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">5,000+</p>
          </div>
          {/* Card 2 */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700">
              Total Questions
            </h3>
            <p className="text-2xl font-bold text-green-600 mt-2">20,000+</p>
          </div>
          {/* Card 3 */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700">
              Number of Users
            </h3>
            <p className="text-2xl font-bold text-purple-600 mt-2">10,000+</p>
          </div>
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="py-8 px-4 md:px-16 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Contact Us
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              Have questions or need assistance? Reach out to us using the
              information below.
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Phone:</strong> +1-234-567-890
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Email:</strong> contact@ourplatform.com
            </p>
          </div>

          {/* Decorative Image */}
          <div className="text-center">
            <img
              src={contactImage}
              alt="Contact"
              className="w-full max-w-xs mx-auto"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 bg-gray-800 text-white text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Our Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomeContent;
