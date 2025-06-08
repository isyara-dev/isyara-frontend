import React from "react";

const Logo = ({ size = "medium", className = "" }) => {
  const sizeClasses = {
    small: "h-8",
    medium: "h-10",
    large: "h-8",
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/src/assets/logo-text.png" // Pastikan path ini benar
        alt="Logo ISYARA"
        className={`${sizeClasses[size]} w-auto`} // Mengatur tinggi dan lebar otomatis
      />
    </div>
  );
};

export default Logo;
