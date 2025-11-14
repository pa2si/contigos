import React from 'react';

interface PageSkeletonProps {
  selectedMonthLabel: string;
}

export default function PageSkeleton({
  selectedMonthLabel,
}: PageSkeletonProps) {
  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-4xl mx-auto'>
        {/* Month selector (skeleton) */}
        <div className='mb-6 flex items-center justify-center gap-3'>
          <button
            disabled
            aria-label='Vorheriger Monat'
            className='p-2 rounded-lg bg-white/20 text-white disabled:opacity-50'
          >
            <svg className='w-5 h-5' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M12.293 16.293a1 1 0 010-1.414L15.586 11H5a1 1 0 110-2h10.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z'
                clipRule='evenodd'
              />
            </svg>
          </button>
          <div className='px-4 py-2 bg-white rounded-lg text-gray-700 font-medium'>
            {selectedMonthLabel}
          </div>
          <button
            disabled
            aria-label='Nächster Monat'
            className='p-2 rounded-lg bg-white/20 text-white disabled:opacity-50'
          >
            <svg className='w-5 h-5' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M7.707 3.707a1 1 0 010 1.414L4.414 9H15a1 1 0 110 2H4.414l3.293 3.293a1 1 0 11-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>

        {/* Loading Skeleton */}
        <div className='space-y-6'>
          {/* Settings Skeleton */}
          <div className='bg-white rounded-lg shadow-md p-6 animate-pulse'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='h-6 w-6 bg-gray-200 rounded'></div>
              <div className='h-6 bg-gray-200 rounded w-32'></div>
            </div>
            <div className='h-4 bg-gray-200 rounded w-48'></div>
          </div>

          {/* Summary Cards Skeleton */}
          <div className='bg-linear-to-r from-blue-500 to-green-500 text-white rounded-lg shadow-lg p-6 animate-pulse'>
            <div className='h-6 bg-white/20 rounded w-64 mb-4 mx-auto'></div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='text-center p-4 bg-white/20 rounded-lg'>
                <div className='h-4 bg-white/30 rounded w-32 mb-2 mx-auto'></div>
                <div className='h-8 bg-white/30 rounded w-24 mb-1 mx-auto'></div>
                <div className='h-3 bg-white/30 rounded w-20 mx-auto'></div>
              </div>
              <div className='text-center p-4 bg-white/20 rounded-lg'>
                <div className='h-4 bg-white/30 rounded w-32 mb-2 mx-auto'></div>
                <div className='h-8 bg-white/30 rounded w-24 mb-1 mx-auto'></div>
                <div className='h-3 bg-white/30 rounded w-20 mx-auto'></div>
              </div>
            </div>
          </div>

          {/* Available Amounts Skeleton */}
          <div className='bg-white rounded-lg shadow-md p-6 animate-pulse'>
            <div className='h-6 bg-gray-200 rounded w-48 mb-4'></div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='text-center p-6 bg-blue-50 rounded-lg border-2 border-blue-200'>
                <div className='h-4 bg-blue-200 rounded w-24 mb-2 mx-auto'></div>
                <div className='h-8 bg-blue-200 rounded w-20 mb-2 mx-auto'></div>
                <div className='h-3 bg-blue-200 rounded w-32 mx-auto'></div>
              </div>
              <div className='text-center p-6 bg-green-50 rounded-lg border-2 border-green-200'>
                <div className='h-4 bg-green-200 rounded w-24 mb-2 mx-auto'></div>
                <div className='h-8 bg-green-200 rounded w-20 mb-2 mx-auto'></div>
                <div className='h-3 bg-green-200 rounded w-32 mx-auto'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
