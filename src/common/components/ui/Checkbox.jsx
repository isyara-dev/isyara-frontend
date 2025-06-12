import React from 'react';

const Checkbox = ({
  id,
  label,
  checked = false,
  onChange = () => {},
  className = '',
  ...props
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-background"
        {...props}
      />
      {label && (
        <label htmlFor={id} className="ml-2 text-sm text-text-light cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox; 