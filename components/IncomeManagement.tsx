'use client';

import { Income, IncomeSource } from '@/types';
import { formatCurrencyFixed } from '@/lib/utils';
import EditButton from '@/components/ui/EditButton';
import DeleteButton from '@/components/ui/DeleteButton';

interface IncomeManagementProps {
  incomes: Income[];
  editingIncome: Income | null;
  showAddIncome: boolean;
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
}

export default function IncomeManagement({
  incomes,
  editingIncome,
  showAddIncome,
  incomeForm,
  onStartAddIncome,
  onStartEditIncome,
  onDeleteIncome,
  onUpdateIncomeForm,
  onSaveIncome,
  onResetIncomeForm,
}: IncomeManagementProps) {
  const pascalIncomes = incomes.filter(
    (income) => income.quelle === 'Partner1'
  );
  const caroIncomes = incomes.filter((income) => income.quelle === 'Partner2');
  const pascalTotal = pascalIncomes.reduce(
    (sum, income) => sum + Number(income.betrag),
    0
  );
  const caroTotal = caroIncomes.reduce(
    (sum, income) => sum + Number(income.betrag),
    0
  );

  const isIncomeFormValid = () => {
    return (
      incomeForm.beschreibung.trim() && incomeForm.betrag && incomeForm.quelle
    );
  };

  return (
    <div className='space-y-6'>
      {/* Add Button */}
      <div className='flex justify-end'>
        <button
          onClick={onStartAddIncome}
          className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg'
        >
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 4v16m8-8H4'
            />
          </svg>
          Einkommen hinzufügen
        </button>
      </div>

      {/* Add/Edit Income Form */}
      {showAddIncome && (
        <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-6'>
          <div className='bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-lg mb-6'>
            <h4 className='text-lg font-semibold'>
              {editingIncome
                ? '✏️ Einkommen bearbeiten'
                : '💰 Neues Einkommen hinzufügen'}
            </h4>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Beschreibung
              </label>
              <input
                type='text'
                value={incomeForm.beschreibung}
                onChange={(e) =>
                  onUpdateIncomeForm('beschreibung', e.target.value)
                }
                placeholder='z.B. Gehalt, Freelancing, etc.'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200'
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Betrag (€)
              </label>
              <input
                type='number'
                step='0.01'
                value={incomeForm.betrag}
                onChange={(e) => onUpdateIncomeForm('betrag', e.target.value)}
                placeholder='0.00'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200'
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Quelle
              </label>
              <select
                value={incomeForm.quelle}
                onChange={(e) =>
                  onUpdateIncomeForm('quelle', e.target.value as IncomeSource)
                }
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200'
              >
                <option value='Partner1'>Pascal</option>
                <option value='Partner2'>Caro</option>
              </select>
            </div>
          </div>

          <div className='flex gap-3 mt-6'>
            <button
              onClick={onSaveIncome}
              disabled={!isIncomeFormValid()}
              className='px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg'
            >
              {editingIncome ? 'Speichern' : 'Hinzufügen'}
            </button>
            <button
              onClick={onResetIncomeForm}
              className='px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg'
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Income Cards */}
      <div className='grid grid-cols-1 gap-4 sm:gap-6'>
        {/* Pascal's Income */}
        <div className='bg-white rounded-xl shadow-lg border border-gray-200'>
          <div className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 sm:p-4 rounded-t-xl'>
            <h4 className='text-base sm:text-lg font-semibold flex items-center gap-2'>
              <span className='text-sm sm:text-base'>👨‍💼</span>
              <span className='truncate'>Pascal Einkommen</span>
            </h4>
          </div>
          <div className='p-4 sm:p-6'>
            {pascalIncomes.length === 0 ? (
              <div className='text-center py-6 sm:py-8'>
                <div className='text-3xl sm:text-4xl mb-2 sm:mb-3'>💼</div>
                <p className='text-gray-500 italic text-sm sm:text-base'>
                  Keine Einkommensquellen erfasst
                </p>
              </div>
            ) : (
              <div className='space-y-2 sm:space-y-3'>
                {pascalIncomes.map((income) => (
                  <div
                    key={income.id}
                    className='flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 sm:p-3 bg-gray-50 rounded-lg border hover:shadow-md transition-all duration-200 gap-2 sm:gap-3'
                  >
                    <div className='flex-1 min-w-0'>
                      <span className='font-medium text-gray-800 text-sm sm:text-base block truncate'>
                        {income.beschreibung}
                      </span>
                    </div>
                    <div className='flex items-center justify-between sm:justify-end gap-2 sm:gap-3'>
                      <span className='font-bold text-blue-600 bg-blue-100 px-2 sm:px-3 py-1 rounded-full text-sm sm:text-base flex-shrink-0'>
                        {formatCurrencyFixed(income.betrag)}
                      </span>
                      <div className='flex gap-1 flex-shrink-0'>
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
                  </div>
                ))}
              </div>
            )}

            <div className='mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200'>
              <div className='flex justify-between items-center'>
                <span className='text-gray-700 font-medium text-sm sm:text-base'>
                  Gesamt:
                </span>
                <span className='text-lg sm:text-xl font-bold text-blue-600 bg-blue-100 px-3 sm:px-4 py-1 sm:py-2 rounded-full'>
                  {formatCurrencyFixed(pascalTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Caro's Income */}
        <div className='bg-white rounded-xl shadow-lg border border-gray-200'>
          <div className='bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 sm:p-4 rounded-t-xl'>
            <h4 className='text-base sm:text-lg font-semibold flex items-center gap-2'>
              <span className='text-sm sm:text-base'>👩‍💼</span>
              <span className='truncate'>Caro Einkommen</span>
            </h4>
          </div>
          <div className='p-4 sm:p-6'>
            {caroIncomes.length === 0 ? (
              <div className='text-center py-6 sm:py-8'>
                <div className='text-3xl sm:text-4xl mb-2 sm:mb-3'>💼</div>
                <p className='text-gray-500 italic text-sm sm:text-base'>
                  Keine Einkommensquellen erfasst
                </p>
              </div>
            ) : (
              <div className='space-y-2 sm:space-y-3'>
                {caroIncomes.map((income) => (
                  <div
                    key={income.id}
                    className='flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 sm:p-3 bg-gray-50 rounded-lg border hover:shadow-md transition-all duration-200 gap-2 sm:gap-3'
                  >
                    <div className='flex-1 min-w-0'>
                      <span className='font-medium text-gray-800 text-sm sm:text-base block truncate'>
                        {income.beschreibung}
                      </span>
                    </div>
                    <div className='flex items-center justify-between sm:justify-end gap-2 sm:gap-3'>
                      <span className='font-bold text-green-600 bg-green-100 px-2 sm:px-3 py-1 rounded-full text-sm sm:text-base flex-shrink-0'>
                        {formatCurrencyFixed(income.betrag)}
                      </span>
                      <div className='flex gap-1 flex-shrink-0'>
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
                  </div>
                ))}
              </div>
            )}

            <div className='mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200'>
              <div className='flex justify-between items-center'>
                <span className='text-gray-700 font-medium text-sm sm:text-base'>
                  Gesamt:
                </span>
                <span className='text-lg sm:text-xl font-bold text-green-600 bg-green-100 px-3 sm:px-4 py-1 sm:py-2 rounded-full'>
                  {formatCurrencyFixed(caroTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
