'use client';

import { useEffect, useState } from 'react';
import {
  useSettingsOperations,
  useExpensesOperations,
  useExpenseForm,
  useIncomeOperations,
  useIncomeForm,
  useAppData,
  useFinancialCalculations,
  usePartnerIncomes,
  usePrivateExpenseOperations,
  usePrivateExpenseForm,
} from '@/hooks';
import {
  parseNumber,
  validateExpenseForm,
  validateIncomeForm,
} from '@/lib/utils';
import { PrivateExpense } from '@/types';
import { ApiService } from '@/lib/api';

// Import our new components
import Settings from '@/components/Settings';
import IncomeManagement from '@/components/IncomeManagement';

import Summary from '@/components/Summary';
import MonthNav from '@/components/MonthNav';
import ExpenseManagement from '@/components/ExpenseManagement';
import ConfirmationModal from '@/components/ConfirmationModal';
import TabLayout from '@/components/TabLayout';
import PrivateExpenses from '@/components/PrivateExpenses';

export default function HomePage() {
  // Local loading state for data fetching
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Combined data management hook (prevents infinite loops)
  const {
    settings,
    setSettings,
    expenses,
    setExpenses,
    incomes,
    setIncomes,
    loadData,
  } = useAppData();

  // Settings operations hook
  const { updateSettings, saveSettings } = useSettingsOperations(
    settings,
    setSettings
  );

  // Expenses operations hook
  const { createExpense, editExpense, deleteExpense } = useExpensesOperations(
    expenses,
    setExpenses
  );

  // Income operations hook
  const { createIncome, editIncome, deleteIncome } = useIncomeOperations(
    incomes,
    setIncomes
  );

  // Partner-specific income data
  const { pascalIncomes, caroIncomes, pascalTotal, caroTotal } =
    usePartnerIncomes(incomes);

  // Form state hooks
  const {
    showAddExpense,
    editingExpense,
    expenseForm,
    resetForm: resetExpenseForm,
    startAddExpense,
    startEditExpense,
    updateForm: updateExpenseForm,
    isFormValid: isExpenseFormValid,
  } = useExpenseForm();

  const {
    showAddIncome,
    editingIncome,
    incomeForm,
    resetForm: resetIncomeForm,
    startAddIncome,
    startEditIncome,
    updateForm: updateIncomeForm,
  } = useIncomeForm();

  // Private expenses state
  const [privateExpenses, setPrivateExpenses] = useState<PrivateExpense[]>([]);

  // Private expense operations
  const { createPrivateExpense, editPrivateExpense, deletePrivateExpense } =
    usePrivateExpenseOperations(privateExpenses, setPrivateExpenses);

  // Private expense form management
  const {
    privateExpenseForm,
    updatePrivateExpenseForm,
    resetPrivateExpenseForm,
    isPrivateExpenseFormValid,
  } = usePrivateExpenseForm();

  // Private expense UI state
  const [showAddPrivateExpense, setShowAddPrivateExpense] = useState(false);
  const [editingPrivateExpense, setEditingPrivateExpense] =
    useState<PrivateExpense | null>(null);

  // Tab navigation state
  const [activeTab, setActiveTab] = useState('gemeinsam');
  const [privateExpensesExpanded, setPrivateExpensesExpanded] = useState(false);
  // Month selector state (format YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  // Helpers to change month
  const setMonthFromDate = (d: Date) =>
    setSelectedMonth(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    );

  const prevMonth = () => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const d = new Date(y, m - 1 - 1, 1);
    setMonthFromDate(d);
  };

  const nextMonth = () => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const d = new Date(y, m - 1 + 1, 1);
    setMonthFromDate(d);
  };

  const [selY, selM] = selectedMonth.split('-').map(Number);
  const selectedMonthLabel = new Date(selY, selM - 1).toLocaleString('de-DE', {
    month: 'long',
    year: 'numeric',
  });
  // Month navigator uses a single pill-style UI

  // Modal state for confirmations
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDestructive: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isDestructive: false,
  });

  // UI state is now managed by individual components

  // Financial calculations
  const results = useFinancialCalculations(
    settings,
    expenses,
    incomes,
    privateExpenses
  );

  // Load data on component mount (only once)
  useEffect(() => {
    const loadAllData = async () => {
      try {
        await loadData();
        // Load private expenses
        const expenses = await ApiService.getPrivateExpenses();
        setPrivateExpenses(expenses);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsDataLoaded(true);
      }
    };

    loadAllData();
  }, [loadData]);

  // Event handlers
  const handleSettingsChange = (
    field: keyof typeof settings,
    value: string
  ) => {
    const numericValue = parseNumber(value);
    updateSettings({ [field]: numericValue });
  };

  const handleSettingsBlur = async () => {
    try {
      await saveSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleNavigateToPrivateExpenses = () => {
    setActiveTab('privat');
    setPrivateExpensesExpanded(true); // Auto-expand the private expenses section
  };

  const handleSaveExpense = async () => {
    if (!validateExpenseForm(expenseForm)) return;

    try {
      if (editingExpense) {
        await editExpense(editingExpense.id, expenseForm);
      } else {
        await createExpense(expenseForm);
      }
      resetExpenseForm();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleDeleteExpense = async (expenseId: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Ausgabe löschen',
      message: 'Möchten Sie diese Ausgabe wirklich löschen?',
      onConfirm: async () => {
        try {
          await deleteExpense(expenseId);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error deleting expense:', error);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
      isDestructive: true,
    });
  };

  // Income handlers
  const handleSaveIncome = async () => {
    if (!validateIncomeForm(incomeForm)) return;

    try {
      if (editingIncome) {
        await editIncome(editingIncome.id, incomeForm);
      } else {
        await createIncome(incomeForm);
      }
      resetIncomeForm();
    } catch (error) {
      console.error('Error saving income:', error);
    }
  };

  const handleDeleteIncome = async (incomeId: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Einkommensposition löschen',
      message: 'Möchten Sie diese Einkommensposition wirklich löschen?',
      onConfirm: async () => {
        try {
          await deleteIncome(incomeId);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error deleting income:', error);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
      isDestructive: true,
    });
  };

  // Show loading skeleton while data is being fetched
  if (!isDataLoaded) {
    return (
      <div className='min-h-screen bg-gray-50 p-6'>
        <div className='max-w-4xl mx-auto'>
          {/* Month selector (skeleton) */}
          <div className='mb-6 flex items-center justify-center gap-3'>
            <button
              disabled
              aria-label='Vorheriger Monat'
              className='p-2 rounded-lg bg-white/20 text-white disabled:opacity-50'
            >
              <svg className='w-5 h-5' viewBox='0 0 20 20' fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M12.293 16.293a1 1 0 010-1.414L15.586 11H5a1 1 0 110-2h10.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
            <div className='px-4 py-2 bg-white rounded-lg text-gray-700 font-medium'>
              {selectedMonthLabel}
            </div>
            <button
              disabled
              aria-label='Nächster Monat'
              className='p-2 rounded-lg bg-white/20 text-white disabled:opacity-50'
            >
              <svg className='w-5 h-5' viewBox='0 0 20 20' fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M7.707 3.707a1 1 0 010 1.414L4.414 9H15a1 1 0 110 2H4.414l3.293 3.293a1 1 0 11-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </div>

          {/* Loading Skeleton */}
          <div className='space-y-6'>
            {/* Settings Skeleton */}
            <div className='bg-white rounded-lg shadow-md p-6 animate-pulse'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='h-6 w-6 bg-gray-200 rounded'></div>
                <div className='h-6 bg-gray-200 rounded w-32'></div>
              </div>
              <div className='h-4 bg-gray-200 rounded w-48'></div>
            </div>

            {/* Summary Cards Skeleton */}
            <div className='bg-linear-to-r from-blue-500 to-green-500 text-white rounded-lg shadow-lg p-6 animate-pulse'>
              <div className='h-6 bg-white/20 rounded w-64 mb-4 mx-auto'></div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='text-center p-4 bg-white/20 rounded-lg'>
                  <div className='h-4 bg-white/30 rounded w-32 mb-2 mx-auto'></div>
                  <div className='h-8 bg-white/30 rounded w-24 mb-1 mx-auto'></div>
                  <div className='h-3 bg-white/30 rounded w-20 mx-auto'></div>
                </div>
                <div className='text-center p-4 bg-white/20 rounded-lg'>
                  <div className='h-4 bg-white/30 rounded w-32 mb-2 mx-auto'></div>
                  <div className='h-8 bg-white/30 rounded w-24 mb-1 mx-auto'></div>
                  <div className='h-3 bg-white/30 rounded w-20 mx-auto'></div>
                </div>
              </div>
            </div>

            {/* Available Amounts Skeleton */}
            <div className='bg-white rounded-lg shadow-md p-6 animate-pulse'>
              <div className='h-6 bg-gray-200 rounded w-48 mb-4'></div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='text-center p-6 bg-blue-50 rounded-lg border-2 border-blue-200'>
                  <div className='h-4 bg-blue-200 rounded w-24 mb-2 mx-auto'></div>
                  <div className='h-8 bg-blue-200 rounded w-20 mb-2 mx-auto'></div>
                  <div className='h-3 bg-blue-200 rounded w-32 mx-auto'></div>
                </div>
                <div className='text-center p-6 bg-green-50 rounded-lg border-2 border-green-200'>
                  <div className='h-4 bg-green-200 rounded w-24 mb-2 mx-auto'></div>
                  <div className='h-8 bg-green-200 rounded w-20 mb-2 mx-auto'></div>
                  <div className='h-3 bg-green-200 rounded w-32 mx-auto'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-4xl mx-auto'>
        {/* Pill-style month selector (extracted to component) */}
        <MonthNav
          label={selectedMonthLabel}
          onPrev={prevMonth}
          onNext={nextMonth}
        />

        {/* Tabbed Interface */}
        <TabLayout
          activeTab={activeTab}
          onTabChange={setActiveTab}
          gemeinsam={
            <>
              {/* Settings Section with Income Management */}
              <Settings
                settings={settings}
                onSettingsChange={handleSettingsChange}
                onSettingsBlur={handleSettingsBlur}
                pascalTotal={pascalTotal}
                caroTotal={caroTotal}
                pascalIncomes={pascalIncomes}
                caroIncomes={caroIncomes}
                gesamteinkommen={results.gesamteinkommen}
              >
                <IncomeManagement
                  incomes={incomes}
                  editingIncome={editingIncome}
                  showAddIncome={showAddIncome}
                  incomeForm={incomeForm}
                  onStartAddIncome={startAddIncome}
                  onStartEditIncome={startEditIncome}
                  onUpdateIncomeForm={updateIncomeForm}
                  onSaveIncome={handleSaveIncome}
                  onResetIncomeForm={resetIncomeForm}
                  onDeleteIncome={handleDeleteIncome}
                />
              </Settings>

              {/* Summary - Action and Free Money */}
              <Summary
                results={results}
                settings={settings}
                selectedMonth={selectedMonth}
                onNavigateToPrivateExpenses={handleNavigateToPrivateExpenses}
              />

              {/* Expense Management */}
              <ExpenseManagement
                expenses={expenses}
                settings={settings}
                showAddExpense={showAddExpense}
                editingExpense={editingExpense}
                expenseForm={expenseForm}
                onStartAddExpense={startAddExpense}
                onStartEditExpense={startEditExpense}
                onUpdateExpenseForm={updateExpenseForm}
                onSaveExpense={handleSaveExpense}
                onResetExpenseForm={resetExpenseForm}
                onDeleteExpense={handleDeleteExpense}
                isExpenseFormValid={isExpenseFormValid}
              />
            </>
          }
          privat={
            <PrivateExpenses
              pascalExpenses={privateExpenses.filter(
                (exp) => exp.person === 'Partner1'
              )}
              caroExpenses={privateExpenses.filter(
                (exp) => exp.person === 'Partner2'
              )}
              pascalTotal={privateExpenses
                .filter((exp) => exp.person === 'Partner1')
                .reduce((sum, exp) => sum + exp.betrag, 0)}
              caroTotal={privateExpenses
                .filter((exp) => exp.person === 'Partner2')
                .reduce((sum, exp) => sum + exp.betrag, 0)}
              showAddPrivateExpense={showAddPrivateExpense}
              editingPrivateExpense={editingPrivateExpense}
              privateExpenseForm={privateExpenseForm}
              isExpanded={privateExpensesExpanded}
              setIsExpanded={setPrivateExpensesExpanded}
              onStartAddPrivateExpense={() => setShowAddPrivateExpense(true)}
              onStartEditPrivateExpense={(expense) => {
                setEditingPrivateExpense(expense);
                updatePrivateExpenseForm('beschreibung', expense.beschreibung);
                updatePrivateExpenseForm('betrag', expense.betrag.toString());
                updatePrivateExpenseForm('person', expense.person);
                setShowAddPrivateExpense(true);
              }}
              onUpdatePrivateExpenseForm={updatePrivateExpenseForm}
              onSavePrivateExpense={async () => {
                try {
                  const expenseData = {
                    beschreibung: privateExpenseForm.beschreibung,
                    betrag: parseFloat(privateExpenseForm.betrag),
                    person: privateExpenseForm.person,
                  };

                  if (editingPrivateExpense) {
                    await editPrivateExpense(
                      editingPrivateExpense.id,
                      expenseData
                    );
                    setEditingPrivateExpense(null);
                  } else {
                    await createPrivateExpense(expenseData);
                    setShowAddPrivateExpense(false);
                  }
                  resetPrivateExpenseForm();
                } catch (error) {
                  console.error('Error saving private expense:', error);
                }
              }}
              onResetPrivateExpenseForm={() => {
                resetPrivateExpenseForm();
                setShowAddPrivateExpense(false);
                setEditingPrivateExpense(null);
              }}
              onDeletePrivateExpense={async (id) => {
                setConfirmModal({
                  isOpen: true,
                  title: 'Privaten Ausgabe löschen',
                  message:
                    'Sind Sie sicher, dass Sie diese private Ausgabe löschen möchten?',
                  onConfirm: async () => {
                    try {
                      await deletePrivateExpense(id);
                      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                    } catch (error) {
                      console.error('Error deleting private expense:', error);
                    }
                  },
                  isDestructive: true,
                });
              }}
              isPrivateExpenseFormValid={isPrivateExpenseFormValid}
            />
          }
        />

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() =>
            setConfirmModal((prev) => ({ ...prev, isOpen: false }))
          }
          confirmText='Löschen'
          cancelText='Abbrechen'
          isDestructive={confirmModal.isDestructive}
        />
      </div>
    </div>
  );
}
