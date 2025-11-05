import {
  Settings,
  Expense,
  Income,
  PrivateExpense,
  SettingsUpdateRequest,
  ExpenseCreateRequest,
  ExpenseUpdateRequest,
  IncomeCreateRequest,
  IncomeUpdateRequest,
  PrivateExpenseCreateRequest,
  PrivateExpenseUpdateRequest,
} from '@/types';

/**
 * Service class for handling all API calls related to settings and expenses
 */
export class ApiService {
  /**
   * Fetch current settings from the API
   */
  static async getSettings(): Promise<Settings> {
    const response = await fetch('/api/settings');
    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }
    const data = await response.json();

    // Ensure all values are properly typed as numbers
    return {
      ...data,
      p1_einkommen: Number(data.p1_einkommen) || 0,
      p2_einkommen: Number(data.p2_einkommen) || 0,
      restgeld_vormonat: Number(data.restgeld_vormonat) || 0,
      comida_betrag: Number(data.comida_betrag) || 0,
      ahorros_betrag: Number(data.ahorros_betrag) || 0,
      tagesgeldkonto_betrag: Number(data.tagesgeldkonto_betrag) || 0,
      investieren: Number(data.investieren) || 0,
    };
  }

  /**
   * Update settings via the API
   */
  static async updateSettings(
    settings: SettingsUpdateRequest
  ): Promise<Settings> {
    const dataToSend = {
      p1_einkommen: Number(settings.p1_einkommen) || 0,
      p2_einkommen: Number(settings.p2_einkommen) || 0,
      restgeld_vormonat: Number(settings.restgeld_vormonat) || 0,
      comida_betrag: Number(settings.comida_betrag) || 0,
      ahorros_betrag: Number(settings.ahorros_betrag) || 0,
      tagesgeldkonto_betrag: Number(settings.tagesgeldkonto_betrag) || 0,
      investieren: Number(settings.investieren) || 0,
    };

    const response = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      throw new Error('Failed to update settings');
    }

    return response.json();
  }

  /**
   * Fetch all expenses from the API
   */
  static async getExpenses(): Promise<Expense[]> {
    const response = await fetch('/api/expenses');
    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }
    return response.json();
  }

  /**
   * Create a new expense via the API
   */
  static async createExpense(expense: ExpenseCreateRequest): Promise<Expense> {
    const expenseData = {
      beschreibung: expense.beschreibung.trim(),
      betrag: parseFloat(expense.betrag.toString()),
      bezahlt_von: expense.bezahlt_von,
    };

    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData),
    });

    if (!response.ok) {
      throw new Error('Failed to create expense');
    }

    return response.json();
  }

  /**
   * Update an existing expense via the API
   */
  static async updateExpense(
    expenseId: number,
    expense: ExpenseUpdateRequest
  ): Promise<Expense> {
    const expenseData = {
      beschreibung: expense.beschreibung.trim(),
      betrag: parseFloat(expense.betrag.toString()),
      bezahlt_von: expense.bezahlt_von,
    };

    const response = await fetch(`/api/expenses/${expenseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData),
    });

    if (!response.ok) {
      throw new Error('Failed to update expense');
    }

    return response.json();
  }

  /**
   * Delete an expense via the API
   */
  static async deleteExpense(expenseId: number): Promise<void> {
    const response = await fetch(`/api/expenses/${expenseId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete expense');
    }
  }

  /**
   * Fetch all income positions from the API
   */
  static async getIncomes(): Promise<Income[]> {
    const response = await fetch('/api/incomes');
    if (!response.ok) {
      throw new Error('Failed to fetch incomes');
    }
    return response.json();
  }

  /**
   * Create a new income position via the API
   */
  static async createIncome(income: IncomeCreateRequest): Promise<Income> {
    const incomeData = {
      beschreibung: income.beschreibung.trim(),
      betrag: parseFloat(income.betrag.toString()),
      quelle: income.quelle,
    };

    const response = await fetch('/api/incomes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incomeData),
    });

    if (!response.ok) {
      throw new Error('Failed to create income');
    }

    return response.json();
  }

  /**
   * Update an existing income position via the API
   */
  static async updateIncome(
    incomeId: number,
    income: IncomeUpdateRequest
  ): Promise<Income> {
    const incomeData = {
      beschreibung: income.beschreibung.trim(),
      betrag: parseFloat(income.betrag.toString()),
      quelle: income.quelle,
    };

    const response = await fetch(`/api/incomes/${incomeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incomeData),
    });

    if (!response.ok) {
      throw new Error('Failed to update income');
    }

    return response.json();
  }

  /**
   * Delete an income position via the API
   */
  static async deleteIncome(incomeId: number): Promise<void> {
    const response = await fetch(`/api/incomes/${incomeId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete income');
    }
  }

  // ===== PRIVATE EXPENSES API =====

  /**
   * Fetch all private expenses from the API
   */
  static async getPrivateExpenses(): Promise<PrivateExpense[]> {
    const response = await fetch('/api/private-expenses');
    if (!response.ok) {
      throw new Error('Failed to fetch private expenses');
    }
    return response.json();
  }

  /**
   * Create a new private expense
   */
  static async createPrivateExpense(
    privateExpenseData: PrivateExpenseCreateRequest
  ): Promise<PrivateExpense> {
    const response = await fetch('/api/private-expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(privateExpenseData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create private expense');
    }

    return response.json();
  }

  /**
   * Update an existing private expense
   */
  static async updatePrivateExpense(
    id: number,
    privateExpenseData: PrivateExpenseUpdateRequest
  ): Promise<PrivateExpense> {
    const response = await fetch(`/api/private-expenses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(privateExpenseData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update private expense');
    }

    return response.json();
  }

  /**
   * Delete a private expense
   */
  static async deletePrivateExpense(id: number): Promise<void> {
    const response = await fetch(`/api/private-expenses/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete private expense');
    }
  }

  // ===== LOAD ALL DATA =====

  /**
   * Load all data needed for the app
   * This provides a central way to load settings, expenses, and incomes with proper error handling
   */
  static async loadAllData(): Promise<{
    settings: Settings;
    expenses: Expense[];
    incomes: Income[];
    privateExpenses: PrivateExpense[];
  }> {
    const [settings, expenses, incomes, privateExpenses] = await Promise.all([
      this.getSettings(),
      this.getExpenses(),
      this.getIncomes(),
      this.getPrivateExpenses(),
    ]);

    return { settings, expenses, incomes, privateExpenses };
  }
}
