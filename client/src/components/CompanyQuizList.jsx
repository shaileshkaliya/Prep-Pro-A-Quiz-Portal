import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';  // Import useNavigate
import axios from 'axios';
import { toast } from 'react-toastify';
import WarningModal from './WarningModel';
import 'react-toastify/dist/ReactToastify.css';
import { ENDPOINTS } from '../utils/Constants';

export default function CompanyQuizList() {
    const { companyId } = useParams();
    const [quizzes, setQuizzes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTestName, setSelectedTestName] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate hook

    useEffect(() => {
        fetchQuizzes();
    }, [companyId]);

    const fetchQuizzes = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                toast.error("Unauthorized: No token found");
                return;
            }

            const response = await axios.get(
                ENDPOINTS.QUIZ.GET_QUIZZES_BY_COMPANY(companyId),
                {
                    headers: {
                        jwtToken: token
                    }
                }
            );

            if (response.status === 200) {
                setQuizzes(response.data);
                toast.success("Quizzes fetched successfully!");
            } else if (response.status === 204) {
                setQuizzes([]);
                toast.info("No quizzes available for this company.");
            }
        } catch (error) {
            console.error("Error fetching quizzes:", error);
            toast.error("Failed to fetch quizzes. Try again later.");
        }
    };

    const handleActionClick = (quizId) => {
        // Navigate to the QuizWindow route with the quizId
        navigate(`/quiz/${quizId}/quizwindow`);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTestName('');
    };

    return (
        <div className="container mx-auto p-4">
            <Link to="/dashboard/companies" className="text-blue-600 hover:underline mb-4 inline-block">
                ← Back to Companies
            </Link>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">List of Quizzes</h2>
                {quizzes.length > 0 ? (
                    <>
                        <table className="w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-4 text-left">Quiz Name</th>
                                    <th className="py-2 px-4 text-left">No of Questions</th>
                                    <th className="py-2 px-4 text-left">Time Limit</th>
                                    <th className="py-2 px-4 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quizzes.map((quiz, index) => (
                                    <tr key={index} className='bg-gray-50'>
                                        <td className="py-2 px-4">{quiz.title}</td>
                                        <td className="py-2 px-4">{quiz.numQuestions}</td>
                                        <td className="py-2 px-4">{quiz.quizTime} Minutes</td>
                                        <td className="py-2 px-4">
                                            <button
                                                className="py-1 px-4 rounded bg-blue-500 text-white"
                                                onClick={() => handleActionClick(quiz.quizId)} // Pass quizId to navigate
                                            >
                                                Start
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <WarningModal
                            isOpen={isModalOpen}
                            onClose={closeModal}
                            testName={selectedTestName}
                        />
                    </>
                ) : (
                    <p>No quizzes available for this company.</p>
                )}
            </div>
        </div>
    );
}
