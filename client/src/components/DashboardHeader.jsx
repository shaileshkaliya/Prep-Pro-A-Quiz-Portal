import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { ENDPOINTS } from '../utils/Constants';

const DashboardHeader = ({ onLogout }) => {
    const [userName, setUserName] = useState(''); // 🆕 state to store name

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('jwtToken'); // 🧠 assuming token is stored here
                const response = await axios.get(ENDPOINTS.USER.PROFILE, {
                    headers: {
                        jwtToken: token,
                    },
                });
                console.log(response);
                if (response.status === 200 && response.data) {
                    setUserName(response.data.name); // ✅ set the user's name
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    return (
        <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center shadow-md fixed top-0 left-0 w-full z-10">
            <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold">PrepPro</h1>
            </div>

            <div className="flex items-center space-x-8">
                <button
                    onClick={onLogout}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                </button>

                <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faUser} className="text-2xl" />
                    <span className="text-sm font-medium">
                        {userName || 'Loading...'}
                    </span>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
