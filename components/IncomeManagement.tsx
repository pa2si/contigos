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
  const colorClasses =
    color === 'blue'
      ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
      : 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200';

  return (
    <div className='p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm hover:border-gray-300 transition-all duration-200'>
      {/* Mobile Layout - Stacked */}
      <div className='flex flex-col sm:hidden gap-3'>
        {/* Top Row: Icon, Title and Actions */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 flex-1 min-w-0'>
            <div className='p-1.5 rounded-lg bg-gray-100 shrink-0'>
              <span className='text-base'>💼</span>
            </div>
            <div className='min-w-0 flex-1'>
              <h3 className='font-semibold text-gray-900 text-sm truncate'>
                {income.beschreibung}
              </h3>
              <p className='text-xs text-gray-500'>Monatlich</p>
            </div>
          </div>
          <div className='flex gap-1 shrink-0'>
            <EditButton onClick={onEdit} size='sm' variant='primary' />
            <DeleteButton onClick={onDelete} size='sm' variant='danger' />
          </div>
        </div>

        {/* Bottom Row: Amount */}
        <div className='w-full'>
          <div
            className={`w-full px-3 py-2 rounded-lg font-semibold text-base ${colorClasses}`}
          >
            {formatCurrencyFixed(income.betrag)}
          </div>
        </div>
      </div>

      {/* Desktop Layout - Horizontal */}
      <div className='hidden sm:flex items-center justify-between'>
        {/* Left Side - Income Details */}
        <div className='flex items-center gap-3 flex-1'>
          <div className='p-2 rounded-lg bg-gray-100 shrink-0'>
            <span className='text-lg'>💼</span>
          </div>
          <div className='min-w-0'>
            <h3 className='font-semibold text-gray-900'>
              {income.beschreibung}
            </h3>
            <p className='text-sm text-gray-500'>Monatliches Einkommen</p>
          </div>
        </div>

        {/* Center - Amount */}
        <div className='flex-1 max-w-xs mx-6'>
          <div
            className={`w-full px-3 py-2 rounded-lg font-semibold text-lg text-center ${colorClasses}`}
          >
            {formatCurrencyFixed(income.betrag)}
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className='flex gap-1 shrink-0'>
          <EditButton onClick={onEdit} size='sm' variant='primary' />
          <DeleteButton onClick={onDelete} size='sm' variant='danger' />
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

      {/* Simple Income Sections */}
      <div className='space-y-8'>
        {/* Pascal's Income Section */}
        <div>
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
            <div className='text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-200'>
              <div className='text-4xl mb-3'>💼</div>
              <p className='text-gray-500'>
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
        <div>
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
            <div className='text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-200'>
              <div className='text-4xl mb-3'>💼</div>
              <p className='text-gray-500'>Keine Einkommensquellen für Caro</p>
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

        {/* Summary Section */}
        {(pascalIncomes.length > 0 || caroIncomes.length > 0) && (
          <div className='p-4 bg-blue-50 rounded-lg border border-blue-200'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span className='text-lg'>📊</span>
                <span className='font-semibold text-gray-700'>
                  Gesamteinkommen beider Partner
                </span>
              </div>
              <div className='text-right'>
                <div className='text-2xl font-bold text-blue-600'>
                  {formatCurrencyFixed(pascalTotal + caroTotal)}
                </div>
                <div className='text-sm text-blue-500'>
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
