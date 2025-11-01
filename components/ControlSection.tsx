'use client';

import { useState } from 'react';
import { Settings, CalculationResults } from '@/types';
import { formatCurrencyFixed } from '@/lib/utils';
import { isControlCalculationValid } from '@/lib/calculations';

interface ControlSectionProps {
  settings: Settings;
  results: CalculationResults;
}

export default function ControlSection({
  settings,
  results,
}: ControlSectionProps) {
  const [controlExpanded, setControlExpanded] = useState(false);
  const controlIsValid = isControlCalculationValid(results);

  return (
    <div className='bg-white rounded-lg shadow-md mb-6'>
      {/* Control Header - Clickable */}
      <div
        className='p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center'
        onClick={() => setControlExpanded(!controlExpanded)}
      >
        <div className='flex items-center gap-3'>
          <h2 className='text-2xl font-semibold text-gray-800'>
            📊 KONTROLLE GEMEINSCHAFTSKONTO
          </h2>
          <span
            className={`transform transition-transform duration-200 ${
              controlExpanded ? 'rotate-180' : ''
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
      </div>

      {/* Collapsible Control Content */}
      {controlExpanded && (
        <div className='px-6 pb-6 border-t border-gray-100 animate-in slide-in-from-top duration-200'>
          <div className='pt-4 space-y-3'>
            <div className='flex justify-between items-center py-2 border-b border-gray-200'>
              <span className='font-medium'>Bedarf Gemeinschaftskonto:</span>
              <span className='font-bold text-lg'>
                {formatCurrencyFixed(results.bedarf_gk)}
              </span>
            </div>
            <div className='flex justify-between items-center py-2 border-b border-gray-200'>
              <span className='font-medium'>- Restgeld Vormonat:</span>
              <span className='font-bold text-lg'>
                {formatCurrencyFixed(settings.restgeld_vormonat)}
              </span>
            </div>
            <div className='flex justify-between items-center py-2 bg-yellow-50 px-4 rounded border-l-4 border-yellow-400'>
              <span className='font-semibold'>
                = Benötigte neue Einzahlung:
              </span>
              <span className='font-bold text-xl text-yellow-700'>
                {formatCurrencyFixed(results.kontrolle_einzahlungNötig)}
              </span>
            </div>
            <div
              className={`flex justify-between items-center py-2 px-4 rounded border-l-4 
                ${
                  controlIsValid
                    ? 'bg-green-50 border-green-400'
                    : 'bg-red-50 border-red-400'
                }`}
            >
              <span className='font-semibold'>Summe der Überweisungen:</span>
              <span
                className={`font-bold text-xl 
                  ${controlIsValid ? 'text-green-700' : 'text-red-700'}`}
              >
                {formatCurrencyFixed(results.kontrolle_summeÜberweisungen)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
