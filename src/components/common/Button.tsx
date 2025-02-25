import React, { ButtonHTMLAttributes } from 'react';

const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...props }) => {
  return (
    <button className={`px-4 py-3 rounded-md bg-main-color ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;

