'use client';

import { Income } from '@/types';
import { IncomeSource } from '@prisma/client';
import { formatCurrencyFixed } from '@/lib/utils';
import EditButton from '@/components/ui/EditButton';
import DeleteButton from '@/components/ui/DeleteButton';
import IncomeModal from '@/components/IncomeModal';

// Clean Income Row Component - Mobile Responsive
const IncomeRow = ({
  income,
  onEdit,
  onDelete,
  color = 'blue',
}: {
  income: Income;
  onEdit: () => void;
  onDelete: () => void;
  color?: 'blue' | 'green';
}) => {
  const colorClasses = {
    blue: {
      container: 'bg-blue-50 border border-blue-100',
      text: 'text-blue-700',
      amount: 'text-blue-700',
      amountBg:
        'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow',
      glow: 'hover:shadow-blue-200',
    },
    green: {
      container: 'bg-emerald-50 border border-emerald-100',
      text: 'text-emerald-700',
      amount: 'text-emerald-700',
      amountBg:
        'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow',
      glow: 'hover:shadow-emerald-200',
    },
  };

  const classes = colorClasses[color];

  return (
    <div className='group'>
      {/* Mobile Layout - Stacked (compact pastel card) */}
      <div className='flex flex-col sm:hidden gap-2'>
        <div className={`px-3 py-2 rounded-lg ${classes.container} flex items-center justify-between`}>
          <div className='flex-1 pr-3'>
            <div className='font-medium text-sm leading-tight'>{income.beschreibung}</div>
            <div className='text-xs text-gray-500 mt-0.5'>{income.quelle}</div>
          </div>
          <div className='flex items-center gap-2'>
            <div className={`px-3 py-1 rounded-full ${classes.amountBg} font-bold text-sm`}>{formatCurrencyFixed(income.betrag)}</div>
            <div className='flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity'>
              <EditButton onClick={onEdit} variant='income' />
              <DeleteButton onClick={onDelete} variant='income' />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Horizontal (compact pastel card with amount pill) */}
      <div className='hidden sm:block'>
        <div className={`px-4 py-3 rounded-lg ${classes.container} flex items-center justify-between hover:shadow-sm transition-shadow`}>
          <div className='flex-1 pr-4'>
            <div className='font-medium text-sm'>{income.beschreibung}</div>
            <div className='text-xs text-gray-500 mt-0.5'>{income.quelle}</div>
          </div>
          <div className='flex items-center gap-3'>
            <div className={`px-4 py-1 rounded-full ${classes.amountBg} font-bold text-base`}>{formatCurrencyFixed(income.betrag)}</div>
            <div className='flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity'>
              <EditButton onClick={onEdit} variant='income' />
              <DeleteButton onClick={onDelete} variant='income' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

  const isIncomeFormValid = (): boolean => {
    return Boolean(
      incomeForm.beschreibung.trim() && incomeForm.betrag && incomeForm.quelle
    );
  };

  return (
    <div className='space-y-6'>
      {/* Income Sections - Side by Side on Desktop */}
      <div className='space-y-8'>
        <div className='space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8'>
          {/* Pascal's Income Section */}
          <div className='bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-200/50 rounded-xl p-4 space-y-4 backdrop-blur'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-blue-700 flex items-center gap-2'>
                <span>👨‍💼</span>
                Pascal Einkommen
              </h3>
              <div className='text-sm text-blue-600 font-medium'>
                {pascalIncomes.length > 0 && (
                  <span>Gesamt: {formatCurrencyFixed(pascalTotal)}</span>
                )}
              </div>
            </div>

            {pascalIncomes.length === 0 ? (
              <div className='text-center py-6 lg:py-8 bg-white/50 rounded-lg border border-dashed border-blue-300/50'>
                <div className='text-3xl lg:text-4xl mb-3'>👨‍💼</div>
                <p className='text-blue-600 text-sm lg:text-base'>
                  Keine Einkommensquellen für Pascal
                </p>
              </div>
            ) : (
              <div className='space-y-3'>
                {pascalIncomes.map((income) => (
                  <IncomeRow
                    key={income.id}
                    income={income}
                    onEdit={() => onStartEditIncome(income)}
                    onDelete={() => onDeleteIncome(income.id)}
                    color='blue'
                  />
                ))}
              </div>
            )}
          </div>

          {/* Caro's Income Section */}
          <div className='bg-gradient-to-r from-emerald-500/10 to-green-600/10 border border-emerald-200/50 rounded-xl p-4 space-y-4 backdrop-blur'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-emerald-700 flex items-center gap-2'>
                <span>👩‍💼</span>
                Caro Einkommen
              </h3>
              <div className='text-sm text-emerald-600 font-medium'>
                {caroIncomes.length > 0 && (
                  <span>Gesamt: {formatCurrencyFixed(caroTotal)}</span>
                )}
              </div>
            </div>

            {caroIncomes.length === 0 ? (
              <div className='text-center py-6 lg:py-8 bg-white/50 rounded-lg border border-dashed border-emerald-300/50'>
                <div className='text-3xl lg:text-4xl mb-3'>👩‍💼</div>
                <p className='text-emerald-600 text-sm lg:text-base'>
                  Keine Einkommensquellen für Caro
                </p>
              </div>
            ) : (
              <div className='space-y-3'>
                {caroIncomes.map((income) => (
                  <IncomeRow
                    key={income.id}
                    income={income}
                    onEdit={() => onStartEditIncome(income)}
                    onDelete={() => onDeleteIncome(income.id)}
                    color='green'
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary Section */}
        {(pascalIncomes.length > 0 || caroIncomes.length > 0) && (
          <div className='p-4 lg:p-6 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg border border-blue-200'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
              <div className='flex items-center gap-2'>
                <span className='text-xl'>📊</span>
                <span className='font-semibold text-gray-800 text-lg'>
                  Gesamteinkommen beider Partner
                </span>
              </div>
              <div className='text-left sm:text-right'>
                <div className='text-2xl lg:text-3xl font-bold text-gray-800'>
                  {formatCurrencyFixed(pascalTotal + caroTotal)}
                </div>
                <div className='text-sm text-gray-600 mt-1'>
                  Pascal: {formatCurrencyFixed(pascalTotal)} + Caro:{' '}
                  {formatCurrencyFixed(caroTotal)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Income Button at the Bottom */}
      <div className='flex justify-end'>
        <button
          onClick={onStartAddIncome}
          className='w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center sm:justify-start gap-2 mt-4'
        >
          <span>➕</span>
          <span className='sm:inline'>Einkommen hinzufügen</span>
        </button>
      </div>

      {/* Income Modal */}
      <IncomeModal
        isOpen={showAddIncome}
        onClose={onResetIncomeForm}
        editingIncome={editingIncome}
        incomeForm={incomeForm}
        onUpdateIncomeForm={onUpdateIncomeForm}
        onSaveIncome={onSaveIncome}
        isIncomeFormValid={isIncomeFormValid}
      />
    </div>
  );
}
