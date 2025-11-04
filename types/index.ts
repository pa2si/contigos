import { Payer, IncomeSource } from '@prisma/client';

// Partner enum for private expenses
export type Partner = 'Partner1' | 'Partner2';

// Database model types (from Prisma)
export interface Settings {
  id: number;
  p1_einkommen: number;
  p2_einkommen: number;
  restgeld_vormonat: number;
  comida_betrag: number;
  ahorros_betrag: number;
  tagesgeldkonto_betrag: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: number;
  beschreibung: string;
  betrag: number;
  bezahlt_von: Payer;
  createdAt: Date;
  updatedAt: Date;
}

export interface Income {
  id: number;
  beschreibung: string;
  betrag: number;
  quelle: IncomeSource;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrivateExpense {
  id: number;
  beschreibung: string;
  betrag: number;
  person: Partner;
  createdAt: Date;
  updatedAt: Date;
}

// API request/response types
export interface SettingsUpdateRequest {
  p1_einkommen: number;
  p2_einkommen: number;
  restgeld_vormonat: number;
  comida_betrag: number;
  ahorros_betrag: number;
  tagesgeldkonto_betrag: number;
}

export interface ExpenseCreateRequest {
  beschreibung: string;
  betrag: number;
  bezahlt_von: Payer;
}

export type ExpenseUpdateRequest = ExpenseCreateRequest;

export interface IncomeCreateRequest {
  beschreibung: string;
  betrag: number;
  quelle: 'Partner1' | 'Partner2';
}

export type IncomeUpdateRequest = IncomeCreateRequest;

export interface PrivateExpenseCreateRequest {
  beschreibung: string;
  betrag: number;
  person: Partner;
}

export type PrivateExpenseUpdateRequest = PrivateExpenseCreateRequest;

// Calculation result types (for the frontend calculations)
export interface CalculationResults {
  // Basic calculations
  gesamteinkommen: number;
  p1_anteil_prozent: number;
  p2_anteil_prozent: number;
  gesamtkosten: number;

  // Partner cost shares
  p1_gesamtanteil_kosten: number;
  p2_gesamtanteil_kosten: number;

  // Direct payments by each partner
  p1_direktzahlungen: number;
  p2_direktzahlungen: number;

  // Shared account needs
  bedarf_gk: number;

  // Previous month remainder allocation
  p1_anteil_restgeld: number;
  p2_anteil_restgeld: number;

  // Final transfer amounts (main results)
  finale_überweisung_p1: number;
  finale_überweisung_p2: number;

  // Control calculations
  kontrolle_einzahlungNötig: number;
  kontrolle_summeÜberweisungen: number;

  // Remaining free amounts
  verbleibt_p1: number;
  verbleibt_p2: number;

  // Savings calculations
  aktuelles_tagesgeldkonto: number;
  neues_tagesgeldkonto: number;

  // Individual breakdown components
  comida_betrag: number;
  ahorros_betrag: number;
  gk_dyn_expenses: number;
}

// Export enums for convenience
export { Payer, IncomeSource };
export type PayerType = Payer;
export type IncomeSourceType = IncomeSource;
