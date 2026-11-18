import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ENDPOINTS } from '../utils/Constants';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Companies() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('jwtToken');

        const response = await axios.get(ENDPOINTS.QUIZ.GET_ALL_COMPANY_NAMES(), {
          headers: {
            'Content-Type': 'application/json',
            'jwtToken': token
          }
        });

        const data = response.data;

        if (data.message) {
          toast.error(data.message);
          return;
        }

        const companyList = Array.from(data.companyNames).map((name, index) => ({
          id: index + 1,
          name: name,
          description: `Explore quizzes by ${name}`
        }));

        setCompanies(companyList);
      } catch (err) {
        if (err.response) {
          if (err.response.status === 401) {
            toast.error("Unauthorized access. Please login again.");
          } else if (err.response.status === 204) {
            toast.warn("No companies found.");
          } else if (err.response.data?.message) {
            toast.error(err.response.data.message);
          } else {
            toast.error("An error occurred. Please try again.");
          }
        } else {
          toast.error("Server not reachable. Please try again later.");
        }
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">

      <h1 className="text-2xl font-bold mb-6">List of Companies</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {companies.map(company => (
          <Link
            key={company.id}
            to={`/dashboard/companies/${company.name}`}
            className="p-4 border rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h2 className="text-xl font-semibold">{company.name}</h2>
            <p className="text-gray-600">{company.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
