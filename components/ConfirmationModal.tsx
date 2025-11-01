'use client';

import { useEffect } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Bestätigen',
  cancelText = 'Abbrechen',
  isDestructive = false,
}: ConfirmationModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop with blur effect */}
      <div
        className='fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-300'
        onClick={onCancel}
      />

      {/* Modal */}
      <div className='relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6'>
        <div className='mb-4'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>{title}</h3>
          <p className='text-gray-600'>{message}</p>
        </div>

        <div className='flex justify-end gap-3'>
          <button
            onClick={onCancel}
            className='px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors'
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-md transition-colors ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
