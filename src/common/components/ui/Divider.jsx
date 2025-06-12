import React from 'react';

const Divider = ({ text, className = '' }) => {
  return (
    <div className={`flex items-center my-4 ${className}`}>
      <div className="flex-grow h-px bg-gray-500 opacity-30"></div>
      {text && (
        <span className="px-4 text-sm text-gray-400">{text}</span>
      )}
      <div className="flex-grow h-px bg-gray-500 opacity-30"></div>
    </div>
  );
};

export default Divider; 