import {
  Settings,
  Expense,
  SettingsUpdateRequest,
  ExpenseCreateRequest,
  ExpenseUpdateRequest,
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
   * Load both settings and expenses in parallel
   */
  static async loadInitialData(): Promise<{
    settings: Settings;
    expenses: Expense[];
  }> {
    const [settings, expenses] = await Promise.all([
      this.getSettings(),
      this.getExpenses(),
    ]);

    return { settings, expenses };
  }
}
