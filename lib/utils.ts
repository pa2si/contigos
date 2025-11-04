import { Payer, IncomeSource } from '@/types';

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
 * Display name mapping for income sources
 */
export function getIncomeSourceDisplayName(source: IncomeSource): string {
  switch (source) {
    case 'Partner1':
      return 'Pascal';
    case 'Partner2':
      return 'Caro';
    default:
      return source;
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
 * Format currency with loading state support
 */
export function formatCurrencyOrLoading(
  amount: number | null,
  isLoading: boolean = false,
  decimals: number = 2
): string {
  if (isLoading || amount === null) {
    return '--- €';
  }
  return formatCurrencyFixed(amount, decimals);
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
 * Enhanced validation helper for expense form with sanitization
 */
export function validateExpenseForm(form: {
  beschreibung: string;
  betrag: string;
  bezahlt_von: Payer;
}): boolean {
  try {
    // Validate description
    const beschreibung = form.beschreibung.trim();
    if (
      !beschreibung ||
      beschreibung.length === 0 ||
      beschreibung.length > 100
    ) {
      return false;
    }

    // Validate amount
    const betrag = parseFloat(form.betrag);
    if (isNaN(betrag) || !isFinite(betrag) || betrag <= 0 || betrag > 1000000) {
      return false;
    }

    // Validate payer enum
    const validPayers: Payer[] = ['Partner1', 'Partner2', 'Gemeinschaftskonto'];
    if (!validPayers.includes(form.bezahlt_von)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Enhanced validation helper for income form with sanitization
 */
export function validateIncomeForm(form: {
  beschreibung: string;
  betrag: string;
  quelle: IncomeSource;
}): boolean {
  try {
    // Validate description
    const beschreibung = form.beschreibung.trim();
    if (
      !beschreibung ||
      beschreibung.length === 0 ||
      beschreibung.length > 100
    ) {
      return false;
    }

    // Validate amount
    const betrag = parseFloat(form.betrag);
    if (isNaN(betrag) || !isFinite(betrag) || betrag <= 0 || betrag > 1000000) {
      return false;
    }

    // Validate source enum
    const validSources: IncomeSource[] = ['Partner1', 'Partner2'];
    if (!validSources.includes(form.quelle)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
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
