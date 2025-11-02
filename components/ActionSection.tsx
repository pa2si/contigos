'use client';

import { CalculationResults } from '@/types';
import { formatCurrencyFixed, formatPercentage } from '@/lib/utils';

interface ActionSectionProps {
  results: CalculationResults;
}

export default function ActionSection({ results }: ActionSectionProps) {
  return (
    <div className='bg-linear-to-r from-blue-500 to-green-500 text-white rounded-lg shadow-lg p-6 mb-6'>
      <h2 className='text-2xl font-bold mb-4 text-center'>
        🏦 AKTION - Überweisungen auf Gemeinschaftskonto
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='text-center p-4 bg-white/20 rounded-lg backdrop-blur'>
          <h3 className='font-semibold text-lg mb-2'>
            Pascal überweist auf GK:
          </h3>
          <div className='text-4xl font-bold mb-1'>
            {formatCurrencyFixed(results.finale_überweisung_p1)}
          </div>
          <div className='text-sm opacity-90'>
            ({formatPercentage(results.p1_anteil_prozent)} Anteil)
          </div>
        </div>
        <div className='text-center p-4 bg-white/20 rounded-lg backdrop-blur'>
          <h3 className='font-semibold text-lg mb-2'>Caro überweist auf GK:</h3>
          <div className='text-4xl font-bold mb-1'>
            {formatCurrencyFixed(results.finale_überweisung_p2)}
          </div>
          <div className='text-sm opacity-90'>
            ({formatPercentage(results.p2_anteil_prozent)} Anteil)
          </div>
        </div>
      </div>
    </div>
  );
}
