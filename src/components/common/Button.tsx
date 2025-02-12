import React from 'react';

interface ButtonProps {
  type: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ type, onClick, className, children }) => {
  return (
    <button type={type} onClick={onClick} className={`px-4 py-3 rounded-md bg-main-color ${className}`}>
      {children}
    </button>
  );
};

export default Button;