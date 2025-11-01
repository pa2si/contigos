import { Payer } from '@/types';

/**
 * Display name mapping for payers
 */
export function getPayerDisplayName(payer: Payer): string {
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
}

/**
 * Format currency values for display
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });
}

/**
 * Format currency values with specific decimal places
 */
export function formatCurrencyFixed(
  amount: number,
  decimals: number = 2
): string {
  return `${amount.toFixed(decimals)} €`;
}

/**
 * Format percentage values for display
 */
export function formatPercentage(
  percentage: number,
  decimals: number = 2
): string {
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Safely parse a number from string input
 */
export function parseNumber(value: string | number): number {
  return Number(value) || 0;
}

/**
 * Validation helper for expense form
 */
export function validateExpenseForm(form: {
  beschreibung: string;
  betrag: string;
  bezahlt_von: Payer;
}): boolean {
  return Boolean(
    form.beschreibung.trim() &&
      form.betrag &&
      !isNaN(parseFloat(form.betrag)) &&
      parseFloat(form.betrag) > 0
  );
}

/**
 * Confirmation dialog for expense deletion
 */
export function confirmExpenseDeletion(): boolean {
  return confirm('Möchten Sie diese Ausgabe wirklich löschen?');
}

/**
 * Check if two amounts are equal within a small tolerance (for floating point comparison)
 */
export function amountsAreEqual(
  amount1: number,
  amount2: number,
  tolerance: number = 0.01
): boolean {
  return Math.abs(amount1 - amount2) < tolerance;
}
