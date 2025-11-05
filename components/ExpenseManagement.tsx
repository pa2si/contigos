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
import ExpenseModal from '@/components/ExpenseModal';

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
      className={`flex items-center justify-between p-2 sm:p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200 ${
        !isFixed ? 'hover:border-gray-300' : ''
      }`}
    >
      {/* Left Side - Icon and Title */}
      <div className='flex items-center gap-2 flex-1 min-w-0'>
        <div
          className={`p-1.5 rounded-lg shrink-0 ${
            type === 'fixed' ? 'bg-blue-100' : 'bg-gray-100'
          }`}
        >
          <span className='text-sm'>{type === 'fixed' ? '📌' : '🛒'}</span>
        </div>
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2'>
            <h3 className='font-medium text-gray-900 text-sm truncate'>
              {title}
            </h3>
            {isFixed && (
              <span className='bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs font-medium shrink-0'>
                Fix
              </span>
            )}
          </div>
          <p className='text-xs text-gray-500 truncate'>{description}</p>
        </div>
      </div>

      {/* Center - Amount */}
      <div className='text-right mx-3 shrink-0'>
        <div className='text-base font-bold text-gray-900 tabular-nums'>
          {formatCurrencyFixed(amount)}
        </div>
      </div>

      {/* Right Side - Actions */}
      <div className='flex items-center shrink-0'>
        {!isFixed ? (
          <div className='flex gap-1'>
            <EditButton onClick={onEdit!} />
            <DeleteButton onClick={onDelete!} />
          </div>
        ) : (
          <div className='w-12'></div> // Placeholder for consistent alignment
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
  const [expensesExpanded, setExpensesExpanded] = useState(false);

  // Calculate total expenses (dynamic + fixed from settings)
  const dynamicExpensesTotal = expenses.reduce(
    (sum, expense) => sum + expense.betrag,
    0
  );
  const totalExpenses =
    dynamicExpensesTotal +
    settings.comida_betrag +
    settings.ahorros_betrag +
    settings.investieren;

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
                <span className='font-medium'>{expenses.length}</span> weitere
                Ausgaben
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

            {/* Budget Expenses Section */}
            <div className='mb-8'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-700 flex items-center gap-2'>
                  <span>�</span>
                  Budget Ausgaben
                </h3>
                <div className='text-sm text-gray-500'>
                  Konfiguriert in Einstellungen
                </div>
              </div>
              <div className='space-y-2'>
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
                <ExpenseRow
                  title='Investieren'
                  amount={settings.investieren}
                  description='Monatliches Investment Budget'
                  type='fixed'
                  isFixed={true}
                />
              </div>
            </div>

            {/* Additional Expenses Section */}
            <div>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-700 flex items-center gap-2'>
                  <span>📝</span>
                  Weitere Ausgaben
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
                  <div className='text-6xl mb-4'>🤝</div>
                  <p className='text-gray-500 text-lg mb-2'>
                    Noch keine weiteren Ausgaben
                  </p>
                  <p className='text-sm text-gray-400'>
                    Klicke auf &quot;Ausgabe hinzufügen&quot; um zu starten!
                  </p>
                </div>
              ) : (
                <div className='space-y-2'>
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
                          settings.comida_betrag +
                            settings.ahorros_betrag +
                            settings.investieren
                        )}{' '}
                        budget + {formatCurrency(dynamicExpensesTotal)} geteilt
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      <ExpenseModal
        isOpen={showAddExpense}
        onClose={onResetExpenseForm}
        editingExpense={editingExpense}
        expenseForm={expenseForm}
        onUpdateExpenseForm={onUpdateExpenseForm}
        onSaveExpense={onSaveExpense}
        isExpenseFormValid={isExpenseFormValid}
      />
    </div>
  );
}
