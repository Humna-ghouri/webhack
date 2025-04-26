import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Qarze Hasana</Link>
        
        <div className="flex space-x-4">
          {user ? (
            <>
              {user.isAdmin && (
                <Link to="/admin-dashboard" className="hover:underline">
                  Admin Dashboard
                </Link>
              )}
              <Link to="/loan-calculator" className="hover:underline">
                Loan Calculator
              </Link>
              <Link to="/loan-request" className="hover:underline">
                Apply for Loan
              </Link>
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="hover:underline">
                Sign In
              </Link>
              <Link to="/signup" className="hover:underline">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;