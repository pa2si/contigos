'use client';

import { useState } from 'react';
import { PrivateExpense, Partner } from '@/types';
import { formatCurrencyFixed } from '@/lib/utils';
import EditButton from '@/components/ui/EditButton';
import DeleteButton from '@/components/ui/DeleteButton';
import PrivateExpenseModal from '@/components/PrivateExpenseModal';

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
  isExpanded?: boolean;
  setIsExpanded?: (expanded: boolean) => void;
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
  isExpanded,
  setIsExpanded,
  onStartAddPrivateExpense,
  onStartEditPrivateExpense,
  onUpdatePrivateExpenseForm,
  onSavePrivateExpense,
  onResetPrivateExpenseForm,
  onDeletePrivateExpense,
  isPrivateExpenseFormValid,
}: PrivateExpensesProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);

  // Use external state if provided, otherwise use internal state
  const privateExpensesExpanded =
    isExpanded !== undefined ? isExpanded : internalExpanded;
  const setPrivateExpensesExpanded = setIsExpanded || setInternalExpanded;

  return (
    <div className='bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 mb-6 overflow-hidden'>
      {/* Modern Header */}
      <div
        className='p-4 sm:p-6 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300'
        onClick={() => setPrivateExpensesExpanded(!privateExpensesExpanded)}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3 sm:gap-4'>
            <div className='bg-gradient-to-br from-purple-500 to-pink-600 p-2 sm:p-3 rounded-xl text-white shadow-lg shrink-0'>
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
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
            </div>
            <div className='min-w-0'>
              <h2 className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
                Private Ausgaben
              </h2>
              <p className='text-sm sm:text-base text-gray-500 mt-1 break-words'>
                Persönliche Ausgaben die vom verfügbaren Geld abgezogen werden
              </p>
            </div>
          </div>

          {/* Total Amount and Toggle Section */}
          <div className='flex items-center justify-between sm:justify-end gap-3 sm:gap-4'>
            <div className='text-left sm:text-right'>
              <div className='text-xs sm:text-sm text-gray-500 whitespace-nowrap'>
                Gesamt privat
              </div>
              <div className='text-sm sm:text-base'>
                <div className='text-blue-600 font-semibold'>
                  Pascal: {formatCurrencyFixed(pascalTotal)}
                </div>
                <div className='text-emerald-600 font-semibold'>
                  Caro: {formatCurrencyFixed(caroTotal)}
                </div>
              </div>
            </div>
            <div
              className={`transform transition-transform duration-300 p-2 rounded-full bg-gray-100 shrink-0 ${
                privateExpensesExpanded ? 'rotate-180' : ''
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
      {privateExpensesExpanded && (
        <div className='border-t border-gray-100 bg-gray-50'>
          <div className='p-4 sm:p-6'>
            {/* Add Button */}
            <div className='flex justify-end mb-4'>
              <button
                onClick={onStartAddPrivateExpense}
                className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2'
              >
                <span>➕</span>
                <span>Private Ausgabe hinzufügen</span>
              </button>
            </div>

            <div className='space-y-6'>
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
                          />
                          <DeleteButton
                            onClick={() => onDeletePrivateExpense(expense.id)}
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
                          />
                          <DeleteButton
                            onClick={() => onDeletePrivateExpense(expense.id)}
                          />
                        </div>
                      </div>
                    ))
                  )}
                  <div className='text-right mt-2 pt-2 border-t border-green-200'>
                    <span className='text-sm font-bold text-emerald-700'>
                      Gesamt: {formatCurrencyFixed(caroTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Private Expense Modal */}
      <PrivateExpenseModal
        isOpen={showAddPrivateExpense}
        onClose={onResetPrivateExpenseForm}
        editingExpense={editingPrivateExpense}
        expenseForm={privateExpenseForm}
        onUpdateExpenseForm={onUpdatePrivateExpenseForm}
        onSaveExpense={onSavePrivateExpense}
        isExpenseFormValid={isPrivateExpenseFormValid}
      />
    </div>
  );
}
