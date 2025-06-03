import React, { InputHTMLAttributes, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  const generatedId = useId(); // React 18 이상에서 고유 ID 생성

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={generatedId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={generatedId}
        className={`mt-1 block w-full px-3 py-2 border bg-[#f3f3f5] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-300 ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
