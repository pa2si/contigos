'use client';

import { useState } from 'react';
import { Settings, CalculationResults } from '@/types';
import { formatCurrencyFixed } from '@/lib/utils';

interface ControlSectionProps {
  settings: Settings;
  results: CalculationResults;
}

export default function ControlSection({
  settings,
  results,
}: ControlSectionProps) {
  const [controlExpanded, setControlExpanded] = useState(false);

  return (
    <div className='bg-white rounded-lg shadow-md mb-6'>
      {/* Control Header - Clickable */}
      <div
        className='p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center'
        onClick={() => setControlExpanded(!controlExpanded)}
      >
        <div>
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
          <div className='mt-2 text-lg font-medium text-blue-700'>
            Bedarf Gemeinschaftskonto:{' '}
            <span className='font-bold'>
              {formatCurrencyFixed(results.bedarf_gk)}
            </span>
          </div>
        </div>
      </div>

      {/* Collapsible Control Content */}
      {controlExpanded && (
        <div className='px-6 pb-6 border-t border-gray-100 animate-in slide-in-from-top duration-200'>
          <div className='pt-4 space-y-4'>
            {/* Clean breakdown showing the calculation flow */}
            <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
              <h3 className='font-semibold text-blue-800 mb-3'>
                Berechnung Bedarf:
              </h3>
              <div className='space-y-2'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-700'>Comida:</span>
                  <span className='font-medium'>
                    {formatCurrencyFixed(settings.comida_betrag)}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-700'>Ahorros:</span>
                  <span className='font-medium'>
                    {formatCurrencyFixed(settings.ahorros_betrag)}
                  </span>
                </div>
                <div className='border-t border-blue-300 pt-2'>
                  <div className='flex justify-between items-center'>
                    <span className='font-medium text-blue-800'>
                      Gesamt Bedarf:
                    </span>
                    <span className='font-bold text-blue-800'>
                      {formatCurrencyFixed(results.bedarf_gk)}
                    </span>
                  </div>
                </div>
                <div className='flex justify-between items-center text-red-700'>
                  <span className=''>- Restgeld Vormonat:</span>
                  <span className='font-medium'>
                    - {formatCurrencyFixed(settings.restgeld_vormonat)}
                  </span>
                </div>
                <div className='border-t border-blue-300 pt-2'>
                  <div className='flex justify-between items-center bg-yellow-100 p-2 rounded'>
                    <span className='font-semibold text-yellow-800'>
                      = Benötigte Einzahlung:
                    </span>
                    <span className='font-bold text-yellow-800'>
                      {formatCurrencyFixed(results.kontrolle_einzahlungNötig)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Final result */}
            <div className='flex justify-between items-center py-3 px-4 rounded border-l-4 bg-red-50 border-red-400'>
              <span className='font-semibold text-red-800'>
                Tatsächliche Überweisungen:
              </span>
              <span className='font-bold text-xl text-red-700'>
                {formatCurrencyFixed(results.kontrolle_summeÜberweisungen)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
