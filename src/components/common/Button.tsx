import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  className = '',
  variant = 'primary',
  children,
  ...props
}) => {
  const baseStyles = 'px-4 py-3 rounded-lg transition-colors';

  const variantStyles = {
    primary: 'bg-main-color text-white',
    secondary: 'bg-gray-200 text-gray-700',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
