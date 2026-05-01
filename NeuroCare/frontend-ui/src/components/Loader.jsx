import React from 'react';

const Loader = ({ size = 'medium', text = '' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`loader ${sizeClasses[size]}`}></div>
      {text && <p className="mt-4 text-gray-400">{text}</p>}
    </div>
  );
};

export default Loader;
