'use client';

import { useState } from 'react';
import { Expense, Payer, Settings } from '@/types';
import {
  formatCurrency,
  formatCurrencyFixed,
  getPayerDisplayName,
} from '@/lib/utils';

interface ExpenseManagementProps {
  expenses: Expense[];
  settings: Settings;
  showAddExpense: boolean;
  editingExpense: Expense | null;
  expenseForm: {
    beschreibung: string;
    betrag: string;
    bezahlt_von: Payer;
  };
  onStartAddExpense: () => void;
  onStartEditExpense: (expense: Expense) => void;
  onUpdateExpenseForm: (
    field: 'beschreibung' | 'betrag' | 'bezahlt_von',
    value: string | Payer
  ) => void;
  onSaveExpense: () => Promise<void>;
  onResetExpenseForm: () => void;
  onDeleteExpense: (expenseId: number) => Promise<void>;
  isExpenseFormValid: () => boolean;
}

export default function ExpenseManagement({
  expenses,
  settings,
  showAddExpense,
  editingExpense,
  expenseForm,
  onStartAddExpense,
  onStartEditExpense,
  onUpdateExpenseForm,
  onSaveExpense,
  onResetExpenseForm,
  onDeleteExpense,
  isExpenseFormValid,
}: ExpenseManagementProps) {
  const [expensesExpanded, setExpensesExpanded] = useState(false);

  return (
    <div className='bg-white rounded-lg shadow-md'>
      {/* Expenses Header - Clickable */}
      <div
        className='p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center'
        onClick={() => setExpensesExpanded(!expensesExpanded)}
      >
        <div className='flex items-center gap-3'>
          <h2 className='text-2xl font-semibold'>🛒 Ausgaben</h2>
          <span
            className={`transform transition-transform duration-200 ${
              expensesExpanded ? 'rotate-180' : ''
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
        {expensesExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartAddExpense();
            }}
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
          >
            Ausgabe hinzufügen
          </button>
        )}
      </div>

      {/* Collapsible Expenses Content */}
      {expensesExpanded && (
        <div className='px-6 pb-6 border-t border-gray-100 animate-in slide-in-from-top duration-200'>
          <div className='pt-4'>
            {/* Fixed Comida and Ahorros display */}
            <div className='mb-4'>
              <div className='flex items-center justify-between py-2 pl-4 rounded-lg shadow-sm bg-white mb-2 border border-gray-300'>
                <div className='flex-1'>
                  <span className='font-medium'>Comida (Lebensmittel)</span>
                  <span className='ml-2 text-gray-500'>
                    (fix aus Einstellungen)
                  </span>
                </div>
                <span className='font-bold text-lg mr-4'>
                  {formatCurrency(settings.comida_betrag)}
                </span>
                <div className='flex gap-2 invisible'>
                  <button className='px-2 py-1 text-xs'>edit</button>
                  <button className='px-2 py-1 text-xs'>del</button>
                </div>
              </div>

              <div className='flex items-center justify-between py-2 pl-4 rounded-lg shadow-sm bg-white mb-2 border border-gray-300'>
                <div className='flex-1'>
                  <span className='font-medium'>Ahorros (Sparen)</span>
                  <span className='ml-2 text-gray-500'>
                    (fix aus Einstellungen)
                  </span>
                </div>
                <span className='font-bold text-lg mr-4'>
                  {formatCurrency(settings.ahorros_betrag)}
                </span>
                <div className='flex gap-2 invisible'>
                  <button className='px-2 py-1 text-xs'>edit</button>
                  <button className='px-2 py-1 text-xs'>del</button>
                </div>
              </div>
            </div>

            {/* Add/Edit Expense Form */}
            {showAddExpense && (
              <div className='mb-6 p-4 border-2 border-blue-200 rounded-lg bg-blue-50'>
                <h3 className='text-lg font-semibold mb-4'>
                  {editingExpense
                    ? 'Ausgabe editieren'
                    : 'Neue Ausgabe hinzufügen'}
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Beschreibung
                    </label>
                    <input
                      type='text'
                      value={expenseForm.beschreibung}
                      onChange={(e) =>
                        onUpdateExpenseForm('beschreibung', e.target.value)
                      }
                      placeholder='z.B. Einkauf, Miete, etc.'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Betrag (€)
                    </label>
                    <input
                      type='number'
                      step='0.01'
                      value={expenseForm.betrag}
                      onChange={(e) =>
                        onUpdateExpenseForm('betrag', e.target.value)
                      }
                      placeholder='0.00'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Bezahlt von
                    </label>
                    <select
                      value={expenseForm.bezahlt_von}
                      onChange={(e) =>
                        onUpdateExpenseForm(
                          'bezahlt_von',
                          e.target.value as Payer
                        )
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <option value='Partner1'>Pascal</option>
                      <option value='Partner2'>Caro</option>
                      <option value='Gemeinschaftskonto'>
                        Gemeinschaftskonto
                      </option>
                    </select>
                  </div>
                </div>
                <div className='flex gap-2 mt-4'>
                  <button
                    onClick={onSaveExpense}
                    disabled={!isExpenseFormValid()}
                    className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
                  >
                    {editingExpense ? 'Speichern' : 'Hinzufügen'}
                  </button>
                  <button
                    onClick={onResetExpenseForm}
                    className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors'
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            )}

            {/* Dynamic Expenses List */}
            {expenses.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                <p>Noch keine dynamischen Ausgaben erfasst.</p>
                <p className='text-sm'>Füge deine erste Ausgabe hinzu!</p>
              </div>
            ) : (
              <div className='space-y-3'>
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className='flex justify-between items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50'
                  >
                    <div className='flex-1'>
                      <span className='font-medium'>
                        {expense.beschreibung}
                      </span>
                      <span className='text-sm text-gray-500 ml-2'>
                        (bezahlt von {getPayerDisplayName(expense.bezahlt_von)})
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span className='font-semibold text-lg'>
                        {formatCurrencyFixed(expense.betrag)}
                      </span>
                      <div className='flex gap-1'>
                        <button
                          onClick={() => onStartEditExpense(expense)}
                          className='px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
                        >
                          edit
                        </button>
                        <button
                          onClick={() => onDeleteExpense(expense.id)}
                          className='px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors'
                        >
                          del
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
