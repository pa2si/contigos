'use client';

import { useState, useEffect } from 'react';
import { Settings, Expense } from '@/types';

export default function HomePage() {
  const [settings, setSettings] = useState<Settings>({
    id: 1,
    p1_einkommen: 3000,
    p2_einkommen: 2500,
    restgeld_vormonat: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Expense form state
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expenseForm, setExpenseForm] = useState({
    beschreibung: '',
    betrag: '',
    bezahlt_von: 'Partner1' as 'Partner1' | 'Partner2' | 'Gemeinschaftskonto'
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [settingsRes, expensesRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/expenses')
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings(data);
      }

      if (expensesRes.ok) {
        const data = await expensesRes.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          p1_einkommen: settings.p1_einkommen,
          p2_einkommen: settings.p2_einkommen,
          restgeld_vormonat: settings.restgeld_vormonat
        })
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Expense CRUD operations
  const resetExpenseForm = () => {
    setExpenseForm({
      beschreibung: '',
      betrag: '',
      bezahlt_von: 'Partner1'
    });
    setEditingExpense(null);
    setShowAddExpense(false);
  };

  const handleAddExpense = () => {
    resetExpenseForm();
    setShowAddExpense(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setExpenseForm({
      beschreibung: expense.beschreibung,
      betrag: expense.betrag.toString(),
      bezahlt_von: expense.bezahlt_von
    });
    setEditingExpense(expense);
    setShowAddExpense(true);
  };

  const handleSaveExpense = async () => {
    if (!expenseForm.beschreibung.trim() || !expenseForm.betrag) return;

    try {
      const expenseData = {
        beschreibung: expenseForm.beschreibung.trim(),
        betrag: parseFloat(expenseForm.betrag),
        bezahlt_von: expenseForm.bezahlt_von
      };

      if (editingExpense) {
        // Update existing expense
        const response = await fetch(`/api/expenses/${editingExpense.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expenseData)
        });

        if (response.ok) {
          const updatedExpense = await response.json();
          setExpenses(expenses.map(exp => 
            exp.id === editingExpense.id ? updatedExpense : exp
          ));
        }
      } else {
        // Create new expense
        const response = await fetch('/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expenseData)
        });

        if (response.ok) {
          const newExpense = await response.json();
          setExpenses([...expenses, newExpense]);
        }
      }
      resetExpenseForm();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleDeleteExpense = async (expenseId: number) => {
    if (!confirm('Möchten Sie diese Ausgabe wirklich löschen?')) return;

    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setExpenses(expenses.filter(exp => exp.id !== expenseId));
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  // Helper function to display payer names
  const getPayerDisplayName = (payer: 'Partner1' | 'Partner2' | 'Gemeinschaftskonto') => {
    switch (payer) {
      case 'Partner1':
        return 'Pascal';
      case 'Partner2':
        return 'Caro';
      case 'Gemeinschaftskonto':
        return 'Gemeinschaftskonto';
      default:
        return payer;
    }
  };

  // Calculate fair shares based on income ratio - React Compiler will optimize this
  const calculateShares = () => {
    const totalIncome = settings.p1_einkommen + settings.p2_einkommen;
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.betrag, 0);
    const totalAmount = totalExpenses + settings.restgeld_vormonat;

    if (totalIncome === 0) {
      return { 
        partner1: 0, 
        partner2: 0, 
        total: totalAmount,
        partner1Ratio: 0,
        partner2Ratio: 0
      };
    }

    const partner1Ratio = settings.p1_einkommen / totalIncome;
    const partner2Ratio = settings.p2_einkommen / totalIncome;

    return {
      partner1: Math.round(totalAmount * partner1Ratio * 100) / 100,
      partner2: Math.round(totalAmount * partner2Ratio * 100) / 100,
      total: totalAmount,
      partner1Ratio: Math.round(partner1Ratio * 100 * 10) / 10, // One decimal place
      partner2Ratio: Math.round(partner2Ratio * 100 * 10) / 10
    };
  };

  const shares = calculateShares();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading Contigos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Contigos</h1>
          <p className="text-gray-600">Faire Haushaltskosten-Berechnung für Paare</p>
        </div>

        {/* Settings Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Einstellungen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pascal Einkommen (€)
              </label>
              <input
                type="number"
                value={settings.p1_einkommen}
                onChange={(e) => {
                  const newSettings = {
                    ...settings,
                    p1_einkommen: Number(e.target.value)
                  };
                  setSettings(newSettings);
                }}
                onBlur={saveSettings}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caro Einkommen (€)
              </label>
              <input
                type="number"
                value={settings.p2_einkommen}
                onChange={(e) => {
                  const newSettings = {
                    ...settings,
                    p2_einkommen: Number(e.target.value)
                  };
                  setSettings(newSettings);
                }}
                onBlur={saveSettings}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rest vom Vormonat (€)
              </label>
              <input
                type="number"
                value={settings.restgeld_vormonat}
                onChange={(e) => {
                  const newSettings = {
                    ...settings,
                    restgeld_vormonat: Number(e.target.value)
                  };
                  setSettings(newSettings);
                }}
                onBlur={saveSettings}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Faire Aufteilung</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Pascal</h3>
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {shares.partner1.toFixed(2)} €
              </div>
              <div className="text-sm text-gray-600">
                {shares.partner1Ratio}% Anteil
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Caro</h3>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {shares.partner2.toFixed(2)} €
              </div>
              <div className="text-sm text-gray-600">
                {shares.partner2Ratio}% Anteil
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Gesamt</h3>
              <div className="text-3xl font-bold text-gray-700 mb-1">
                {shares.total.toFixed(2)} €
              </div>
              <div className="text-sm text-gray-600">
                {expenses.length} Ausgaben
              </div>
            </div>
          </div>
        </div>

        {/* Expenses Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Ausgaben</h2>
            <button 
              onClick={handleAddExpense}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Ausgabe hinzufügen
            </button>
          </div>
          
          {/* Add/Edit Expense Form */}
          {showAddExpense && (
            <div className="mb-6 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
              <h3 className="text-lg font-semibold mb-4">
                {editingExpense ? 'Ausgabe bearbeiten' : 'Neue Ausgabe hinzufügen'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beschreibung
                  </label>
                  <input
                    type="text"
                    value={expenseForm.beschreibung}
                    onChange={(e) => setExpenseForm({
                      ...expenseForm, 
                      beschreibung: e.target.value
                    })}
                    placeholder="z.B. Einkauf, Miete, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Betrag (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={expenseForm.betrag}
                    onChange={(e) => setExpenseForm({
                      ...expenseForm, 
                      betrag: e.target.value
                    })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bezahlt von
                  </label>
                  <select
                    value={expenseForm.bezahlt_von}
                    onChange={(e) => setExpenseForm({
                      ...expenseForm, 
                      bezahlt_von: e.target.value as 'Partner1' | 'Partner2' | 'Gemeinschaftskonto'
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Partner1">Pascal</option>
                    <option value="Partner2">Caro</option>
                    <option value="Gemeinschaftskonto">Gemeinschaftskonto</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSaveExpense}
                  disabled={!expenseForm.beschreibung.trim() || !expenseForm.betrag}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {editingExpense ? 'Speichern' : 'Hinzufügen'}
                </button>
                <button
                  onClick={resetExpenseForm}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          )}
          
          {expenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Noch keine Ausgaben erfasst.</p>
              <p className="text-sm">Füge deine erste Ausgabe hinzu!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                  <div className="flex-1">
                    <span className="font-medium">{expense.beschreibung}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      (bezahlt von {getPayerDisplayName(expense.bezahlt_von)})
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-lg">
                      {expense.betrag.toFixed(2)} €
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditExpense(expense)}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
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