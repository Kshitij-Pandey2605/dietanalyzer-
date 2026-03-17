import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        FitLife AI
      </h1>
      <p className="text-gray-400 max-w-md text-center">
        Reconstructing the ultimate fitness companion. Frontend scaffolding is now active.
      </p>
      <div className="mt-8 px-6 py-2 bg-green-600 rounded-full hover:bg-green-700 transition-colors cursor-pointer">
        Get Started
      </div>
    </div>
  );
}

export default App;
