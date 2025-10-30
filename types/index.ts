import { Payer } from '@prisma/client';

// Database model types (from Prisma)
export interface Settings {
  id: number;
  p1_einkommen: number;
  p2_einkommen: number;
  restgeld_vormonat: number;
  comida_betrag: number;
  ahorros_betrag: number;
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

// API request/response types
export interface SettingsUpdateRequest {
  p1_einkommen: number;
  p2_einkommen: number;
  restgeld_vormonat: number;
  comida_betrag: number;
  ahorros_betrag: number;
}

export interface ExpenseCreateRequest {
  beschreibung: string;
  betrag: number;
  bezahlt_von: Payer;
}

export type ExpenseUpdateRequest = ExpenseCreateRequest;

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
  finale_ueberweisung_p1: number;
  finale_ueberweisung_p2: number;

  // Control calculations
  kontrolle_einzahlung_noetig: number;
  kontrolle_summe_ueberweisungen: number;

  // Remaining free amounts
  verbleibt_p1: number;
  verbleibt_p2: number;
}

// Export Payer enum for convenience
export { Payer };
export type PayerType = Payer;
