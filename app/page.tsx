'use client';

import { useEffect, useState } from 'react';
import { Payer, IncomeSource } from '@/types';
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
  getPayerDisplayName,
  formatCurrency,
  formatCurrencyFixed,
  formatPercentage,
  parseNumber,
  validateExpenseForm,
  validateIncomeForm,
  confirmExpenseDeletion,
  confirmIncomeDeletion,
} from '@/lib/utils';
import { isControlCalculationValid } from '@/lib/calculations';

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

  // UI state
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [incomesExpanded, setIncomesExpanded] = useState(true); // Start expanded by default
  const [controlExpanded, setControlExpanded] = useState(true); // Control section expanded by default
  const [expensesExpanded, setExpensesExpanded] = useState(true); // Expenses section expanded by default

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

  const controlIsValid = isControlCalculationValid(results);

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

        {/* Settings Section - Collapsible */}
        <div className='bg-white rounded-lg shadow-md mb-6'>
          {/* Settings Header - Always Visible */}
          <div
            className='p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center'
            onClick={() => setSettingsExpanded(!settingsExpanded)}
          >
            <div>
              <div className='flex items-center gap-3'>
                <h2 className='text-2xl font-semibold'>⚙️ Einstellungen</h2>
                <span
                  className={`transform transition-transform duration-200 ${
                    settingsExpanded ? 'rotate-180' : ''
                  }`}
                >
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </div>
              <div className='mt-2 text-lg font-medium text-blue-700'>
                Gemeinsames Einkommen:{' '}
                <span className='font-bold'>
                  {formatCurrency(results.gesamteinkommen)}
                </span>
              </div>
            </div>
            <div className='text-sm text-gray-500'>
              {settingsExpanded
                ? 'Klicken zum Schließen'
                : 'Klicken zum Öffnen'}
            </div>
          </div>

          {/* Collapsible Settings Content */}
          {settingsExpanded && (
            <div className='px-6 pb-6 border-t border-gray-100 animate-in slide-in-from-top duration-200'>
              <div className='pt-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Pascal Einkommen (€)
                  </label>
                  <div className='w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700 font-medium'>
                    {formatCurrency(pascalTotal)}
                  </div>
                  <p className='text-xs text-gray-500 mt-1'>
                    Berechnet aus {pascalIncomes.length} Einkommensposition
                    {pascalIncomes.length !== 1 ? 'en' : ''}
                  </p>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Caro Einkommen (€)
                  </label>
                  <div className='w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700 font-medium'>
                    {formatCurrency(caroTotal)}
                  </div>
                  <p className='text-xs text-gray-500 mt-1'>
                    Berechnet aus {caroIncomes.length} Einkommensposition
                    {caroIncomes.length !== 1 ? 'en' : ''}
                  </p>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Rest vom Vormonat (€)
                  </label>
                  <input
                    type='number'
                    value={settings.restgeld_vormonat}
                    onChange={(e) =>
                      handleSettingsChange('restgeld_vormonat', e.target.value)
                    }
                    onBlur={handleSettingsBlur}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Comida (Lebensmittel, €)
                  </label>
                  <input
                    type='number'
                    value={settings.comida_betrag}
                    onChange={(e) =>
                      handleSettingsChange('comida_betrag', e.target.value)
                    }
                    onBlur={handleSettingsBlur}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Ahorros (Sparen, €)
                  </label>
                  <input
                    type='number'
                    value={settings.ahorros_betrag}
                    onChange={(e) =>
                      handleSettingsChange('ahorros_betrag', e.target.value)
                    }
                    onBlur={handleSettingsBlur}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>

              {/* Income Management Section */}
              <div className='mt-8 pt-6 border-t border-gray-200'>
                <div
                  className='cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center mb-4 p-2 rounded-lg'
                  onClick={() => setIncomesExpanded(!incomesExpanded)}
                >
                  <div className='flex items-center gap-3'>
                    <h3 className='text-lg font-semibold text-gray-800'>
                      💰 Einkommensquellen
                    </h3>
                    <span
                      className={`transform transition-transform duration-200 ${
                        incomesExpanded ? 'rotate-180' : ''
                      }`}
                    >
                      <svg
                        className='w-4 h-4'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </span>
                  </div>
                  {incomesExpanded && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent collapsing when clicking the button
                        startAddIncome();
                      }}
                      className='px-3 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors'
                    >
                      + Einkommen hinzufügen
                    </button>
                  )}
                </div>

                {/* Add/Edit Income Form */}
                {showAddIncome && (
                  <div className='mb-4 p-3 border-2 border-green-200 rounded-lg bg-green-50'>
                    <h4 className='text-md font-medium mb-3'>
                      {editingIncome
                        ? 'Einkommen bearbeiten'
                        : 'Neues Einkommen hinzufügen'}
                    </h4>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Beschreibung
                        </label>
                        <input
                          type='text'
                          value={incomeForm.beschreibung}
                          onChange={(e) =>
                            updateIncomeForm('beschreibung', e.target.value)
                          }
                          placeholder='z.B. Gehalt, Freelancing, etc.'
                          className='w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Betrag (€)
                        </label>
                        <input
                          type='number'
                          step='0.01'
                          value={incomeForm.betrag}
                          onChange={(e) =>
                            updateIncomeForm('betrag', e.target.value)
                          }
                          placeholder='0.00'
                          className='w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Quelle
                        </label>
                        <select
                          value={incomeForm.quelle}
                          onChange={(e) =>
                            updateIncomeForm(
                              'quelle',
                              e.target.value as IncomeSource
                            )
                          }
                          className='w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm'
                        >
                          <option value='Partner1'>Pascal</option>
                          <option value='Partner2'>Caro</option>
                        </select>
                      </div>
                    </div>
                    <div className='flex gap-2 mt-3'>
                      <button
                        onClick={handleSaveIncome}
                        disabled={!isIncomeFormValid()}
                        className='px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
                      >
                        {editingIncome ? 'Speichern' : 'Hinzufügen'}
                      </button>
                      <button
                        onClick={resetIncomeForm}
                        className='px-3 py-1.5 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors'
                      >
                        Abbrechen
                      </button>
                    </div>
                  </div>
                )}

                {/* Collapsible Income Content */}
                {incomesExpanded && (
                  <div className='animate-in slide-in-from-top duration-200'>
                    {/* Income List */}
                    <div className='space-y-2'>
                      <>
                        {/* Pascal's Income */}
                        <div className='bg-blue-50 p-3 rounded-lg'>
                          <h4 className='font-medium text-blue-800 mb-2'>
                            Pascal Einkommen
                          </h4>
                          {pascalIncomes.length === 0 ? (
                            <p className='text-sm text-blue-600 italic py-2'>
                              Keine Einkommensquellen erfasst
                            </p>
                          ) : (
                            pascalIncomes.map((income) => (
                              <div
                                key={income.id}
                                className='flex justify-between items-center py-1 px-2 bg-white rounded mb-1 last:mb-0'
                              >
                                <div className='flex-1'>
                                  <span className='text-sm font-medium'>
                                    {income.beschreibung}
                                  </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                  <span className='text-sm font-semibold text-blue-600'>
                                    {formatCurrencyFixed(income.betrag)}
                                  </span>
                                  <button
                                    onClick={() => startEditIncome(income)}
                                    className='px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteIncome(income.id)
                                    }
                                    className='px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors'
                                  >
                                    Del
                                  </button>
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

                        {/* Caro's Income */}
                        <div className='bg-green-50 p-3 rounded-lg'>
                          <h4 className='font-medium text-green-800 mb-2'>
                            Caro Einkommen
                          </h4>
                          {caroIncomes.length === 0 ? (
                            <p className='text-sm text-green-600 italic py-2'>
                              Keine Einkommensquellen erfasst
                            </p>
                          ) : (
                            caroIncomes.map((income) => (
                              <div
                                key={income.id}
                                className='flex justify-between items-center py-1 px-2 bg-white rounded mb-1 last:mb-0'
                              >
                                <div className='flex-1'>
                                  <span className='text-sm font-medium'>
                                    {income.beschreibung}
                                  </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                  <span className='text-sm font-semibold text-green-600'>
                                    {formatCurrencyFixed(income.betrag)}
                                  </span>
                                  <button
                                    onClick={() => startEditIncome(income)}
                                    className='px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors'
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteIncome(income.id)
                                    }
                                    className='px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors'
                                  >
                                    Del
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                          <div className='text-right mt-2 pt-2 border-t border-green-200'>
                            <span className='text-sm font-bold text-green-700'>
                              Gesamt: {formatCurrencyFixed(caroTotal)}
                            </span>
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* CARD 1: ACTION (Highlighted) */}
        <div className='bg-linear-to-r from-blue-500 to-green-500 text-white rounded-lg shadow-lg p-6 mb-6'>
          <h2 className='text-2xl font-bold mb-4 text-center'>
            🏦 AKTION - Überweisungen auf Gemeinschaftskonto
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='text-center p-4 bg-white/20 rounded-lg backdrop-blur'>
              <h3 className='font-semibold text-lg mb-2'>
                Pascal überweist auf GK:
              </h3>
              <div className='text-4xl font-bold mb-1'>
                {formatCurrencyFixed(results.finale_überweisung_p1)}
              </div>
              <div className='text-sm opacity-90'>
                ({formatPercentage(results.p1_anteil_prozent)} Anteil)
              </div>
            </div>
            <div className='text-center p-4 bg-white/20 rounded-lg backdrop-blur'>
              <h3 className='font-semibold text-lg mb-2'>
                Caro überweist auf GK:
              </h3>
              <div className='text-4xl font-bold mb-1'>
                {formatCurrencyFixed(results.finale_überweisung_p2)}
              </div>
              <div className='text-sm opacity-90'>
                ({formatPercentage(results.p2_anteil_prozent)} Anteil)
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: CONTROL GK */}
        <div className='bg-white rounded-lg shadow-md mb-6'>
          {/* Control Header - Clickable */}
          <div
            className='p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center'
            onClick={() => setControlExpanded(!controlExpanded)}
          >
            <div className='flex items-center gap-3'>
              <h2 className='text-2xl font-semibold text-gray-800'>
                📊 KONTROLLE GEMEINSCHAFTSKONTO
              </h2>
              <span
                className={`transform transition-transform duration-200 ${
                  controlExpanded ? 'rotate-180' : ''
                }`}
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* Collapsible Control Content */}
          {controlExpanded && (
            <div className='px-6 pb-6 border-t border-gray-100 animate-in slide-in-from-top duration-200'>
              <div className='pt-4 space-y-3'>
                <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                  <span className='font-medium'>
                    Bedarf Gemeinschaftskonto:
                  </span>
                  <span className='font-bold text-lg'>
                    {formatCurrencyFixed(results.bedarf_gk)}
                  </span>
                </div>
                <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                  <span className='font-medium'>- Restgeld Vormonat:</span>
                  <span className='font-bold text-lg'>
                    {formatCurrencyFixed(settings.restgeld_vormonat)}
                  </span>
                </div>
                <div className='flex justify-between items-center py-2 bg-yellow-50 px-4 rounded border-l-4 border-yellow-400'>
                  <span className='font-semibold'>
                    = Benötigte neue Einzahlung:
                  </span>
                  <span className='font-bold text-xl text-yellow-700'>
                    {formatCurrencyFixed(results.kontrolle_einzahlungNötig)}
                  </span>
                </div>
                <div
                  className={`flex justify-between items-center py-2 px-4 rounded border-l-4 
                ${
                  controlIsValid
                    ? 'bg-green-50 border-green-400'
                    : 'bg-red-50 border-red-400'
                }`}
                >
                  <span className='font-semibold'>
                    Summe der Überweisungen:
                  </span>
                  <span
                    className={`font-bold text-xl 
                  ${controlIsValid ? 'text-green-700' : 'text-red-700'}`}
                  >
                    {formatCurrencyFixed(results.kontrolle_summeÜberweisungen)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CARD 3: SUMMARY */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>
            💰 ZUSAMMENFASSUNG - Freie Verfügung
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='text-center p-6 bg-blue-50 rounded-lg border-2 border-blue-200'>
              <h3 className='font-semibold text-lg mb-2 text-blue-800'>
                Verbleibt Pascal:
              </h3>
              <div className='text-4xl font-bold text-blue-600 mb-2'>
                {formatCurrencyFixed(results.verbleibt_p1)}
              </div>
              <div className='text-sm text-blue-600'>zur freien Verfügung</div>
            </div>
            <div className='text-center p-6 bg-green-50 rounded-lg border-2 border-green-200'>
              <h3 className='font-semibold text-lg mb-2 text-green-800'>
                Verbleibt Caro:
              </h3>
              <div className='text-4xl font-bold text-green-600 mb-2'>
                {formatCurrencyFixed(results.verbleibt_p2)}
              </div>
              <div className='text-sm text-green-600'>zur freien Verfügung</div>
            </div>
          </div>
        </div>

        {/* Expenses Section */}
        <div className='bg-white rounded-lg shadow-md'>
          {/* Expenses Header - Clickable */}
          <div
            className='p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center'
            onClick={() => setExpensesExpanded(!expensesExpanded)}
          >
            <div className='flex items-center gap-3'>
              <h2 className='text-2xl font-semibold'>🛒 Ausgaben</h2>
              <span
                className={`transform transition-transform duration-200 ${
                  expensesExpanded ? 'rotate-180' : ''
                }`}
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              </span>
            </div>
            {expensesExpanded && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent collapsing when clicking the button
                  startAddExpense();
                }}
                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
              >
                Ausgabe hinzufügen
              </button>
            )}
          </div>

          {/* Collapsible Expenses Content */}
          {expensesExpanded && (
            <div className='px-6 pb-6 border-t border-gray-100 animate-in slide-in-from-top duration-200'>
              <div className='pt-4'>
                {/* Fixed Comida and Ahorros display */}
                <div className='mb-4'>
                  <div className='flex items-center justify-between py-2 pl-4 rounded-lg shadow-sm bg-white mb-2 border border-gray-300'>
                    <div className='flex-1'>
                      <span className='font-medium'>Comida (Lebensmittel)</span>
                      <span className='ml-2 text-gray-500'>
                        (fix aus Einstellungen)
                      </span>
                    </div>
                    <span className='font-bold text-lg mr-4'>
                      {formatCurrency(settings.comida_betrag)}
                    </span>
                    <div className='flex gap-2 invisible'>
                      <button className='px-2 py-1 text-xs'>Bearbeiten</button>
                      <button className='px-2 py-1 text-xs'>Löschen</button>
                    </div>
                  </div>

                  <div className='flex items-center justify-between py-2 pl-4 rounded-lg shadow-sm bg-white mb-2 border border-gray-300'>
                    <div className='flex-1'>
                      <span className='font-medium'>Ahorros (Sparen)</span>
                      <span className='ml-2 text-gray-500'>
                        (fix aus Einstellungen)
                      </span>
                    </div>
                    <span className='font-bold text-lg mr-4'>
                      {formatCurrency(settings.ahorros_betrag)}
                    </span>
                    <div className='flex gap-2 invisible'>
                      <button className='px-2 py-1 text-xs'>Bearbeiten</button>
                      <button className='px-2 py-1 text-xs'>Löschen</button>
                    </div>
                  </div>
                </div>

                {/* Add/Edit Expense Form */}
                {showAddExpense && (
                  <div className='mb-6 p-4 border-2 border-blue-200 rounded-lg bg-blue-50'>
                    <h3 className='text-lg font-semibold mb-4'>
                      {editingExpense
                        ? 'Ausgabe bearbeiten'
                        : 'Neue Ausgabe hinzufügen'}
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Beschreibung
                        </label>
                        <input
                          type='text'
                          value={expenseForm.beschreibung}
                          onChange={(e) =>
                            updateExpenseForm('beschreibung', e.target.value)
                          }
                          placeholder='z.B. Einkauf, Miete, etc.'
                          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Betrag (€)
                        </label>
                        <input
                          type='number'
                          step='0.01'
                          value={expenseForm.betrag}
                          onChange={(e) =>
                            updateExpenseForm('betrag', e.target.value)
                          }
                          placeholder='0.00'
                          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Bezahlt von
                        </label>
                        <select
                          value={expenseForm.bezahlt_von}
                          onChange={(e) =>
                            updateExpenseForm(
                              'bezahlt_von',
                              e.target.value as Payer
                            )
                          }
                          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                          <option value='Partner1'>Pascal</option>
                          <option value='Partner2'>Caro</option>
                          <option value='Gemeinschaftskonto'>
                            Gemeinschaftskonto
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className='flex gap-2 mt-4'>
                      <button
                        onClick={handleSaveExpense}
                        disabled={!isExpenseFormValid()}
                        className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
                      >
                        {editingExpense ? 'Speichern' : 'Hinzufügen'}
                      </button>
                      <button
                        onClick={resetExpenseForm}
                        className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors'
                      >
                        Abbrechen
                      </button>
                    </div>
                  </div>
                )}

                {/* Dynamic Expenses List */}
                {expenses.length === 0 ? (
                  <div className='text-center py-8 text-gray-500'>
                    <p>Noch keine dynamischen Ausgaben erfasst.</p>
                    <p className='text-sm'>Füge deine erste Ausgabe hinzu!</p>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {expenses.map((expense) => (
                      <div
                        key={expense.id}
                        className='flex justify-between items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50'
                      >
                        <div className='flex-1'>
                          <span className='font-medium'>
                            {expense.beschreibung}
                          </span>
                          <span className='text-sm text-gray-500 ml-2'>
                            (bezahlt von{' '}
                            {getPayerDisplayName(expense.bezahlt_von)})
                          </span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <span className='font-semibold text-lg'>
                            {formatCurrencyFixed(expense.betrag)}
                          </span>
                          <div className='flex gap-1'>
                            <button
                              onClick={() => startEditExpense(expense)}
                              className='px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
                            >
                              Bearbeiten
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
                              className='px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors'
                            >
                              Löschen
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
