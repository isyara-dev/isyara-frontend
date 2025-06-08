import React from "react";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  className = "",
  onClick = () => {},
  fullWidth = false,
  ...props
}) => {
  const baseClasses =
    "flex justify-center items-center py-2 px-4 rounded-md font-medium transition-colors";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-text-light hover:opacity-90",
    secondary: "bg-secondary text-text-light hover:bg-opacity-90",
    outline:
      "border border-primary text-primary hover:bg-primary hover:bg-opacity-10",
    link: "bg-transparent text-primary hover:underline p-0",
    text: "bg-transparent text-purple hover:cursor-pointer border-none text-left justify-start py-3 px-4 rounded-lg w-auto",
    play: "bg-green-500 text-text-light hover:bg-green-600",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
