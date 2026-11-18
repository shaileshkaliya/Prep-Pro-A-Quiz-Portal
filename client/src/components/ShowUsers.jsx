import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../utils/Constants';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShowUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("jwtToken");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(ENDPOINTS.USER.GET_ALL_USERS, {
        headers: {
          jwtToken: token
        }
      });
      setUsers(response.data.users || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    }
  };

  const deleteUser = async (email) => {
    try {
      await axios.delete(ENDPOINTS.USER.DELETE_USERS, {
        headers: { jwtToken: token },
        data: [email]
      });
      setUsers(prev => prev.filter(user => user.email !== email));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error(error.response?.data || 'Delete failed');
    }
  };

  const deleteSelectedUsers = async () => {
    try {
      await axios.delete(ENDPOINTS.USER.DELETE_USERS, {
        headers: { jwtToken: token },
        data: selectedEmails
      });
      setUsers(prev => prev.filter(user => !selectedEmails.includes(user.email)));
      toast.success('Selected users deleted successfully');
      setSelectedEmails([]);
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data || 'Bulk delete failed');
    }
  };

  const handleIndividualCheckboxChange = (email, checked) => {
    setSelectedEmails(prev => {
      if (checked) {
        return prev.includes(email) ? prev : [...prev, email];
      } else {
        return prev.filter(e => e !== email);
      }
    });
  };

  const handleSelectAllChange = (checked) => {
    if (checked) {
      const allEmails = users.map(user => user.email);
      setSelectedEmails(allEmails);
    } else {
      setSelectedEmails([]);
    }
  };

  const isAllSelected = users.length > 0 && selectedEmails.length === users.length;

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-2">All Users</h2>
      <p className="text-sm text-gray-500 mb-4">Tip: Select multiple users using checkboxes and delete in one go.</p>

      {selectedEmails.length > 0 && (
        <button
          className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => setShowModal(true)}
        >
          Delete Selected ({selectedEmails.length})
        </button>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectAllChange(e.target.checked)}
                  checked={isAllSelected}
                />
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">#</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr
                key={user.userId}
                className={`border-b hover:bg-gray-50 ${
                  selectedEmails.includes(user.email) ? 'bg-blue-100' : ''
                }`}
              >
                <td className="px-6 py-4 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedEmails.includes(user.email)}
                    onChange={(e) => handleIndividualCheckboxChange(user.email, e.target.checked)}
                  />
                </td>
                <td className="px-6 py-4 text-sm">{idx + 1}</td>
                <td className="px-6 py-4 text-sm">{user.name}</td>
                <td className="px-6 py-4 text-sm">{user.email}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => deleteUser(user.email)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center px-6 py-4 text-sm text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete the selected users?
              <br />
              <span className="text-red-500 font-semibold">This action cannot be undone.</span>
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={deleteSelectedUsers}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowUsers;
