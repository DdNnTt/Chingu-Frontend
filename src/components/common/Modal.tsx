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
  hideFooter?: boolean;
  contentClassName?: string;
  disabled?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  submitLabel = '확인',
  cancelLabel = '취소',
  onSubmit,
  hideFooter = false,
  className = '',
  contentClassName = '',
  disabled = false,
  ...props
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      {...props}
    >
      <div className={`fixed inset-0 opacity-50`} onClick={onClose}></div>
      <div
        className={`relative bg-white rounded-lg p-6 w-[90%] max-w-md ${className}`}
      >
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        <div className={`modal-content ${contentClassName}`}>{children}</div>

        {!hideFooter && (
          <div className="flex gap-2 mt-6">
            <Button
              type="button"
              className="flex-1 bg-gray-500 text-white"
              onClick={onClose}
              disabled={disabled}
            >
              {cancelLabel}
            </Button>
            {onSubmit && (
              <Button
                type="button"
                className="flex-1 text-white"
                onClick={onSubmit}
                disabled={disabled}
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
