import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
              <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent">
                FitLife AI
              </h1>
              <p className="text-gray-500 dark:text-gray-400 max-w-md text-center mb-8">
                Your journey to a healthier you begins here.
              </p>
              <div className="flex gap-4">
                <Link to="/login" className="px-8 py-3 bg-green-600 rounded-2xl hover:bg-green-700 transition-all font-bold text-white shadow-lg shadow-green-600/20">Login</Link>
                <Link to="/signup" className="px-8 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-bold">Signup</Link>
              </div>
            </div>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
