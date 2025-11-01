import { useState, useMemo, useCallback } from 'react';
import {
  Settings,
  Expense,
  Income,
  CalculationResults,
  Payer,
  IncomeSource,
  PrivateExpense,
  PrivateExpenseCreateRequest,
  PrivateExpenseUpdateRequest,
} from '@/types';
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

  const isFormValid = (): boolean => {
    return Boolean(expenseForm.beschreibung.trim() && expenseForm.betrag);
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
 * Custom hook for income operations (without managing state)
 */
export function useIncomeOperations(
  incomes: Income[],
  setIncomes: (incomes: Income[]) => void
) {
  const addIncome = useCallback(
    (income: Income) => {
      setIncomes([...incomes, income]);
    },
    [incomes, setIncomes]
  );

  const updateIncome = useCallback(
    (incomeId: number, updatedIncome: Income) => {
      setIncomes(
        incomes.map((inc) => (inc.id === incomeId ? updatedIncome : inc))
      );
    },
    [incomes, setIncomes]
  );

  const removeIncome = useCallback(
    (incomeId: number) => {
      setIncomes(incomes.filter((inc) => inc.id !== incomeId));
    },
    [incomes, setIncomes]
  );

  const createIncome = useCallback(
    async (incomeData: {
      beschreibung: string;
      betrag: string;
      quelle: IncomeSource;
    }) => {
      try {
        const newIncome = await ApiService.createIncome({
          beschreibung: incomeData.beschreibung,
          betrag: parseFloat(incomeData.betrag),
          quelle: incomeData.quelle,
        });
        addIncome(newIncome);
        return newIncome;
      } catch (error) {
        console.error('Error creating income:', error);
        throw error;
      }
    },
    [addIncome]
  );

  const editIncome = useCallback(
    async (
      incomeId: number,
      incomeData: {
        beschreibung: string;
        betrag: string;
        quelle: IncomeSource;
      }
    ) => {
      try {
        const updatedIncome = await ApiService.updateIncome(incomeId, {
          beschreibung: incomeData.beschreibung,
          betrag: parseFloat(incomeData.betrag),
          quelle: incomeData.quelle,
        });
        updateIncome(incomeId, updatedIncome);
        return updatedIncome;
      } catch (error) {
        console.error('Error updating income:', error);
        throw error;
      }
    },
    [updateIncome]
  );

  const deleteIncome = useCallback(
    async (incomeId: number) => {
      try {
        await ApiService.deleteIncome(incomeId);
        removeIncome(incomeId);
      } catch (error) {
        console.error('Error deleting income:', error);
        throw error;
      }
    },
    [removeIncome]
  );

  return {
    createIncome,
    editIncome,
    deleteIncome,
  };
}

/**
 * Custom hook for managing partner-specific income lists and totals
 */
export function usePartnerIncomes(incomes: Income[]) {
  const pascalIncomes = useMemo(
    () => incomes.filter((income) => income.quelle === 'Partner1'),
    [incomes]
  );

  const caroIncomes = useMemo(
    () => incomes.filter((income) => income.quelle === 'Partner2'),
    [incomes]
  );

  const pascalTotal = useMemo(
    () =>
      pascalIncomes.reduce(
        (sum, income) => sum + (Number(income.betrag) || 0),
        0
      ),
    [pascalIncomes]
  );

  const caroTotal = useMemo(
    () =>
      caroIncomes.reduce(
        (sum, income) => sum + (Number(income.betrag) || 0),
        0
      ),
    [caroIncomes]
  );

  return {
    pascalIncomes,
    caroIncomes,
    pascalTotal,
    caroTotal,
  };
}

/**
 * Custom hook for managing income form state
 */
export function useIncomeForm() {
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [incomeForm, setIncomeForm] = useState({
    beschreibung: '',
    betrag: '',
    quelle: 'Partner1' as IncomeSource,
  });

  const resetForm = () => {
    setIncomeForm({
      beschreibung: '',
      betrag: '',
      quelle: 'Partner1' as IncomeSource,
    });
    setEditingIncome(null);
    setShowAddIncome(false);
  };

  const startAddIncome = () => {
    resetForm();
    setShowAddIncome(true);
  };

  const startEditIncome = (income: Income) => {
    setIncomeForm({
      beschreibung: income.beschreibung,
      betrag: income.betrag.toString(),
      quelle: income.quelle,
    });
    setEditingIncome(income);
    setShowAddIncome(true);
  };

  const updateForm = (
    field: keyof typeof incomeForm,
    value: string | IncomeSource
  ) => {
    setIncomeForm((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = (): boolean => {
    return Boolean(incomeForm.beschreibung.trim() && incomeForm.betrag);
  };

  return {
    showAddIncome,
    editingIncome,
    incomeForm,
    setShowAddIncome,
    resetForm,
    startAddIncome,
    startEditIncome,
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
  const [incomes, setIncomes] = useState<Income[]>([]);

  const loadData = useCallback(async () => {
    try {
      const {
        settings: loadedSettings,
        expenses: loadedExpenses,
        incomes: loadedIncomes,
      } = await ApiService.loadAllData();
      setSettings(loadedSettings);
      setExpenses(loadedExpenses);

      // Auto-migrate: Create default income positions if none exist but settings have income values
      if (
        loadedIncomes.length === 0 &&
        (loadedSettings.p1_einkommen > 0 || loadedSettings.p2_einkommen > 0)
      ) {
        const migratedIncomes = [];

        if (loadedSettings.p1_einkommen > 0) {
          try {
            const pascalIncome = await ApiService.createIncome({
              beschreibung: 'Gehalt',
              betrag: loadedSettings.p1_einkommen,
              quelle: 'Partner1',
            });
            migratedIncomes.push(pascalIncome);
          } catch (error) {
            console.error('Error migrating Pascal income:', error);
          }
        }

        if (loadedSettings.p2_einkommen > 0) {
          try {
            const caroIncome = await ApiService.createIncome({
              beschreibung: 'Gehalt',
              betrag: loadedSettings.p2_einkommen,
              quelle: 'Partner2',
            });
            migratedIncomes.push(caroIncome);
          } catch (error) {
            console.error('Error migrating Caro income:', error);
          }
        }

        setIncomes(migratedIncomes);
      } else {
        setIncomes(loadedIncomes);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  return {
    settings,
    setSettings,
    expenses,
    setExpenses,
    incomes,
    setIncomes,
    loadData,
  };
}

/**
 * Custom hook for financial calculations
 * Uses useMemo to optimize performance by only recalculating when dependencies change
 */
export function useFinancialCalculations(
  settings: Settings,
  expenses: Expense[],
  incomes: Income[],
  privateExpenses: PrivateExpense[] = []
): CalculationResults {
  return useMemo(() => {
    return calculateFinancialResults(
      settings,
      expenses,
      incomes,
      privateExpenses
    );
  }, [settings, expenses, incomes, privateExpenses]);
}

/**
 * Custom hook for private expense operations (without managing state)
 */
export function usePrivateExpenseOperations(
  privateExpenses: PrivateExpense[],
  setPrivateExpenses: (expenses: PrivateExpense[]) => void
) {
  const createPrivateExpense = useCallback(
    async (expenseData: PrivateExpenseCreateRequest) => {
      try {
        const newExpense = await ApiService.createPrivateExpense(expenseData);
        setPrivateExpenses([...privateExpenses, newExpense]);
        return newExpense;
      } catch (error) {
        console.error('Error creating private expense:', error);
        throw error;
      }
    },
    [privateExpenses, setPrivateExpenses]
  );

  const editPrivateExpense = useCallback(
    async (id: number, expenseData: PrivateExpenseUpdateRequest) => {
      try {
        const updatedExpense = await ApiService.updatePrivateExpense(
          id,
          expenseData
        );
        setPrivateExpenses(
          privateExpenses.map((expense) =>
            expense.id === id ? updatedExpense : expense
          )
        );
        return updatedExpense;
      } catch (error) {
        console.error('Error updating private expense:', error);
        throw error;
      }
    },
    [privateExpenses, setPrivateExpenses]
  );

  const deletePrivateExpense = useCallback(
    async (id: number) => {
      try {
        await ApiService.deletePrivateExpense(id);
        setPrivateExpenses(
          privateExpenses.filter((expense) => expense.id !== id)
        );
      } catch (error) {
        console.error('Error deleting private expense:', error);
        throw error;
      }
    },
    [privateExpenses, setPrivateExpenses]
  );

  return {
    createPrivateExpense,
    editPrivateExpense,
    deletePrivateExpense,
  };
}

/**
 * Custom hook for private expense form management
 */
export function usePrivateExpenseForm() {
  const [privateExpenseForm, setPrivateExpenseForm] = useState({
    beschreibung: '',
    betrag: '',
    person: 'Partner1' as const,
  });

  const updatePrivateExpenseForm = useCallback(
    (field: keyof typeof privateExpenseForm, value: string) => {
      setPrivateExpenseForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const resetPrivateExpenseForm = useCallback(() => {
    setPrivateExpenseForm({
      beschreibung: '',
      betrag: '',
      person: 'Partner1' as const,
    });
  }, []);

  const isPrivateExpenseFormValid = useCallback(() => {
    return (
      privateExpenseForm.beschreibung.trim() !== '' &&
      parseFloat(privateExpenseForm.betrag || '0') > 0
    );
  }, [privateExpenseForm]);

  return {
    privateExpenseForm,
    updatePrivateExpenseForm,
    resetPrivateExpenseForm,
    isPrivateExpenseFormValid,
  };
}
