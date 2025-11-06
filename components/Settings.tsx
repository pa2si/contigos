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
  children?: React.ReactNode;
}

type SettingsTab = 'overview' | 'income' | 'budget' | 'savings';

// Move InputCard component outside of render
const InputCard = ({
  title,
  value,
  onChange,
  icon,
  description,
  color = 'blue',
  isReadOnly = false,
  onBlur,
}: {
  title: string;
  value: number | string;
  onChange?: (value: string) => void;
  icon: string;
  description: string;
  color?: 'blue' | 'green' | 'purple' | 'amber';
  isReadOnly?: boolean;
  onBlur?: () => Promise<void>;
}) => {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50 text-blue-900 focus:border-blue-500 focus:ring-blue-500',
    green:
      'border-green-200 bg-green-50 text-green-900 focus:border-green-500 focus:ring-green-500',
    purple:
      'border-purple-200 bg-purple-50 text-purple-900 focus:border-purple-500 focus:ring-purple-500',
    amber:
      'border-amber-200 bg-amber-50 text-amber-900 focus:border-amber-500 focus:ring-amber-500',
  };

  return (
    <div className='bg-white p-3 sm:p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200'>
      <div className='flex items-start sm:items-center gap-2 sm:gap-3 mb-3'>
        <span className='text-xl sm:text-2xl flex-shrink-0'>{icon}</span>
        <div className='min-w-0 flex-1'>
          <h3 className='font-semibold text-gray-900 text-sm sm:text-base truncate'>
            {title}
          </h3>
          <p className='text-xs sm:text-sm text-gray-500 break-words'>
            {description}
          </p>
        </div>
      </div>

      {isReadOnly ? (
        <div
          className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-base sm:text-lg ${colorClasses[color]} break-all`}
        >
          {typeof value === 'number' ? formatCurrency(value) : value}
        </div>
      ) : (
        <div className='relative'>
          <span className='absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm sm:text-base'>
            €
          </span>
          <input
            type='number'
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onBlur={onBlur}
            className={`w-full pl-6 sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-3 rounded-lg border-2 transition-colors font-semibold text-base sm:text-lg ${colorClasses[color]}`}
            placeholder='0.00'
            step='0.01'
          />
        </div>
      )}
    </div>
  );
};

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
  const [activeTab, setActiveTab] = useState<SettingsTab>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Übersicht', icon: '📊' },
    { id: 'income' as const, label: 'Einkommen', icon: '💼' },
    { id: 'budget' as const, label: 'Budget', icon: '💰' },
    { id: 'savings' as const, label: 'Sparen', icon: '🏦' },
  ];

  return (
    <div className='bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 mb-6 overflow-hidden'>
      {/* Modern Header */}
      <div
        className='p-4 sm:p-6 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300'
        onClick={() => setSettingsExpanded(!settingsExpanded)}
      >
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
          {/* Title Section */}
          <div className='flex items-center gap-3 sm:gap-4'>
            <div className='bg-gradient-to-br from-blue-500 to-purple-600 p-2 sm:p-3 rounded-xl text-white shadow-lg flex-shrink-0'>
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
                  d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            </div>
            <div className='min-w-0'>
              <h2 className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
                Einstellungen
              </h2>
              <p className='text-sm sm:text-base text-gray-500 mt-1 break-words'>
                Verwalte deine Finanzen und Budgets
              </p>
            </div>
          </div>

          {/* Income and Toggle Section */}
          <div className='flex items-center justify-between sm:justify-end gap-3 sm:gap-4'>
            <div className='text-left sm:text-right'>
              <div className='text-xs sm:text-sm text-gray-500 whitespace-nowrap'>
                Gemeinsames Einkommen
              </div>
              <div className='text-lg sm:text-xl font-bold text-green-600'>
                {formatCurrency(gesamteinkommen)}
              </div>
            </div>
            <div
              className={`transform transition-transform duration-300 p-2 rounded-full bg-gray-100 flex-shrink-0 ${
                settingsExpanded ? 'rotate-180' : ''
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

      {/* Modern Tabbed Content */}
      {settingsExpanded && (
        <div className='border-t border-gray-100 bg-gray-50'>
          {/* Tab Navigation */}
          <div className='px-4 sm:px-6 pt-4 sm:pt-6'>
            <nav className='grid grid-cols-2 sm:flex sm:space-x-2 gap-2 sm:gap-0'>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center sm:justify-start gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm border border-blue-100'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <span className='text-base sm:text-lg'>{tab.icon}</span>
                  <span className='truncate'>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className='p-4 sm:p-6'>
            {activeTab === 'overview' && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
                {/* Pascal overview card (match Einkommen UI) */}
                <div className='bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-100 p-4 space-y-3'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-semibold text-blue-700 flex items-center gap-2'>
                      <span>👨‍💼</span>
                      Pascal Einkommen
                    </h3>
                    <div className='text-sm text-blue-600 font-medium'>
                      {pascalIncomes.length > 0 && (
                        <span>Gesamt: {formatCurrency(pascalTotal)}</span>
                      )}
                    </div>
                  </div>
                  <div className='text-2xl font-bold text-gray-800'>
                    {formatCurrency(pascalTotal)}
                  </div>
                  <div className='text-sm text-gray-500'>
                    {pascalIncomes.length} Einkommensquelle
                    {pascalIncomes.length !== 1 ? 'n' : ''}
                  </div>
                </div>

                {/* Caro overview card (match Einkommen UI) */}
                <div className='bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl border border-emerald-100 p-4 space-y-3'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-semibold text-emerald-700 flex items-center gap-2'>
                      <span>👩‍💼</span>
                      Caro Einkommen
                    </h3>
                    <div className='text-sm text-emerald-600 font-medium'>
                      {caroIncomes.length > 0 && (
                        <span>Gesamt: {formatCurrency(caroTotal)}</span>
                      )}
                    </div>
                  </div>
                  <div className='text-2xl font-bold text-gray-800'>
                    {formatCurrency(caroTotal)}
                  </div>
                  <div className='text-sm text-gray-500'>
                    {caroIncomes.length} Einkommensquelle
                    {caroIncomes.length !== 1 ? 'n' : ''}
                  </div>
                </div>

                {/* Rest vom Vormonat - keep Input style but align visually */}
                <div className='bg-white p-3 sm:p-4 rounded-xl border border-gray-100'>
                  <div className='flex items-start sm:items-center gap-2 sm:gap-3 mb-3'>
                    <span className='text-xl sm:text-2xl shrink-0'>💰</span>
                    <div className='min-w-0 flex-1'>
                      <h3 className='font-semibold text-gray-900 text-sm sm:text-base truncate'>
                        Rest vom Vormonat
                      </h3>
                      <p className='text-xs sm:text-sm text-gray-500 wrap-break-word'>
                        Übrig gebliebenes Geld vom letzten Monat
                      </p>
                    </div>
                  </div>
                  <div className='w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-base sm:text-lg border-2 border-amber-200 text-amber-900 transition-colors'>
                    {formatCurrency(settings.restgeld_vormonat)}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'income' && (
              <div className='space-y-6'>{children}</div>
            )}

            {activeTab === 'budget' && (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                <InputCard
                  title='Comida (Lebensmittel)'
                  value={settings.comida_betrag}
                  onChange={(value) => onSettingsChange('comida_betrag', value)}
                  onBlur={onSettingsBlur}
                  icon='🛒'
                  description='Monatliches Budget für Lebensmittel'
                  color='green'
                />
                <InputCard
                  title='Ahorros (Sparen)'
                  value={settings.ahorros_betrag}
                  onChange={(value) =>
                    onSettingsChange('ahorros_betrag', value)
                  }
                  onBlur={onSettingsBlur}
                  icon='💎'
                  description='Monatlicher Sparbetrag'
                  color='purple'
                />
                <InputCard
                  title='Investieren'
                  value={settings.investieren}
                  onChange={(value) => onSettingsChange('investieren', value)}
                  onBlur={onSettingsBlur}
                  icon='📊'
                  description='Monatliches Investment Budget'
                  color='blue'
                />
              </div>
            )}

            {activeTab === 'savings' && (
              <div className='space-y-4 sm:space-y-6'>
                {/* Budget Overview */}
                <div className='bg-white p-4 sm:p-6 rounded-xl border border-gray-100'>
                  <h3 className='font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base'>
                    <span>💰</span>
                    Monatliche Budget Übersicht
                  </h3>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='bg-purple-50 p-4 rounded-lg border border-purple-200'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='text-lg'>💎</span>
                        <span className='font-medium text-purple-900'>
                          Sparen
                        </span>
                      </div>
                      <div className='text-2xl font-bold text-purple-700'>
                        {formatCurrency(settings.ahorros_betrag)}
                      </div>
                      <div className='text-xs text-purple-600 mt-1'>
                        pro Monat
                      </div>
                    </div>
                    <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='text-lg'>📊</span>
                        <span className='font-medium text-blue-900'>
                          Investieren
                        </span>
                      </div>
                      <div className='text-2xl font-bold text-blue-700'>
                        {formatCurrency(settings.investieren)}
                      </div>
                      <div className='text-xs text-blue-600 mt-1'>
                        pro Monat
                      </div>
                    </div>
                  </div>
                  <div className='mt-4 p-3 bg-green-50 rounded-lg border border-green-200'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium text-green-900'>
                        Gesamtes monatliches Sparziel:
                      </span>
                      <span className='text-lg font-bold text-green-700'>
                        {formatCurrency(
                          Number(settings.ahorros_betrag) +
                            Number(settings.investieren)
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-4 sm:gap-6'>
                  <InputCard
                    title='Tagesgeldkonto'
                    value={settings.tagesgeldkonto_betrag}
                    onChange={(value) =>
                      onSettingsChange('tagesgeldkonto_betrag', value)
                    }
                    onBlur={onSettingsBlur}
                    icon='🏦'
                    description='Aktueller Stand deines Tagesgeldkontos'
                    color='blue'
                  />
                </div>

                {/* Savings Progress Visualization */}
                <div className='bg-white p-4 sm:p-6 rounded-xl border border-gray-100'>
                  <h3 className='font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base'>
                    <span>📈</span>
                    Spar- und Investitionsfortschritt
                  </h3>

                  {/* Savings Progress */}
                  <div className='mb-4'>
                    <div className='flex justify-between items-center mb-2'>
                      <span className='text-sm font-medium text-purple-700'>
                        Sparen
                      </span>
                      <span className='text-sm text-gray-600'>
                        {formatCurrency(settings.tagesgeldkonto_betrag)} /{' '}
                        {formatCurrency(settings.ahorros_betrag)} Monatsziel
                      </span>
                    </div>
                    <div className='bg-gray-200 rounded-full h-2'>
                      <div
                        className='bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500'
                        style={{
                          width:
                            settings.ahorros_betrag > 0
                              ? `${Math.min(
                                  (settings.tagesgeldkonto_betrag /
                                    settings.ahorros_betrag) *
                                    100,
                                  100
                                )}%`
                              : '0%',
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Investment Progress */}
                  <div className='mb-4'>
                    <div className='flex justify-between items-center mb-2'>
                      <span className='text-sm font-medium text-blue-700'>
                        Investieren
                      </span>
                      <span className='text-sm text-gray-600'>
                        0 € / {formatCurrency(settings.investieren)} Monatsziel
                      </span>
                    </div>
                    <div className='bg-gray-200 rounded-full h-2'>
                      <div
                        className='bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500'
                        style={{ width: '0%' }}
                      ></div>
                    </div>
                  </div>

                  {/* Total Progress */}
                  <div className='p-3 bg-gray-50 rounded-lg'>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='font-medium text-gray-700'>
                        Gesamtfortschritt diesen Monat:
                      </span>
                      <span className='font-bold text-gray-900'>
                        {formatCurrency(settings.tagesgeldkonto_betrag)} /{' '}
                        {formatCurrency(
                          Number(settings.ahorros_betrag) +
                            Number(settings.investieren)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
