import React from 'react';

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill="#10B981" fillOpacity="0.2" />
        <path d="M16 6L24 12V20L16 26L8 20V12L16 6Z" fill="#10B981" />
        <circle cx="16" cy="16" r="4" fill="#3B82F6" />
        <path d="M16 16L16 26" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 16L24 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 16L8 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
        FitLife AI
      </span>
    </div>
  );
};

export default Logo;
