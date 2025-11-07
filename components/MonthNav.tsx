'use client';

import React from 'react';

interface MonthNavProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
}

export default function MonthNav({ label, onPrev, onNext }: MonthNavProps) {
  return (
    <div className='mb-6 flex items-center justify-center gap-3'>
      <button
        aria-label='Vorheriger Monat'
        onClick={onPrev}
        className='p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 transition'
      >
        <svg
          className='w-5 h-5 text-gray-700'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M7.707 3.707a1 1 0 010 1.414L4.414 9H15a1 1 0 110 2H4.414l3.293 3.293a1 1 0 11-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z'
            clipRule='evenodd'
          />
        </svg>
      </button>

      <div className='px-4 py-2 bg-white rounded-lg text-gray-800 font-medium shadow-sm'>
        {label}
      </div>

      <button
        aria-label='Nächster Monat'
        onClick={onNext}
        className='p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 transition'
      >
        <svg
          className='w-5 h-5 text-gray-700'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M12.293 16.293a1 1 0 010-1.414L15.586 11H5a1 1 0 110-2h10.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z'
            clipRule='evenodd'
          />
        </svg>
      </button>
    </div>
  );
}
