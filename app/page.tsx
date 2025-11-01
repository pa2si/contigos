'use client';

import { useEffect } from 'react';
import {
  useSettingsOperations,
  useExpensesOperations,
  useExpenseForm,
  useIncomeOperations,
  useIncomeForm,
  useAppData,
  useFinancialCalculations,
  usePartnerIncomes,
} from '@/hooks';
import {
  parseNumber,
  validateExpenseForm,
  validateIncomeForm,
  confirmExpenseDeletion,
  confirmIncomeDeletion,
} from '@/lib/utils';

// Import our new components
import Settings from '@/components/Settings';
import IncomeManagement from '@/components/IncomeManagement';
import ControlSection from '@/components/ControlSection';
import Summary from '@/components/Summary';
import ExpenseManagement from '@/components/ExpenseManagement';

export default function HomePage() {
  // Combined data management hook (prevents infinite loops)
  const {
    settings,
    setSettings,
    expenses,
    setExpenses,
    incomes,
    setIncomes,
    loading,
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
    isFormValid: isIncomeFormValid,
  } = useIncomeForm();

  // UI state is now managed by individual components

  // Financial calculations
  const results = useFinancialCalculations(settings, expenses, incomes);

  // Load data on component mount (only once)
  useEffect(() => {
    loadData();
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
    if (!confirmExpenseDeletion()) return;

    try {
      await deleteExpense(expenseId);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
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
    if (!confirmIncomeDeletion()) return;

    try {
      await deleteIncome(incomeId);
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-xl'>Loading Contigos...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>Contigos</h1>
          <p className='text-gray-600'>
            Calculacion de gastos compartidos mensuales
          </p>
        </div>

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
            pascalIncomes={pascalIncomes}
            caroIncomes={caroIncomes}
            pascalTotal={pascalTotal}
            caroTotal={caroTotal}
            showAddIncome={showAddIncome}
            editingIncome={editingIncome}
            incomeForm={incomeForm}
            onStartAddIncome={startAddIncome}
            onStartEditIncome={startEditIncome}
            onUpdateIncomeForm={updateIncomeForm}
            onSaveIncome={handleSaveIncome}
            onResetIncomeForm={resetIncomeForm}
            onDeleteIncome={handleDeleteIncome}
            isIncomeFormValid={isIncomeFormValid}
          />
        </Settings>

        {/* Summary - Action and Free Money */}
        <Summary results={results} />

        {/* Control Section */}
        <ControlSection settings={settings} results={results} />

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
      </div>
    </div>
  );
}
