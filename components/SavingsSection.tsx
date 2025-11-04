'use client';

import { useState } from 'react';
import { CalculationResults } from '@/types';
import { formatCurrencyFixed } from '@/lib/utils';

interface SavingsSectionProps {
  results: CalculationResults;
}

// Modern Savings Card Component
const SavingsCard = ({
  title,
  amount,
  description,
  color,
  icon,
  badge,
}: {
  title: string;
  amount: number;
  description: string;
  color: 'amber' | 'emerald';
  icon: string;
  badge?: string;
}) => {
  const colorClasses = {
    amber: {
      container:
        'bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-200 hover:border-amber-300',
      header: 'bg-gradient-to-r from-amber-500 to-yellow-600',
      amount: 'text-amber-700',
      description: 'text-amber-600',
      glow: 'hover:shadow-amber-200',
    },
    emerald: {
      container:
        'bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 hover:border-emerald-300',
      header: 'bg-gradient-to-r from-emerald-500 to-green-600',
      amount: 'text-emerald-700',
      description: 'text-emerald-600',
      glow: 'hover:shadow-emerald-200',
    },
  };

  const classes = colorClasses[color];

  return (
    <div
      className={`${classes.container} border-2 rounded-xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg ${classes.glow} transform hover:scale-105`}
    >
      {/* Header */}
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-2'>
          <span className='text-xl'>{icon}</span>
          <h3 className={`text-base font-semibold ${classes.amount}`}>
            {title}
          </h3>
        </div>
        {badge && (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${classes.amount} bg-gray-100`}
          >
            {badge}
          </span>
        )}
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

      {/* Progress Indicator */}
      <div className='mt-4 pt-4 border-t border-white/30'>
        <div className={`text-xs ${classes.description} text-center`}>
          💰 Sparfortschritt
        </div>
      </div>
    </div>
  );
};

export default function SavingsSection({ results }: SavingsSectionProps) {
  const [savingsExpanded, setSavingsExpanded] = useState(true);

  const monthlySavings =
    results.neues_tagesgeldkonto - results.aktuelles_tagesgeldkonto;

  // Calculate total money used (total income minus what remains free for each person)
  const totalFreeAmount = results.verbleibt_p1 + results.verbleibt_p2;
  const totalMoneyUsed = results.gesamteinkommen - totalFreeAmount;

  // Savings rate as percentage of total money used (shared + private expenses + savings)
  const savingsRate =
    totalMoneyUsed > 0 ? (monthlySavings / totalMoneyUsed) * 100 : 0;

  return (
    <div className='bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 mb-6 overflow-hidden'>
      {/* Modern Header */}
      <div
        className='p-4 sm:p-6 cursor-pointer hover:bg-gradient-to-r hover:from-emerald-50 hover:to-yellow-50 transition-all duration-300'
        onClick={() => setSavingsExpanded(!savingsExpanded)}
      >
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
          {/* Title Section */}
          <div className='flex items-center gap-3 sm:gap-4'>
            <div className='bg-gradient-to-br from-emerald-500 to-yellow-600 p-2 sm:p-3 rounded-xl text-white shadow-lg flex-shrink-0'>
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
                  d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                />
              </svg>
            </div>
            <div className='min-w-0'>
              <h2 className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
                Tagesgeldkonto - Sparen
              </h2>
              <p className='text-sm sm:text-base text-gray-500 mt-1 break-words'>
                Automatischer Sparplan für finanzielle Ziele
              </p>
            </div>
          </div>

          {/* Monthly Savings and Toggle Section */}
          <div className='flex items-center justify-between sm:justify-end gap-3 sm:gap-4'>
            <div className='text-left sm:text-right'>
              <div className='text-xs sm:text-sm text-gray-500 whitespace-nowrap'>
                Monatlicher Sparplan
              </div>
              <div className='text-lg sm:text-xl font-bold text-emerald-600'>
                {formatCurrencyFixed(monthlySavings)}
              </div>
            </div>
            <div
              className={`transform transition-transform duration-300 p-2 rounded-full bg-gray-100 flex-shrink-0 ${
                savingsExpanded ? 'rotate-180' : ''
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
      {savingsExpanded && (
        <div className='border-t border-gray-100 bg-gray-50'>
          <div className='p-4 sm:p-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
              <SavingsCard
                title='Aktueller Stand'
                amount={results.aktuelles_tagesgeldkonto}
                description='Vor erneuter Überweisung'
                color='amber'
                icon='💰'
                badge='Aktuell'
              />
              <SavingsCard
                title='Nach Sparen'
                amount={results.neues_tagesgeldkonto}
                description={`+${formatCurrencyFixed(
                  monthlySavings
                )} im nächsten Monat`}
                color='emerald'
                icon='📈'
                badge='Prognose'
              />
            </div>

            {/* Savings Analytics */}
            <div className='mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4'>
              <div className='bg-white p-4 rounded-xl border border-gray-100 text-center'>
                <div className='text-sm text-gray-500 mb-1'>Sparrate</div>
                <div className='font-semibold text-emerald-600'>
                  {savingsRate.toFixed(1)}%
                </div>
                <div className='text-xs text-gray-400 mt-1'>
                  vom verfügbaren Geld
                </div>
              </div>
              <div className='bg-white p-4 rounded-xl border border-gray-100 text-center'>
                <div className='text-sm text-gray-500 mb-1'>Jahresprognose</div>
                <div className='font-semibold text-emerald-600'>
                  {formatCurrencyFixed(monthlySavings * 12)}
                </div>
                <div className='text-xs text-gray-400 mt-1'>12 Monate</div>
              </div>
              <div className='bg-white p-4 rounded-xl border border-gray-100 text-center'>
                <div className='text-sm text-gray-500 mb-1'>Wachstum</div>
                <div className='font-semibold text-amber-600'>
                  +{formatCurrencyFixed(monthlySavings)}
                </div>
                <div className='text-xs text-gray-400 mt-1'>nächster Monat</div>
              </div>
            </div>

            {/* Progress Bar Visualization */}
            <div className='mt-6 bg-white p-4 rounded-xl border border-gray-100'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-sm text-gray-600'>Sparfortschritt</span>
                <span className='text-sm font-medium text-emerald-600'>
                  {formatCurrencyFixed(monthlySavings)} / Monat
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-3'>
                <div
                  className='bg-gradient-to-r from-emerald-500 to-green-600 h-3 rounded-full transition-all duration-500'
                  style={{
                    width: `${Math.min((monthlySavings / 1000) * 100, 100)}%`,
                  }}
                ></div>
              </div>
              <div className='text-xs text-gray-500 mt-1'>
                Basierend auf {formatCurrencyFixed(1000)} Sparziel
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
