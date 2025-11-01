'use client';

import { useEffect } from 'react';
import { Payer } from '@/types';
import { 
  useSettingsOperations, 
  useExpensesOperations, 
  useExpenseForm, 
  useAppData, 
  useFinancialCalculations 
} from '@/hooks';
import { 
  getPayerDisplayName, 
  formatCurrency, 
  formatCurrencyFixed, 
  formatPercentage, 
  parseNumber, 
  validateExpenseForm,
  confirmExpenseDeletion 
} from '@/lib/utils';
import { isControlCalculationValid } from '@/lib/calculations';

export default function HomePage() {
  // Combined data management hook (prevents infinite loops)
  const { settings, setSettings, expenses, setExpenses, loading, loadData } = useAppData();
  
  // Settings operations hook
  const { updateSettings, saveSettings } = useSettingsOperations(settings, setSettings);
  
  // Expenses operations hook
  const { createExpense, editExpense, deleteExpense } = useExpensesOperations(expenses, setExpenses);
  
  // Form state hook
  const { 
    showAddExpense, 
    editingExpense, 
    expenseForm, 
    resetForm, 
    startAddExpense, 
    startEditExpense, 
    updateForm, 
    isFormValid 
  } = useExpenseForm();

  // Financial calculations
  const results = useFinancialCalculations(settings, expenses);

  // Load data on component mount (only once)
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Event handlers
  const handleSettingsChange = (field: keyof typeof settings, value: string) => {
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
      resetForm();
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

        {/* Settings Section */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <div className='mb-4'>
            <h2 className='text-2xl font-semibold'>Einstellungen</h2>
            <div className='mt-2 text-lg font-medium text-blue-700'>
              Gemeinsames Einkommen:{' '}
              <span className='font-bold'>
                {formatCurrency(results.gesamteinkommen)}
              </span>
            </div>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Pascal Einkommen (€)
              </label>
              <input
                type='number'
                value={settings.p1_einkommen}
                onChange={(e) => handleSettingsChange('p1_einkommen', e.target.value)}
                onBlur={handleSettingsBlur}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Caro Einkommen (€)
              </label>
              <input
                type='number'
                value={settings.p2_einkommen}
                onChange={(e) => handleSettingsChange('p2_einkommen', e.target.value)}
                onBlur={handleSettingsBlur}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Rest vom Vormonat (€)
              </label>
              <input
                type='number'
                value={settings.restgeld_vormonat}
                onChange={(e) => handleSettingsChange('restgeld_vormonat', e.target.value)}
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
                onChange={(e) => handleSettingsChange('comida_betrag', e.target.value)}
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
                onChange={(e) => handleSettingsChange('ahorros_betrag', e.target.value)}
                onBlur={handleSettingsBlur}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>
        </div>

        {/* CARD 1: ACTION (Highlighted) */}
        <div className='bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg shadow-lg p-6 mb-6'>
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
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>
            📊 KONTROLLE GEMEINSCHAFTSKONTO
          </h2>
          <div className='space-y-3'>
            <div className='flex justify-between items-center py-2 border-b border-gray-200'>
              <span className='font-medium'>Bedarf Gemeinschaftskonto:</span>
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
                ${controlIsValid ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}
            >
              <span className='font-semibold'>Summe der Überweisungen:</span>
              <span
                className={`font-bold text-xl 
                  ${controlIsValid ? 'text-green-700' : 'text-red-700'}`}
              >
                {formatCurrencyFixed(results.kontrolle_summeÜberweisungen)}
              </span>
            </div>
          </div>
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
        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-semibold'>Ausgaben</h2>
            <button
              onClick={startAddExpense}
              className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
            >
              Ausgabe hinzufügen
            </button>
          </div>

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
                    onChange={(e) => updateForm('beschreibung', e.target.value)}
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
                    onChange={(e) => updateForm('betrag', e.target.value)}
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
                    onChange={(e) => updateForm('bezahlt_von', e.target.value as Payer)}
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
                  disabled={!isFormValid()}
                  className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
                >
                  {editingExpense ? 'Speichern' : 'Hinzufügen'}
                </button>
                <button
                  onClick={resetForm}
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
                    <span className='font-medium'>{expense.beschreibung}</span>
                    <span className='text-sm text-gray-500 ml-2'>
                      (bezahlt von {getPayerDisplayName(expense.bezahlt_von)})
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
    </div>
  );
}