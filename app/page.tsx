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
import ControlSection from '@/components/ControlSection';
import Summary from '@/components/Summary';
import ExpenseManagement from '@/components/ExpenseManagement';
import ConfirmationModal from '@/components/ConfirmationModal';
import TabLayout from '@/components/TabLayout';
import PrivateExpenses from '@/components/PrivateExpenses';

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
    loadData();
    // Load private expenses
    const loadPrivateExpenses = async () => {
      try {
        const expenses = await ApiService.getPrivateExpenses();
        setPrivateExpenses(expenses);
      } catch (error) {
        console.error('Error loading private expenses:', error);
      }
    };
    loadPrivateExpenses();
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

        {/* Tabbed Interface */}
        <TabLayout
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
              onStartAddPrivateExpense={() => setShowAddPrivateExpense(true)}
              onStartEditPrivateExpense={setEditingPrivateExpense}
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
