import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Routes>
          <Route path="/" element={
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
              <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                FitLife AI
              </h1>
              <p className="text-gray-400 max-w-md text-center mb-8">
                Your journey to a healthier you begins here.
              </p>
              <div className="flex gap-4">
                <a href="/login" className="px-8 py-3 bg-green-600 rounded-2xl hover:bg-green-700 transition-all font-bold">Login</a>
                <a href="/signup" className="px-8 py-3 border border-gray-700 rounded-2xl hover:bg-gray-800 transition-all font-bold">Signup</a>
              </div>
            </div>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
