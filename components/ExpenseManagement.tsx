'use client';

import { useState } from 'react';
import { Expense, Payer, Settings } from '@/types';
import {
  formatCurrency,
  formatCurrencyFixed,
  getPayerDisplayName,
} from '@/lib/utils';
import EditButton from '@/components/ui/EditButton';
import DeleteButton from '@/components/ui/DeleteButton';

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

// Clean Expense Row Component
const ExpenseRow = ({
  title,
  amount,
  description,
  type,
  onEdit,
  onDelete,
  isFixed = false,
}: {
  title: string;
  amount: number;
  description: string;
  type: 'fixed' | 'dynamic';
  onEdit?: () => void;
  onDelete?: () => void;
  isFixed?: boolean;
}) => {
  return (
    <div
      className={`flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200 ${
        !isFixed ? 'hover:border-gray-300' : ''
      }`}
    >
      {/* Left Side - Icon and Title */}
      <div className='flex items-center gap-3 flex-1'>
        <div
          className={`p-2 rounded-lg ${
            type === 'fixed' ? 'bg-blue-100' : 'bg-gray-100'
          }`}
        >
          <span className='text-lg'>{type === 'fixed' ? '📌' : '🛒'}</span>
        </div>
        <div>
          <div className='flex items-center gap-2'>
            <h3 className='font-semibold text-gray-900'>{title}</h3>
            {isFixed && (
              <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium'>
                Fix
              </span>
            )}
          </div>
          <p className='text-sm text-gray-500'>{description}</p>
        </div>
      </div>

      {/* Center - Amount */}
      <div className='text-right mx-6'>
        <div className='text-xl font-bold text-gray-900'>
          {formatCurrencyFixed(amount)}
        </div>
      </div>

      {/* Right Side - Actions */}
      <div className='flex items-center'>
        {!isFixed ? (
          <div className='flex gap-1'>
            <EditButton onClick={onEdit!} size='sm' variant='primary' />
            <DeleteButton onClick={onDelete!} size='sm' variant='danger' />
          </div>
        ) : (
          <div className='w-16'></div> // Placeholder for consistent alignment
        )}
      </div>
    </div>
  );
};

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
  const [expensesExpanded, setExpensesExpanded] = useState(true);

  // Calculate total expenses (dynamic + fixed from settings)
  const dynamicExpensesTotal = expenses.reduce(
    (sum, expense) => sum + expense.betrag,
    0
  );
  const totalExpenses =
    dynamicExpensesTotal + settings.comida_betrag + settings.ahorros_betrag;

  return (
    <div className='bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 mb-6 overflow-hidden'>
      {/* Modern Header */}
      <div
        className='p-4 sm:p-6 cursor-pointer hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 transition-all duration-300'
        onClick={() => setExpensesExpanded(!expensesExpanded)}
      >
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
          {/* Title Section */}
          <div className='flex items-center gap-3 sm:gap-4'>
            <div className='bg-gradient-to-br from-red-500 to-rose-600 p-2 sm:p-3 rounded-xl text-white shadow-lg flex-shrink-0'>
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
                  d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                />
              </svg>
            </div>
            <div className='min-w-0'>
              <h2 className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
                Ausgaben Verwaltung
              </h2>
              <p className='text-sm sm:text-base text-gray-500 mt-1 break-words'>
                Verwalte deine monatlichen Ausgaben und Kosten
              </p>
            </div>
          </div>

          {/* Total Amount and Toggle Section */}
          <div className='flex items-center justify-between sm:justify-end gap-3 sm:gap-4'>
            <div className='text-left sm:text-right'>
              <div className='text-xs sm:text-sm text-gray-500 whitespace-nowrap'>
                Gesamtausgaben
              </div>
              <div className='text-lg sm:text-xl font-bold text-red-600'>
                {formatCurrency(totalExpenses)}
              </div>
            </div>
            <div
              className={`transform transition-transform duration-300 p-2 rounded-full bg-gray-100 flex-shrink-0 ${
                expensesExpanded ? 'rotate-180' : ''
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
      {expensesExpanded && (
        <div className='border-t border-gray-100 bg-gray-50'>
          <div className='p-4 sm:p-6'>
            {/* Action Bar */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
              <div className='text-sm text-gray-600'>
                <span className='font-medium'>{expenses.length}</span>{' '}
                dynamische Ausgaben
                {expenses.length > 0 && (
                  <span className='ml-2'>
                    • Σ {formatCurrency(dynamicExpensesTotal)}
                  </span>
                )}
              </div>
              <button
                onClick={onStartAddExpense}
                className='bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-lg font-medium hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2'
              >
                <span className='text-lg'>➕</span>
                Ausgabe hinzufügen
              </button>
            </div>

            {/* Fixed Expenses Section */}
            <div className='mb-8'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-700 flex items-center gap-2'>
                  <span>📌</span>
                  Fixe Ausgaben
                </h3>
                <div className='text-sm text-gray-500'>
                  Konfiguriert in Einstellungen
                </div>
              </div>
              <div className='space-y-3'>
                <ExpenseRow
                  title='Comida (Lebensmittel)'
                  amount={settings.comida_betrag}
                  description='Monatliche Ausgabe für Lebensmittel'
                  type='fixed'
                  isFixed={true}
                />
                <ExpenseRow
                  title='Ahorros (Sparen)'
                  amount={settings.ahorros_betrag}
                  description='Monatlicher Sparbetrag'
                  type='fixed'
                  isFixed={true}
                />
              </div>
            </div>

            {/* Modern Add/Edit Form */}
            {showAddExpense && (
              <div className='mb-6 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm'>
                <div className='p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100'>
                  <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
                    <span className='text-xl'>
                      {editingExpense ? '✏️' : '➕'}
                    </span>
                    {editingExpense
                      ? 'Ausgabe bearbeiten'
                      : 'Neue Ausgabe hinzufügen'}
                  </h3>
                </div>
                <div className='p-4'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        📝 Beschreibung
                      </label>
                      <input
                        type='text'
                        value={expenseForm.beschreibung}
                        onChange={(e) =>
                          onUpdateExpenseForm('beschreibung', e.target.value)
                        }
                        placeholder='z.B. Einkauf, Miete, etc.'
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        💰 Betrag (€)
                      </label>
                      <input
                        type='number'
                        step='0.01'
                        value={expenseForm.betrag}
                        onChange={(e) =>
                          onUpdateExpenseForm('betrag', e.target.value)
                        }
                        placeholder='0.00'
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        👤 Bezahlt von
                      </label>
                      <select
                        value={expenseForm.bezahlt_von}
                        onChange={(e) =>
                          onUpdateExpenseForm(
                            'bezahlt_von',
                            e.target.value as Payer
                          )
                        }
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                      >
                        <option value='Partner1'>👨‍💼 Pascal</option>
                        <option value='Partner2'>👩‍💼 Caro</option>
                        <option value='Gemeinschaftskonto'>
                          🏦 Gemeinschaftskonto
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className='flex gap-3'>
                    <button
                      onClick={onSaveExpense}
                      disabled={!isExpenseFormValid()}
                      className='px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2'
                    >
                      <span>{editingExpense ? '💾' : '➕'}</span>
                      {editingExpense ? 'Speichern' : 'Hinzufügen'}
                    </button>
                    <button
                      onClick={onResetExpenseForm}
                      className='px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl font-medium hover:from-gray-500 hover:to-gray-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2'
                    >
                      <span>❌</span>
                      Abbrechen
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Expenses Section */}
            <div>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-700 flex items-center gap-2'>
                  <span>🛒</span>
                  Dynamische Ausgaben
                </h3>
                <div className='flex items-center gap-4 text-sm text-gray-500'>
                  {expenses.length > 0 && (
                    <>
                      <span>{expenses.length} Einträge</span>
                      <span>•</span>
                      <span>Σ {formatCurrency(dynamicExpensesTotal)}</span>
                    </>
                  )}
                </div>
              </div>

              {expenses.length === 0 ? (
                <div className='text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200'>
                  <div className='text-6xl mb-4'>🛒</div>
                  <p className='text-gray-500 text-lg mb-2'>
                    Noch keine dynamischen Ausgaben
                  </p>
                  <p className='text-sm text-gray-400'>
                    Klicke auf &quot;Ausgabe hinzufügen&quot; um zu starten!
                  </p>
                </div>
              ) : (
                <div className='space-y-3'>
                  {expenses.map((expense) => (
                    <ExpenseRow
                      key={expense.id}
                      title={expense.beschreibung}
                      amount={expense.betrag}
                      description={`Bezahlt von ${getPayerDisplayName(
                        expense.bezahlt_von
                      )}`}
                      type='dynamic'
                      onEdit={() => onStartEditExpense(expense)}
                      onDelete={() => onDeleteExpense(expense.id)}
                    />
                  ))}
                </div>
              )}

              {/* Summary Row */}
              {expenses.length > 0 && (
                <div className='mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <span className='text-lg'>📊</span>
                      <span className='font-semibold text-gray-700'>
                        Gesamtsumme aller Ausgaben
                      </span>
                    </div>
                    <div className='text-right'>
                      <div className='text-2xl font-bold text-blue-600'>
                        {formatCurrency(totalExpenses)}
                      </div>
                      <div className='text-sm text-blue-500'>
                        {formatCurrency(
                          settings.comida_betrag + settings.ahorros_betrag
                        )}{' '}
                        fix + {formatCurrency(dynamicExpensesTotal)} dynamisch
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
