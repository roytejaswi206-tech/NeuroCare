import React from 'react';

const Loader = ({ size = 'normal', text = 'Loading...' }) => {
  const sizeClass = size === 'small' ? 'w-6 h-6' : 'w-10 h-10';
  
  return (
    <div className={`flex items-center gap-3 ${size === 'small' ? 'text-sm' : ''}`}>
      <div className={`${sizeClass} loader border-4 border-white/20 border-t-blue-400 rounded-full animate-spin shadow-lg`}></div>
      <span className="font-medium">{text}</span>
    </div>
  );
};

export default Loader;

