import React, { forwardRef, InputHTMLAttributes, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = '', ...props }, ref) => {
    const generatedId = useId();

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
          ref={ref}
          {...props}
          className={`mt-1 block w-full px-3 py-2 border border-gray-300 bg-[#f3f3f5] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-300 ${
            props.readOnly ? 'cursor-default' : 'cursor-text'
          } ${className}`}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
