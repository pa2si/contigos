'use client';

import { useState } from 'react';
import { Income, IncomeSource } from '@/types';
import { formatCurrencyFixed } from '@/lib/utils';
import EditButton from '@/components/ui/EditButton';
import DeleteButton from '@/components/ui/DeleteButton';

interface IncomeManagementProps {
  pascalIncomes: Income[];
  caroIncomes: Income[];
  pascalTotal: number;
  caroTotal: number;
  showAddIncome: boolean;
  editingIncome: Income | null;
  incomeForm: {
    beschreibung: string;
    betrag: string;
    quelle: IncomeSource;
  };
  onStartAddIncome: () => void;
  onStartEditIncome: (income: Income) => void;
  onUpdateIncomeForm: (
    field: 'beschreibung' | 'betrag' | 'quelle',
    value: string | IncomeSource
  ) => void;
  onSaveIncome: () => Promise<void>;
  onResetIncomeForm: () => void;
  onDeleteIncome: (incomeId: number) => Promise<void>;
  isIncomeFormValid: () => boolean;
}

export default function IncomeManagement({
  pascalIncomes,
  caroIncomes,
  pascalTotal,
  caroTotal,
  showAddIncome,
  editingIncome,
  incomeForm,
  onStartAddIncome,
  onStartEditIncome,
  onUpdateIncomeForm,
  onSaveIncome,
  onResetIncomeForm,
  onDeleteIncome,
  isIncomeFormValid,
}: IncomeManagementProps) {
  const [incomesExpanded, setIncomesExpanded] = useState(false);

  return (
    <div className='mt-8 pt-6 border-t border-gray-200'>
      <div
        className='cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center mb-4 p-2 rounded-lg'
        onClick={() => setIncomesExpanded(!incomesExpanded)}
      >
        <div className='flex items-center gap-3'>
          <h3 className='text-lg font-semibold text-gray-800'>
            💰 Einkommensquellen
          </h3>
          <span
            className={`transform transition-transform duration-200 ${
              incomesExpanded ? 'rotate-180' : ''
            }`}
          >
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </span>
        </div>
        {incomesExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartAddIncome();
            }}
            className='px-3 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors'
          >
            + Einkommen hinzufügen
          </button>
        )}
      </div>

      {/* Add/Edit Income Form */}
      {showAddIncome && (
        <div className='mb-4 p-3 border-2 border-green-200 rounded-lg bg-green-50'>
          <h4 className='text-md font-medium mb-3'>
            {editingIncome
              ? 'Einkommen bearbeiten'
              : 'Neues Einkommen hinzufügen'}
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Beschreibung
              </label>
              <input
                type='text'
                value={incomeForm.beschreibung}
                onChange={(e) =>
                  onUpdateIncomeForm('beschreibung', e.target.value)
                }
                placeholder='z.B. Gehalt, Freelancing, etc.'
                className='w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Betrag (€)
              </label>
              <input
                type='number'
                step='0.01'
                value={incomeForm.betrag}
                onChange={(e) => onUpdateIncomeForm('betrag', e.target.value)}
                placeholder='0.00'
                className='w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Quelle
              </label>
              <select
                value={incomeForm.quelle}
                onChange={(e) =>
                  onUpdateIncomeForm('quelle', e.target.value as IncomeSource)
                }
                className='w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm'
              >
                <option value='Partner1'>Pascal</option>
                <option value='Partner2'>Caro</option>
              </select>
            </div>
          </div>
          <div className='flex gap-2 mt-3'>
            <button
              onClick={onSaveIncome}
              disabled={!isIncomeFormValid()}
              className='px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
            >
              {editingIncome ? 'Speichern' : 'Hinzufügen'}
            </button>
            <button
              onClick={onResetIncomeForm}
              className='px-3 py-1.5 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors'
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Collapsible Income Content */}
      {incomesExpanded && (
        <div className='animate-in slide-in-from-top duration-200'>
          <div className='space-y-2'>
            {/* Pascal's Income */}
            <div className='bg-blue-50 p-3 rounded-lg'>
              <h4 className='font-medium text-blue-800 mb-2'>
                Pascal Einkommen
              </h4>
              {pascalIncomes.length === 0 ? (
                <p className='text-sm text-blue-600 italic py-2'>
                  Keine Einkommensquellen erfasst
                </p>
              ) : (
                pascalIncomes.map((income) => (
                  <div
                    key={income.id}
                    className='flex justify-between items-center py-1 px-2 bg-white rounded mb-1 last:mb-0'
                  >
                    <div className='flex-1'>
                      <span className='text-sm font-medium'>
                        {income.beschreibung}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-semibold text-blue-600'>
                        {formatCurrencyFixed(income.betrag)}
                      </span>
                      <EditButton
                        onClick={() => onStartEditIncome(income)}
                        size='sm'
                        variant='primary'
                      />
                      <DeleteButton
                        onClick={() => onDeleteIncome(income.id)}
                        size='sm'
                        variant='danger'
                      />
                    </div>
                  </div>
                ))
              )}
              <div className='text-right mt-2 pt-2 border-t border-blue-200'>
                <span className='text-sm font-bold text-blue-700'>
                  Gesamt: {formatCurrencyFixed(pascalTotal)}
                </span>
              </div>
            </div>

            {/* Caro's Income */}
            <div className='bg-green-50 p-3 rounded-lg'>
              <h4 className='font-medium text-green-800 mb-2'>
                Caro Einkommen
              </h4>
              {caroIncomes.length === 0 ? (
                <p className='text-sm text-green-600 italic py-2'>
                  Keine Einkommensquellen erfasst
                </p>
              ) : (
                caroIncomes.map((income) => (
                  <div
                    key={income.id}
                    className='flex justify-between items-center py-1 px-2 bg-white rounded mb-1 last:mb-0'
                  >
                    <div className='flex-1'>
                      <span className='text-sm font-medium'>
                        {income.beschreibung}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-semibold text-green-600'>
                        {formatCurrencyFixed(income.betrag)}
                      </span>
                      <EditButton
                        onClick={() => onStartEditIncome(income)}
                        size='sm'
                        variant='primary'
                      />
                      <DeleteButton
                        onClick={() => onDeleteIncome(income.id)}
                        size='sm'
                        variant='danger'
                      />
                    </div>
                  </div>
                ))
              )}
              <div className='text-right mt-2 pt-2 border-t border-green-200'>
                <span className='text-sm font-bold text-green-700'>
                  Gesamt: {formatCurrencyFixed(caroTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
