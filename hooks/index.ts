import { useState, useMemo, useCallback } from 'react';
import { Settings, Expense, CalculationResults, Payer } from '@/types';
import { ApiService } from '@/lib/api';
import { calculateFinancialResults } from '@/lib/calculations';

/**
 * Custom hook for settings operations (without managing state)
 */
export function useSettingsOperations(
  settings: Settings,
  setSettings: (settings: Settings) => void
) {
  const updateSettings = useCallback(
    (newSettings: Partial<Settings>) => {
      setSettings({ ...settings, ...newSettings });
    },
    [settings, setSettings]
  );

  const saveSettings = useCallback(async () => {
    try {
      await ApiService.updateSettings({
        p1_einkommen: settings.p1_einkommen,
        p2_einkommen: settings.p2_einkommen,
        restgeld_vormonat: settings.restgeld_vormonat,
        comida_betrag: settings.comida_betrag,
        ahorros_betrag: settings.ahorros_betrag,
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }, [settings]);

  return {
    updateSettings,
    saveSettings,
  };
}

/**
 * Custom hook for expense operations (without managing state)
 */
export function useExpensesOperations(
  expenses: Expense[],
  setExpenses: (expenses: Expense[]) => void
) {
  const addExpense = useCallback(
    (expense: Expense) => {
      setExpenses([...expenses, expense]);
    },
    [expenses, setExpenses]
  );

  const updateExpense = useCallback(
    (expenseId: number, updatedExpense: Expense) => {
      setExpenses(
        expenses.map((exp) => (exp.id === expenseId ? updatedExpense : exp))
      );
    },
    [expenses, setExpenses]
  );

  const removeExpense = useCallback(
    (expenseId: number) => {
      setExpenses(expenses.filter((exp) => exp.id !== expenseId));
    },
    [expenses, setExpenses]
  );

  const createExpense = useCallback(
    async (expenseData: {
      beschreibung: string;
      betrag: string;
      bezahlt_von: Payer;
    }) => {
      try {
        const newExpense = await ApiService.createExpense({
          beschreibung: expenseData.beschreibung,
          betrag: parseFloat(expenseData.betrag),
          bezahlt_von: expenseData.bezahlt_von,
        });
        addExpense(newExpense);
        return newExpense;
      } catch (error) {
        console.error('Error creating expense:', error);
        throw error;
      }
    },
    [addExpense]
  );

  const editExpense = useCallback(
    async (
      expenseId: number,
      expenseData: {
        beschreibung: string;
        betrag: string;
        bezahlt_von: Payer;
      }
    ) => {
      try {
        const updatedExpense = await ApiService.updateExpense(expenseId, {
          beschreibung: expenseData.beschreibung,
          betrag: parseFloat(expenseData.betrag),
          bezahlt_von: expenseData.bezahlt_von,
        });
        updateExpense(expenseId, updatedExpense);
        return updatedExpense;
      } catch (error) {
        console.error('Error updating expense:', error);
        throw error;
      }
    },
    [updateExpense]
  );

  const deleteExpense = useCallback(
    async (expenseId: number) => {
      try {
        await ApiService.deleteExpense(expenseId);
        removeExpense(expenseId);
      } catch (error) {
        console.error('Error deleting expense:', error);
        throw error;
      }
    },
    [removeExpense]
  );

  return {
    createExpense,
    editExpense,
    deleteExpense,
  };
}

/**
 * Custom hook for managing expense form state
 */
export function useExpenseForm() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expenseForm, setExpenseForm] = useState({
    beschreibung: '',
    betrag: '',
    bezahlt_von: 'Partner1' as Payer,
  });

  const resetForm = () => {
    setExpenseForm({
      beschreibung: '',
      betrag: '',
      bezahlt_von: 'Partner1' as Payer,
    });
    setEditingExpense(null);
    setShowAddExpense(false);
  };

  const startAddExpense = () => {
    resetForm();
    setShowAddExpense(true);
  };

  const startEditExpense = (expense: Expense) => {
    setExpenseForm({
      beschreibung: expense.beschreibung,
      betrag: expense.betrag.toString(),
      bezahlt_von: expense.bezahlt_von,
    });
    setEditingExpense(expense);
    setShowAddExpense(true);
  };

  const updateForm = (
    field: keyof typeof expenseForm,
    value: string | Payer
  ) => {
    setExpenseForm((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return expenseForm.beschreibung.trim() && expenseForm.betrag;
  };

  return {
    showAddExpense,
    editingExpense,
    expenseForm,
    setShowAddExpense,
    resetForm,
    startAddExpense,
    startEditExpense,
    updateForm,
    isFormValid,
  };
}

/**
 * Custom hook that combines data loading with state management
 * This prevents infinite re-renders by managing the loading internally
 */
export function useAppData() {
  const [settings, setSettings] = useState<Settings>({
    id: 1,
    p1_einkommen: 3000,
    p2_einkommen: 2500,
    restgeld_vormonat: 0,
    comida_betrag: 0,
    ahorros_betrag: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const { settings: loadedSettings, expenses: loadedExpenses } =
        await ApiService.loadInitialData();
      setSettings(loadedSettings);
      setExpenses(loadedExpenses);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    settings,
    setSettings,
    expenses,
    setExpenses,
    loading,
    loadData,
  };
}

/**
 * Custom hook for financial calculations
 * Uses useMemo to optimize performance by only recalculating when dependencies change
 */
export function useFinancialCalculations(
  settings: Settings,
  expenses: Expense[]
): CalculationResults {
  return useMemo(() => {
    return calculateFinancialResults(settings, expenses);
  }, [settings, expenses]);
}
