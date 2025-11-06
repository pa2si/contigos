'use client';

import { useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  headerClass?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  headerClass,
}: ModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const modalContent = (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300'
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Modal Content */}
      <div
        className={`relative w-full ${sizeClasses[size]} max-h-[90vh] bg-white/95 rounded-2xl shadow-xl transform transition-all duration-300 scale-100 animate-in fade-in slide-in-from-bottom-4`}
        role='dialog'
        aria-modal='true'
        aria-labelledby='modal-title'
      >
        {/* Header - allow caller to override header class to tint by person */}
        <div
          className={
            headerClass ||
            'flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl'
          }
        >
          <h2
            id='modal-title'
            className='text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2'
          >
            {title}
          </h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
              aria-label='Close modal'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className='overflow-y-auto max-h-[calc(90vh-120px)]'>
          {children}
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at body level
  return createPortal(modalContent, document.body);
}
