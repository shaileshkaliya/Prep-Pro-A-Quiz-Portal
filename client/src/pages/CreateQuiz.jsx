import React, { useState } from "react";
import { ENDPOINTS } from '../utils/Constants';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function CreateQuiz() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    quizTitle: "",
    companyName: "",
    quizTime: "",
    numQuestions: "",
  });

  const token = localStorage.getItem('jwtToken');

  const [isValid, setIsValid] = useState(true); // For controlling submit

  const isPositiveInteger = (value) => {
    const num = Number(value);
    return Number.isInteger(num) && num > 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate numbers if applicable
    if (name === "quizTime" || name === "numQuestions") {
      if (!isPositiveInteger(value)) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final check before submission
    if (!isPositiveInteger(formData.quizTime) || !isPositiveInteger(formData.numQuestions)) {
      alert("Quiz Time and Number of Questions must be valid positive integers (no decimals).");
      return;
    }

    try {
      const payload = {
        title: formData.quizTitle,
        companyName: formData.companyName,
        quizTime: parseInt(formData.quizTime),
        numQuestions: parseInt(formData.numQuestions),
      };


      const response = await axios.post(ENDPOINTS.QUIZ.CREATE, payload, {
        headers: {
          'Content-Type': 'application/json',
          'jwtToken': token,
        },
      });

      if (response.status === 201) {
        alert('Quiz created successfully!');
        navigate(`/${response.data}/addQuestions`, {
            state: {
              numQuestions: formData.numQuestions
            }
          });          
      }
    } catch (error) {
      alert('Failed to create quiz.'+ error);
    }
  };

  return (
    <div className="w-full border flex justify-center">
      <div className="sm:w-1/2 w-3/4 flex flex-col p-4 pt-8 items-center gap-10">
        <h2 className="lg:text-2xl md:text-xl sm:text-lg text-sm font-semibold text-gray-800">
          Create New Quiz
        </h2>

        <form
          onSubmit={handleSubmit}
          className="sm:w-3/4 w-full flex flex-col justify-center sm:p-2 p-0.5 gap-4 lg:text-sm text-xs"
        >
          <div>
            <p className="pl-1">Quiz Title</p>
            <input
              className="h-10 w-full p-2 border border-gray-300 bg-transparent rounded-md shadow-sm focus:outline-none"
              type="text"
              name="quizTitle"
              value={formData.quizTitle}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <p className="pl-1">Company Name</p>
            <input
              className="h-10 w-full p-2 border border-gray-300 bg-transparent rounded-md shadow-sm focus:outline-none"
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <p className="pl-1">Quiz Time in Minutes</p>
            <input
              className="h-10 w-full p-2 border border-gray-300 bg-transparent rounded-md shadow-sm focus:outline-none"
              type="text" // ← changed to text
              name="quizTime"
              value={formData.quizTime}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <p className="pl-1">Number of Questions</p>
            <input
              className="h-10 w-full p-2 border border-gray-300 bg-transparent rounded-md shadow-sm focus:outline-none"
              type="text" // ← changed to text
              name="numQuestions"
              value={formData.numQuestions}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={!isValid}
              className={`py-1 px-8 rounded-sm text-white outline-none shadow-md border-1 border-gray-900 ${
                isValid ? 'bg-[#2563eb] hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
