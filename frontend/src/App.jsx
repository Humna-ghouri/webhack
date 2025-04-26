import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import LoanCalculator from './pages/LoanCalculator';
import LoanRequestForm from './pages/LoanRequestForm';
import SlipGeneration from './pages/SlipGeneration';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Auth check error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <Navbar />
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={!user ? <SignIn /> : <Navigate to="/loan-calculator" />} />
          <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/loan-calculator" />} />
          <Route 
            path="/admin-dashboard" 
            element={user?.isAdmin ? <AdminDashboard /> : <Navigate to="/signin" />} 
          />
          <Route 
            path="/loan-calculator" 
            element={user ? <LoanCalculator /> : <Navigate to="/signin" />} 
          />
          <Route 
            path="/loan-request" 
            element={user ? <LoanRequestForm /> : <Navigate to="/signin" />} 
          />
          <Route 
            path="/slip-generation/:loanRequestId" 
            element={user ? <SlipGeneration /> : <Navigate to="/signin" />} 
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;