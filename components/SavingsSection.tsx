'use client';

import { useState } from 'react';
import { CalculationResults } from '@/types';
import { formatCurrencyFixed } from '@/lib/utils';

interface SavingsSectionProps {
  results: CalculationResults;
}

export default function SavingsSection({ results }: SavingsSectionProps) {
  const [savingsExpanded, setSavingsExpanded] = useState(false);

  return (
    <div className='bg-white rounded-lg shadow-md mb-6'>
      {/* Savings Header - Always Visible */}
      <div
        className='p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center'
        onClick={() => setSavingsExpanded(!savingsExpanded)}
      >
        <div>
          <div className='flex items-center gap-3'>
            <h2 className='text-2xl font-semibold'>
              🏦 TAGESGELDKONTO - Sparen
            </h2>
            <span
              className={`transform transition-transform duration-200 ${
                savingsExpanded ? 'rotate-180' : ''
              }`}
            >
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </span>
          </div>
          <div className='mt-2 text-lg font-medium text-emerald-700'>
            Monatlicher Sparplan:{' '}
            <span className='font-bold'>
              {formatCurrencyFixed(
                results.neues_tagesgeldkonto - results.aktuelles_tagesgeldkonto
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Collapsible Savings Content */}
      {savingsExpanded && (
        <div className='px-6 pb-6 border-t border-gray-100 animate-in slide-in-from-top duration-200'>
          <div className='pt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='text-center p-6 bg-yellow-50 rounded-lg border-2 border-yellow-200'>
              <h3 className='font-semibold text-lg mb-2 text-yellow-800'>
                Aktueller Stand:
              </h3>
              <div className='text-4xl font-bold text-yellow-600 mb-2'>
                {formatCurrencyFixed(results.aktuelles_tagesgeldkonto)}
              </div>
              <div className='text-sm text-yellow-600'>
                Vor erneuter Überweisung
              </div>
            </div>
            <div className='text-center p-6 bg-emerald-50 rounded-lg border-2 border-emerald-200'>
              <h3 className='font-semibold text-lg mb-2 text-emerald-800'>
                Nach Sparen:
              </h3>
              <div className='text-4xl font-bold text-emerald-600 mb-2'>
                {formatCurrencyFixed(results.neues_tagesgeldkonto)}
              </div>
              <div className='text-sm text-emerald-600'>
                +
                {formatCurrencyFixed(
                  results.neues_tagesgeldkonto -
                    results.aktuelles_tagesgeldkonto
                )}{' '}
                im nächsten Monat
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
