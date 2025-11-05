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
      container:
        'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300',
      title: 'text-blue-800',
      amount: 'text-blue-700',
      amountBg: 'bg-blue-200 text-blue-800',
      glow: 'hover:shadow-blue-200',
    },
    green: {
      container:
        'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:border-emerald-300',
      title: 'text-emerald-800',
      amount: 'text-emerald-700',
      amountBg: 'bg-emerald-200 text-emerald-800',
      glow: 'hover:shadow-emerald-200',
    },
  };

  const classes = colorClasses[color];

  return (
    <div
      className={`p-3 sm:p-4 ${classes.container} border-2 rounded-lg hover:shadow-lg ${classes.glow} transition-all duration-200`}
    >
      {/* Mobile Layout - Stacked */}
      <div className='flex flex-col sm:hidden gap-3'>
        {/* Top Row: Icon, Title and Actions */}
        <div className='flex items-start justify-between mb-3'>
          <div className='flex items-start gap-2 flex-1 min-w-0'>
            <div className='p-1.5 rounded-lg bg-white/50 shrink-0'>
              <span className='text-base'>💼</span>
            </div>
            <div className='min-w-0 flex-1'>
              <h3
                className={`font-semibold text-sm leading-tight ${classes.title}`}
              >
                {income.beschreibung}
              </h3>
            </div>
          </div>
          <div className='flex gap-1 shrink-0 ml-2'>
            <EditButton onClick={onEdit} />
            <DeleteButton onClick={onDelete} />
          </div>
        </div>

        {/* Full Width Amount Display */}
        <div className='w-full'>
          <div
            className={`w-full px-4 py-3 rounded-lg font-bold text-lg text-center ${classes.amountBg}`}
          >
            {formatCurrencyFixed(income.betrag)}
          </div>
        </div>
      </div>

      {/* Desktop Layout - Horizontal */}
      <div className='hidden sm:flex items-center justify-between'>
        {/* Left Side - Income Details */}
        <div className='flex items-center gap-3 flex-1'>
          <div className='p-2 rounded-lg bg-white/50 shrink-0'>
            <span className='text-lg'>💼</span>
          </div>
          <div className='min-w-0 flex-1'>
            <h3 className={`font-semibold text-base mb-2 ${classes.title}`}>
              {income.beschreibung}
            </h3>
            <div
              className={`w-full px-4 py-2 rounded-lg font-bold text-lg text-center ${classes.amountBg}`}
            >
              {formatCurrencyFixed(income.betrag)}
            </div>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className='flex gap-1 shrink-0 ml-4'>
          <EditButton onClick={onEdit} />
          <DeleteButton onClick={onDelete} />
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
      {/* Mobile-Responsive Action Bar */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0'>
        <div className='text-sm text-gray-600'>
          <span className='font-medium'>{incomes.length}</span>{' '}
          Einkommensquellen
          {incomes.length > 0 && (
            <span className='block sm:inline sm:ml-2'>
              <span className='hidden sm:inline'>• </span>
              <span>Σ {formatCurrencyFixed(pascalTotal + caroTotal)}</span>
            </span>
          )}
        </div>
        <button
          onClick={onStartAddIncome}
          className='w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center sm:justify-start gap-2'
        >
          <span>➕</span>
          <span className='sm:inline'>Einkommen hinzufügen</span>
        </button>
      </div>

      {/* Income Sections - Side by Side on Desktop */}
      <div className='space-y-8'>
        <div className='space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8'>
          {/* Pascal's Income Section */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-700 flex items-center gap-2'>
                <span>👨‍💼</span>
                Pascal Einkommen
              </h3>
              <div className='text-sm text-gray-500'>
                {pascalIncomes.length > 0 && (
                  <span>Gesamt: {formatCurrencyFixed(pascalTotal)}</span>
                )}
              </div>
            </div>

            {pascalIncomes.length === 0 ? (
              <div className='text-center py-6 lg:py-8 bg-white rounded-lg border-2 border-dashed border-blue-200'>
                <div className='text-3xl lg:text-4xl mb-3'>�‍�💼</div>
                <p className='text-gray-500 text-sm lg:text-base'>
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
          <div className='space-y-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-700 flex items-center gap-2'>
                <span>👩‍💼</span>
                Caro Einkommen
              </h3>
              <div className='text-sm text-gray-500'>
                {caroIncomes.length > 0 && (
                  <span>Gesamt: {formatCurrencyFixed(caroTotal)}</span>
                )}
              </div>
            </div>

            {caroIncomes.length === 0 ? (
              <div className='text-center py-6 lg:py-8 bg-white rounded-lg border-2 border-dashed border-emerald-200'>
                <div className='text-3xl lg:text-4xl mb-3'>�‍�💼</div>
                <p className='text-gray-500 text-sm lg:text-base'>
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
