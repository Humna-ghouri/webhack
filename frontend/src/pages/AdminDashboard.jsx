import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    country: '',
    tokenNumber: ''
  });
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verify admin status before loading data
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        
        if (!token || !isAdmin) {
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'You are not authorized to view this page',
          });
          navigate('/');
          return;
        }

        // Verify token with backend
        const verifyResponse = await axios.get('http://localhost:5000/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!verifyResponse.data.user.isAdmin) {
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'Admin privileges required',
          });
          navigate('/');
          return;
        }

        // If verification passed, fetch users
        const usersResponse = await axios.get('http://localhost:5000/api/loans', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (usersResponse.data.success) {
          setUsers(usersResponse.data.data);
          setFilteredUsers(usersResponse.data.data);
        }
      } catch (error) {
        console.error('Admin verification failed:', error);
        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'Please login again',
        });
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [navigate]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    let result = users;
    
    if (filters.country) {
      result = result.filter(user => 
        user.country.toLowerCase().includes(filters.country.toLowerCase())
      );
    }
    
    if (filters.tokenNumber) {
      result = result.filter(user => 
        user.tokenNumber.includes(filters.tokenNumber)
      );
    }
    
    setFilteredUsers(result);
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/loans/${editingUser._id}`,
        editingUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setUsers(users.map(user => 
          user._id === editingUser._id ? editingUser : user
        ));
        setFilteredUsers(filteredUsers.map(user => 
          user._id === editingUser._id ? editingUser : user
        ));
        setEditingUser(null);
        Swal.fire('Success', 'User updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      Swal.fire('Error', 'Failed to update user', 'error');
    }
  };

  const handleDelete = async (userId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        const response = await axios.delete(
          `http://localhost:5000/api/loans/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          setUsers(users.filter(user => user._id !== userId));
          setFilteredUsers(filteredUsers.filter(user => user._id !== userId));
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      Swal.fire('Error', 'Failed to delete user', 'error');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  if (loading) return <div className="text-center p-8">Loading admin dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Admin Dashboard</h1>
        
        {/* Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4 text-blue-700">Filter Users</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={filters.country}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Filter by country"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Token Number</label>
              <input
                type="text"
                name="tokenNumber"
                value={filters.tokenNumber}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Filter by token number"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={applyFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Token #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Country</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Appointment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user._id} className="hover:bg-blue-50">
                      <td className="px-6 py-4 whitespace-nowrap">{user.tokenNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.applicantName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.applicantEmail}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.country}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatDate(user.appointmentDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.status === 'approved' ? 'bg-green-100 text-green-800' :
                          user.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No users found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
              <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                <h2 className="text-xl font-bold">Edit User Details</h2>
                <button 
                  onClick={() => setEditingUser(null)}
                  className="text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="applicantName"
                      value={editingUser.applicantName}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="applicantEmail"
                      value={editingUser.applicantEmail}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={editingUser.country}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={editingUser.status}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Appointment Date</label>
                    <input
                      type="date"
                      name="appointmentDate"
                      value={editingUser.appointmentDate ? new Date(editingUser.appointmentDate).toISOString().split('T')[0] : ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Loan Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={editingUser.amount}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;