import React, { ReactNode, HTMLAttributes } from 'react';
import Button from './Button';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit?: () => void;
  size?: 'sm' | 'md' | 'lg';
  hideFooter?: boolean;
  contentClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  submitLabel = '확인',
  cancelLabel = '취소',
  onSubmit,
  size = 'md',
  hideFooter = false,
  className = '',
  contentClassName = '',
  ...props
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      {...props}
    >
      <div
        className={`bg-white rounded-lg p-6 w-[90%] ${sizeClasses[size]} ${className}`}
      >
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        <div className={`modal-content ${contentClassName}`}>{children}</div>

        {!hideFooter && (
          <div className="flex gap-2 mt-6">
            <Button
              type="button"
              className="flex-1 bg-gray-500 text-white"
              onClick={onClose}
            >
              {cancelLabel}
            </Button>
            {onSubmit && (
              <Button
                type="button"
                className="flex-1 text-white"
                onClick={onSubmit}
              >
                {submitLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
