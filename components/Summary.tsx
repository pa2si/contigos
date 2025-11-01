'use client';

import { CalculationResults } from '@/types';
import { formatCurrencyFixed, formatPercentage } from '@/lib/utils';

interface SummaryProps {
  results: CalculationResults;
}

export default function Summary({ results }: SummaryProps) {
  return (
    <>
      {/* CARD 1: ACTION (Highlighted) */}
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
            <h3 className='font-semibold text-lg mb-2'>
              Caro überweist auf GK:
            </h3>
            <div className='text-4xl font-bold mb-1'>
              {formatCurrencyFixed(results.finale_überweisung_p2)}
            </div>
            <div className='text-sm opacity-90'>
              ({formatPercentage(results.p2_anteil_prozent)} Anteil)
            </div>
          </div>
        </div>
      </div>

      {/* CARD 3: SUMMARY */}
      <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
        <h2 className='text-2xl font-semibold mb-4 text-gray-800'>
          💰 ZUSAMMENFASSUNG - Freie Verfügung
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
    </>
  );
}
