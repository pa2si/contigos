'use client';

import { useState } from 'react';
import { Settings as SettingsType, Income } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface SettingsProps {
  settings: SettingsType;
  onSettingsChange: (field: keyof SettingsType, value: string) => void;
  onSettingsBlur: () => Promise<void>;
  pascalTotal: number;
  caroTotal: number;
  pascalIncomes: Income[];
  caroIncomes: Income[];
  gesamteinkommen: number;
  children?: React.ReactNode; // For IncomeManagement component
}

export default function Settings({
  settings,
  onSettingsChange,
  onSettingsBlur,
  pascalTotal,
  caroTotal,
  pascalIncomes,
  caroIncomes,
  gesamteinkommen,
  children,
}: SettingsProps) {
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  return (
    <div className='bg-white rounded-lg shadow-md mb-6'>
      {/* Settings Header - Always Visible */}
      <div
        className='p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center'
        onClick={() => setSettingsExpanded(!settingsExpanded)}
      >
        <div>
          <div className='flex items-center gap-3'>
            <h2 className='text-2xl font-semibold'>⚙️ Einstellungen</h2>
            <span
              className={`transform transition-transform duration-200 ${
                settingsExpanded ? 'rotate-180' : ''
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
            Gemeinsames Einkommen:{' '}
            <span className='font-bold'>{formatCurrency(gesamteinkommen)}</span>
          </div>
        </div>
        <div className='text-sm text-gray-500'>
          {settingsExpanded ? 'Klicken zum Schließen' : 'Klicken zum Öffnen'}
        </div>
      </div>

      {/* Collapsible Settings Content */}
      {settingsExpanded && (
        <div className='px-6 pb-6 border-t border-gray-100 animate-in slide-in-from-top duration-200'>
          <div className='pt-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Pascal Einkommen (€)
              </label>
              <div className='w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700 font-medium'>
                {formatCurrency(pascalTotal)}
              </div>
              <p className='text-xs text-gray-500 mt-1'>
                Berechnet aus {pascalIncomes.length} Einkommensposition
                {pascalIncomes.length !== 1 ? 'en' : ''}
              </p>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Caro Einkommen (€)
              </label>
              <div className='w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700 font-medium'>
                {formatCurrency(caroTotal)}
              </div>
              <p className='text-xs text-gray-500 mt-1'>
                Berechnet aus {caroIncomes.length} Einkommensposition
                {caroIncomes.length !== 1 ? 'en' : ''}
              </p>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Rest vom Vormonat (€)
              </label>
              <input
                type='number'
                value={settings.restgeld_vormonat}
                onChange={(e) =>
                  onSettingsChange('restgeld_vormonat', e.target.value)
                }
                onBlur={onSettingsBlur}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Comida (Lebensmittel, €)
              </label>
              <input
                type='number'
                value={settings.comida_betrag}
                onChange={(e) =>
                  onSettingsChange('comida_betrag', e.target.value)
                }
                onBlur={onSettingsBlur}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Ahorros (Sparen, €)
              </label>
              <input
                type='number'
                value={settings.ahorros_betrag}
                onChange={(e) =>
                  onSettingsChange('ahorros_betrag', e.target.value)
                }
                onBlur={onSettingsBlur}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>

          {/* Income Management Section - will be passed as children */}
          {children}
        </div>
      )}
    </div>
  );
}
