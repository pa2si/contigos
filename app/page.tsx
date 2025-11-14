'use client';

import { useHomePage } from '@/hooks';

// Import our new components
import Settings from '@/components/Settings';
import IncomeManagement from '@/components/IncomeManagement';

import Summary from '@/components/Summary';
import MonthNav from '@/components/MonthNav';
import ExpenseManagement from '@/components/ExpenseManagement';
import ConfirmationModal from '@/components/ConfirmationModal';
import TabLayout from '@/components/TabLayout';
import PrivateExpenses from '@/components/PrivateExpenses';
import PageSkeleton from '@/components/PageSkeleton';

export default function HomePage() {
  const {
    isDataLoaded,
    settings,
    expenses,
    incomes,
    pascalIncomes,
    caroIncomes,
    pascalTotal,
    caroTotal,
    showAddExpense,
    editingExpense,
    expenseForm,
    resetExpenseForm,
    startAddExpense,
    startEditExpense,
    updateExpenseForm,
    isExpenseFormValid,
    showAddIncome,
    editingIncome,
    incomeForm,
    resetIncomeForm,
    startAddIncome,
    startEditIncome,
    updateIncomeForm,
    privateExpenses,
    createPrivateExpense,
    editPrivateExpense,
    deletePrivateExpense,
    privateExpenseForm,
    updatePrivateExpenseForm,
    resetPrivateExpenseForm,
    isPrivateExpenseFormValid,
    showAddPrivateExpense,
    setShowAddPrivateExpense,
    editingPrivateExpense,
    setEditingPrivateExpense,
    activeTab,
    setActiveTab,
    privateExpensesExpanded,
    setPrivateExpensesExpanded,
    prevMonth,
    nextMonth,
    selectedMonth,
    selectedMonthLabel,
    confirmModal,
    setConfirmModal,
    results,
    handleSettingsChange,
    handleSettingsBlur,
    handleNavigateToPrivateExpenses,
    handleSaveExpense,
    handleDeleteExpense,
    handleSaveIncome,
    handleDeleteIncome,
  } = useHomePage();

  // Show loading skeleton while data is being fetched
  if (!isDataLoaded) {
    return <PageSkeleton selectedMonthLabel={selectedMonthLabel} />;
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
