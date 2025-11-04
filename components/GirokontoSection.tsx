'use client';

import { useState } from 'react';
import { CalculationResults } from '@/types';
import { formatCurrencyFixed } from '@/lib/utils';

interface GirokontoSectionProps {
  results: CalculationResults;
  onPascalClick?: () => void;
  onCaroClick?: () => void;
}

// Modern Amount Card Component
const AmountCard = ({
  name,
  amount,
  description,
  color,
  icon,
  onClick,
}: {
  name: string;
  amount: number;
  description: string;
  color: 'blue' | 'green';
  icon: string;
  onClick?: () => void;
}) => {
  const colorClasses = {
    blue: {
      container:
        'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300',
      header: 'bg-gradient-to-r from-blue-500 to-blue-600',
      amount: 'text-blue-700',
      description: 'text-blue-600',
      glow: 'hover:shadow-blue-200',
    },
    green: {
      container:
        'bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:border-green-300',
      header: 'bg-gradient-to-r from-green-500 to-green-600',
      amount: 'text-green-700',
      description: 'text-green-600',
      glow: 'hover:shadow-green-200',
    },
  };

  const classes = colorClasses[color];

  return (
    <div
      className={`${
        classes.container
      } border-2 rounded-xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg ${
        classes.glow
      } transform hover:scale-105 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={() => {
        onClick?.();
      }}
    >
      {/* Header */}
      <div className='flex items-center gap-2 mb-3'>
        <span className='text-xl'>{icon}</span>
        <h3 className={`text-base font-semibold ${classes.amount}`}>
          Verbleibt {name}
        </h3>
      </div>

      {/* Prominent Amount Display */}
      <div className='text-center'>
        <div
          className={`text-2xl sm:text-3xl lg:text-[2.5rem] font-bold ${classes.amount} mb-2 break-all`}
        >
          {formatCurrencyFixed(amount)}
        </div>
        <div
          className={`text-xs sm:text-sm ${classes.description} font-medium`}
        >
          {description}
        </div>
      </div>

      {/* Progress Indicator - Optional visual enhancement */}
      <div className='mt-4 pt-4 border-t border-gray-200'>
        <div className='text-xs text-gray-500 text-center'>
          {onClick ? (
            <>🔗 Klicken für Private Ausgaben</>
          ) : (
            <>💳 Verfügbares Budget</>
          )}
        </div>
      </div>
    </div>
  );
};

export default function GirokontoSection({
  results,
  onPascalClick,
  onCaroClick,
}: GirokontoSectionProps) {
  const [sectionExpanded, setSectionExpanded] = useState(true);

  const totalAmount = results.verbleibt_p1 + results.verbleibt_p2;

  return (
    <div className='bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 mb-6 overflow-hidden'>
      {/* Modern Header */}
      <div
        className='p-4 sm:p-6 cursor-pointer hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-300'
        onClick={() => setSectionExpanded(!sectionExpanded)}
      >
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
          {/* Title Section */}
          <div className='flex items-center gap-3 sm:gap-4'>
            <div className='bg-gradient-to-br from-green-500 to-blue-600 p-2 sm:p-3 rounded-xl text-white shadow-lg flex-shrink-0'>
              <svg
                className='w-5 h-5 sm:w-6 sm:h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                />
              </svg>
            </div>
            <div className='min-w-0'>
              <h2 className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
                Geld zur freien Verfügung
              </h2>
              <p className='text-sm sm:text-base text-gray-500 mt-1 break-words'>
                Verfügbares Budget nach allen Ausgaben
              </p>
            </div>
          </div>

          {/* Total Amount and Toggle Section */}
          <div className='flex items-center justify-between sm:justify-end gap-3 sm:gap-4'>
            <div className='text-left sm:text-right'>
              <div className='text-xs sm:text-sm text-gray-500 whitespace-nowrap'>
                Gesamtbudget
              </div>
              <div className='text-lg sm:text-xl font-bold text-green-600'>
                {formatCurrencyFixed(totalAmount)}
              </div>
            </div>
            <div
              className={`transform transition-transform duration-300 p-2 rounded-full bg-gray-100 flex-shrink-0 ${
                sectionExpanded ? 'rotate-180' : ''
              }`}
            >
              <svg
                className='w-4 h-4 sm:w-5 sm:h-5 text-gray-600'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Card Content */}
      {sectionExpanded && (
        <div className='border-t border-gray-100 bg-gray-50'>
          <div className='p-4 sm:p-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
              <AmountCard
                name='Pascal'
                amount={results.verbleibt_p1}
                description='zur freien Verfügung'
                color='blue'
                icon='👨‍💼'
                onClick={onPascalClick}
              />
              <AmountCard
                name='Caro'
                amount={results.verbleibt_p2}
                description='zur freien Verfügung'
                color='green'
                icon='👩‍💼'
                onClick={onCaroClick}
              />
            </div>

            {/* Summary Statistics */}
            <div className='mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4'>
              <div className='bg-white p-4 rounded-xl border border-gray-100 text-center'>
                <div className='text-sm text-gray-500 mb-1'>Pascal Anteil</div>
                <div className='font-semibold text-blue-600'>
                  {totalAmount > 0
                    ? ((results.verbleibt_p1 / totalAmount) * 100).toFixed(1)
                    : '0.0'}
                  %
                </div>
              </div>
              <div className='bg-white p-4 rounded-xl border border-gray-100 text-center'>
                <div className='text-sm text-gray-500 mb-1'>Caro Anteil</div>
                <div className='font-semibold text-green-600'>
                  {totalAmount > 0
                    ? ((results.verbleibt_p2 / totalAmount) * 100).toFixed(1)
                    : '0.0'}
                  %
                </div>
              </div>
              <div className='bg-white p-4 rounded-xl border border-gray-100 text-center'>
                <div className='text-sm text-gray-500 mb-1'>
                  Gesamt verfügbar
                </div>
                <div className='font-semibold text-gray-700'>
                  {formatCurrencyFixed(totalAmount)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
