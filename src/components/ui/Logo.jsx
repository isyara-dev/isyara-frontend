import React from 'react';

const Logo = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'h-8',
    medium: 'h-10',
    large: 'h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} font-bold text-text-light flex items-center`}>
      <span className="text-white">di</span>
      <span className="text-secondary">co</span>
      <span className="text-white">ding</span>
    </div>
  );
};

export default Logo; 