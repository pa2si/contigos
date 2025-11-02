'use client';

import { CalculationResults } from '@/types';
import { formatCurrencyFixed } from '@/lib/utils';

interface GirokontoSectionProps {
  results: CalculationResults;
}

export default function GirokontoSection({ results }: GirokontoSectionProps) {
  return (
    <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
      <h2 className='text-2xl font-semibold mb-4 text-gray-800'>
        💰 GIROKONTO - Freie Verfügung
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='text-center p-6 bg-blue-50 rounded-lg border-2 border-blue-200'>
          <h3 className='font-semibold text-lg mb-2 text-blue-800'>
            Verbleibt Pascal:
          </h3>
          <div className='text-4xl font-bold text-blue-600 mb-2'>
            {formatCurrencyFixed(results.verbleibt_p1)}
          </div>
          <div className='text-sm text-blue-600'>zur freien Verfügung</div>
        </div>
        <div className='text-center p-6 bg-green-50 rounded-lg border-2 border-green-200'>
          <h3 className='font-semibold text-lg mb-2 text-green-800'>
            Verbleibt Caro:
          </h3>
          <div className='text-4xl font-bold text-green-600 mb-2'>
            {formatCurrencyFixed(results.verbleibt_p2)}
          </div>
          <div className='text-sm text-green-600'>zur freien Verfügung</div>
        </div>
      </div>
    </div>
  );
}
