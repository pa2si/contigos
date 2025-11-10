'use client';

import { useState } from 'react';
import { CalculationResults, Settings } from '@/types';
import { formatCurrencyFixed, formatPercentage } from '@/lib/utils';

interface ControlSectionProps {
  results: CalculationResults;
  settings: Settings;
  selectedMonth?: string; // format YYYY-MM
}

// Control Details Component (embedded)
const ControlDetails = ({
  settings,
  results,
}: {
  settings: Settings;
  results: CalculationResults;
}) => (
  <div className='p-4 sm:p-6'>
    {/* Simplified Header */}
    <div className='mb-4'>
      <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2'>
        <span className='text-xl'>📊</span>
        Detailierte Berechnung
      </h3>
      <p className='text-sm text-gray-600'>
        Aufschlüsselung der Gemeinschaftskonto-Berechnung
      </p>
    </div>

    {/* Content Grid */}
    <div className='space-y-4'>
      {/* Calculation Breakdown */}
      <div className='bg-linear-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200'>
        <h4 className='font-semibold text-blue-800 mb-3 flex items-center gap-2'>
          <span>🧮</span>
          Berechnung Gemeinschaftskonto Bedarf
        </h4>
        <div className='space-y-2 text-sm'>
          <div className='flex justify-between py-1'>
            <span className='text-gray-700'>💰 Lebensmittel (Budget):</span>
            <span className='font-bold text-gray-900 tabular-nums'>
              {formatCurrencyFixed(results.budget_lebensmittel)}
            </span>
          </div>
          <div className='flex justify-between py-1'>
            <span className='text-gray-700'>🏦 Sparen (gesamt):</span>
            <span className='font-bold text-gray-900 tabular-nums'>
              {formatCurrencyFixed(
                results.sparen_tagesgeld + results.sparen_depot
              )}
            </span>
          </div>
          <div className='flex justify-between py-1 ml-6'>
            <span className='text-gray-600 text-sm'>↳ Tagesgeldkonto:</span>
            <span className='font-medium text-gray-800 tabular-nums text-sm'>
              {formatCurrencyFixed(results.sparen_tagesgeld)}
            </span>
          </div>
          <div className='flex justify-between py-1 ml-6'>
            <span className='text-gray-600 text-sm'>↳ Depot:</span>
            <span className='font-medium text-gray-800 tabular-nums text-sm'>
              {formatCurrencyFixed(results.sparen_depot)}
            </span>
          </div>
          <div className='flex justify-between py-1'>
            <span className='text-gray-700'>🧾 Weitere Ausgaben (GK):</span>
            <span className='font-bold text-gray-900 tabular-nums'>
              {formatCurrencyFixed(results.gk_dyn_expenses)}
            </span>
          </div>
        </div>
        <div className='border-t border-blue-300 pt-3 mt-3'>
          <div className='flex justify-between items-center py-2 px-3 bg-blue-200/50 rounded-lg'>
            <span className='font-semibold text-blue-800'>Gesamt Bedarf:</span>
            <span className='font-bold text-blue-800'>
              {formatCurrencyFixed(results.bedarf_gk)}
            </span>
          </div>
        </div>
      </div>

      {/* Adjustment & Result */}
      <div className='space-y-3'>
        <div className='flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg'>
          <span className='font-medium text-gray-700 flex items-center gap-2'>
            <span>💴</span>
            Restgeld Vormonat:
          </span>
          <span className='font-semibold text-gray-800'>
            -{formatCurrencyFixed(settings.restgeld_gk_vormonat)}
          </span>
        </div>

        <div className='flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg'>
          <span className='font-medium text-gray-700 flex items-center gap-2'>
            <span>✨</span>
            Benötigte Einzahlung:
          </span>
          <span className='font-semibold text-emerald-600'>
            {formatCurrencyFixed(results.kontrolle_einzahlungNötig)}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default function ControlSection({
  results,
  settings,
  selectedMonth,
}: ControlSectionProps) {
  const [controlExpanded, setControlExpanded] = useState(false);

  // Compute per-day available amount based on settings.gemeinschaftskonto_aktuell
  const perDayInfo = (() => {
    const balance = Number(settings.gemeinschaftskonto_aktuell || 0);
    const today = new Date();
    let year: number;
    let monthIndex: number; // 0-based

    if (selectedMonth) {
      const [y, m] = selectedMonth.split('-').map(Number);
      year = y;
      monthIndex = m - 1;
    } else {
      year = today.getFullYear();
      monthIndex = today.getMonth();
    }

    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const isCurrentMonth =
      year === today.getFullYear() && monthIndex === today.getMonth();
    const remainingDays = isCurrentMonth
      ? daysInMonth - today.getDate() + 1
      : daysInMonth;
    const perDay = remainingDays > 0 ? balance / remainingDays : 0;

    return { perDay, remainingDays, daysInMonth, year, monthIndex };
  })();

  const monthLabel = new Date(
    perDayInfo.year,
    perDayInfo.monthIndex
  ).toLocaleString('de-DE', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className='relative'>
      {/* Enhanced Simple Design */}
      <div className='bg-linear-to-r from-blue-500 to-green-500 text-white rounded-lg shadow-lg overflow-hidden mb-6'>
        <div className='p-6'>
          <div className='flex items-center justify-center gap-3 mb-4'>
            <div className='bg-white/20 p-2 rounded-xl backdrop-blur'>
              <svg
                className='w-6 h-6 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
                />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-center'>
              Kontrolle Gemeinschaftskonto
            </h2>
          </div>
          {/* Per-day available amount based on gemeinschaftskonto_aktuell */}
          <div className='text-center mb-4'>
            <div className='inline-block bg-white/20 px-4 py-3 rounded-lg'>
              <div className='text-sm opacity-95'>
                Verfügbar pro Tag ({monthLabel}):
              </div>
              <div className='text-2xl font-bold mt-1'>
                {formatCurrencyFixed(perDayInfo.perDay)}
              </div>
              <div className='text-sm opacity-90 mt-1'>
                {perDayInfo.remainingDays} Tage verbleibend
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='text-center p-4 bg-white/20 rounded-lg backdrop-blur'>
              <h3 className='font-semibold text-lg mb-2'>
                Pascal überweist auf GK:
              </h3>
              <div className='text-4xl xl:text-[2.4rem] font-bold mb-1'>
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
              <div className='text-4xl xl:text-[2.4rem]  font-bold mb-1'>
                {formatCurrencyFixed(results.finale_überweisung_p2)}
              </div>
              <div className='text-sm opacity-90'>
                ({formatPercentage(results.p2_anteil_prozent)} Anteil)
              </div>
            </div>
          </div>

          {/* Collapsible Control Section Toggle Button */}
          <div className='flex justify-center mt-6'>
            <button
              onClick={() => setControlExpanded(!controlExpanded)}
              className='bg-white/20 hover:bg-white/30 backdrop-blur border border-white/30 rounded-full px-6 py-3 text-white font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105'
            >
              <span className='text-lg'>📊</span>
              <span>Kontrolle & Details</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  controlExpanded ? 'rotate-180' : ''
                }`}
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Integrated Control Details */}
        {controlExpanded && (
          <div className='border-t border-white/20 bg-white/95 animate-in slide-in-from-top duration-300'>
            <ControlDetails settings={settings} results={results} />
          </div>
        )}
      </div>
    </div>
  );
}
