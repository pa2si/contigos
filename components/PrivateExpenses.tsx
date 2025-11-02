'use client';

import { useState } from 'react';
import { PrivateExpense, Partner } from '@/types';
import { formatCurrencyFixed } from '@/lib/utils';
import EditButton from '@/components/ui/EditButton';
import DeleteButton from '@/components/ui/DeleteButton';

interface PrivateExpensesProps {
  pascalExpenses: PrivateExpense[];
  caroExpenses: PrivateExpense[];
  pascalTotal: number;
  caroTotal: number;
  showAddPrivateExpense: boolean;
  editingPrivateExpense: PrivateExpense | null;
  privateExpenseForm: {
    beschreibung: string;
    betrag: string;
    person: Partner;
  };
  onStartAddPrivateExpense: () => void;
  onStartEditPrivateExpense: (expense: PrivateExpense) => void;
  onUpdatePrivateExpenseForm: (
    field: 'beschreibung' | 'betrag' | 'person',
    value: string | Partner
  ) => void;
  onSavePrivateExpense: () => Promise<void>;
  onResetPrivateExpenseForm: () => void;
  onDeletePrivateExpense: (expenseId: number) => Promise<void>;
  isPrivateExpenseFormValid: () => boolean;
}

export default function PrivateExpenses({
  pascalExpenses,
  caroExpenses,
  pascalTotal,
  caroTotal,
  showAddPrivateExpense,
  editingPrivateExpense,
  privateExpenseForm,
  onStartAddPrivateExpense,
  onStartEditPrivateExpense,
  onUpdatePrivateExpenseForm,
  onSavePrivateExpense,
  onResetPrivateExpenseForm,
  onDeletePrivateExpense,
  isPrivateExpenseFormValid,
}: PrivateExpensesProps) {
  const [privateExpensesExpanded, setPrivateExpensesExpanded] = useState(false);

  return (
    <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
      <div
        className='flex justify-between items-center cursor-pointer'
        onClick={() => setPrivateExpensesExpanded(!privateExpensesExpanded)}
      >
        <div>
          <h2 className='text-2xl font-semibold mb-2'>💳 Private Ausgaben</h2>
          <p className='text-gray-600 text-sm'>
            Persönliche Ausgaben die vom verfügbaren Geld abgezogen werden
          </p>
        </div>
        <div className='flex items-center space-x-4'>
          <div className='text-right text-sm'>
            <div className='text-blue-600'>
              Pascal: {formatCurrencyFixed(pascalTotal)}
            </div>
            <div className='text-green-600'>
              Caro: {formatCurrencyFixed(caroTotal)}
            </div>
          </div>
          <span
            className={`transform transition-transform duration-200 ${
              privateExpensesExpanded ? 'rotate-180' : ''
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
        {privateExpensesExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartAddPrivateExpense();
            }}
            className='px-3 py-1.5 bg-indigo-500 text-white text-sm rounded-md hover:bg-indigo-600 transition-colors'
          >
            + Private Ausgabe hinzufügen
          </button>
        )}
      </div>

      {privateExpensesExpanded && (
        <div className='mt-6 space-y-6'>
          {/* Add/Edit Private Expense Form */}
          {showAddPrivateExpense && (
            <div
              className={`mb-4 p-3 border-2 rounded-lg ${
                privateExpenseForm.person === 'Partner1'
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-green-200 bg-green-50'
              }`}
            >
              <h4 className='text-md font-medium mb-3'>
                {editingPrivateExpense
                  ? 'Private Ausgabe bearbeiten'
                  : 'Neue private Ausgabe hinzufügen'}
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Beschreibung
                  </label>
                  <input
                    type='text'
                    value={privateExpenseForm.beschreibung}
                    onChange={(e) =>
                      onUpdatePrivateExpenseForm('beschreibung', e.target.value)
                    }
                    placeholder='z.B. Kleidung, Hobbies, etc.'
                    className={`w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-sm ${
                      privateExpenseForm.person === 'Partner1'
                        ? 'focus:ring-blue-500'
                        : 'focus:ring-green-500'
                    }`}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Betrag (€)
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    value={privateExpenseForm.betrag}
                    onChange={(e) =>
                      onUpdatePrivateExpenseForm('betrag', e.target.value)
                    }
                    placeholder='0.00'
                    className={`w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-sm ${
                      privateExpenseForm.person === 'Partner1'
                        ? 'focus:ring-blue-500'
                        : 'focus:ring-green-500'
                    }`}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Person
                  </label>
                  <select
                    value={privateExpenseForm.person}
                    onChange={(e) =>
                      onUpdatePrivateExpenseForm(
                        'person',
                        e.target.value as Partner
                      )
                    }
                    className={`w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-sm ${
                      privateExpenseForm.person === 'Partner1'
                        ? 'focus:ring-blue-500'
                        : 'focus:ring-green-500'
                    }`}
                  >
                    <option value='Partner1'>Pascal</option>
                    <option value='Partner2'>Caro</option>
                  </select>
                </div>
              </div>
              <div className='flex gap-2 mt-3'>
                <button
                  onClick={onSavePrivateExpense}
                  disabled={!isPrivateExpenseFormValid()}
                  className={`px-3 py-1.5 text-white text-sm rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors ${
                    privateExpenseForm.person === 'Partner1'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {editingPrivateExpense ? 'Speichern' : 'Hinzufügen'}
                </button>
                <button
                  onClick={onResetPrivateExpenseForm}
                  className='px-3 py-1.5 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors'
                >
                  Abbrechen
                </button>
              </div>
            </div>
          )}

          {/* Private Expenses Lists */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Pascal's Private Expenses */}
            <div className='bg-blue-50 p-3 rounded-lg'>
              <h4 className='font-medium text-blue-800 mb-2'>
                Pascal Private Ausgaben
              </h4>
              {pascalExpenses.length === 0 ? (
                <p className='text-sm text-blue-600 italic py-2'>
                  Keine privaten Ausgaben erfasst
                </p>
              ) : (
                pascalExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className='flex justify-between items-center py-1 px-2 bg-white rounded mb-1 last:mb-0'
                  >
                    <div className='flex-1'>
                      <span className='text-sm font-medium'>
                        {expense.beschreibung}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-semibold text-blue-600'>
                        {formatCurrencyFixed(expense.betrag)}
                      </span>
                      <EditButton
                        onClick={() => onStartEditPrivateExpense(expense)}
                        size='sm'
                        variant='primary'
                      />
                      <DeleteButton
                        onClick={() => onDeletePrivateExpense(expense.id)}
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

            {/* Caro's Private Expenses */}
            <div className='bg-green-50 p-3 rounded-lg'>
              <h4 className='font-medium text-green-800 mb-2'>
                Caro Private Ausgaben
              </h4>
              {caroExpenses.length === 0 ? (
                <p className='text-sm text-green-600 italic py-2'>
                  Keine privaten Ausgaben erfasst
                </p>
              ) : (
                caroExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className='flex justify-between items-center py-1 px-2 bg-white rounded mb-1 last:mb-0'
                  >
                    <div className='flex-1'>
                      <span className='text-sm font-medium'>
                        {expense.beschreibung}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-semibold text-green-600'>
                        {formatCurrencyFixed(expense.betrag)}
                      </span>
                      <EditButton
                        onClick={() => onStartEditPrivateExpense(expense)}
                        size='sm'
                        variant='primary'
                      />
                      <DeleteButton
                        onClick={() => onDeletePrivateExpense(expense.id)}
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
