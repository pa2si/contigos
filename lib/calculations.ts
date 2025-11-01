import { Settings, Expense, Income, CalculationResults } from '@/types';

/**
 * Calculates financial allocations between partners based on income ratios
 * This implements the complete Contigos calculation logic
 */
export function calculateFinancialResults(
  settings: Settings,
  expenses: Expense[],
  incomes: Income[]
): CalculationResults {
  // Step 0: Calculate total income per partner from income positions
  // Handle case where incomes might be undefined or empty during initial load
  const safeIncomes = incomes || [];

  // Calculate income totals from dynamic positions (this is now the source of truth)
  const p1_einkommen = safeIncomes
    .filter((income) => income.quelle === 'Partner1')
    .reduce((sum, income) => sum + (Number(income.betrag) || 0), 0);

  const p2_einkommen = safeIncomes
    .filter((income) => income.quelle === 'Partner2')
    .reduce((sum, income) => sum + (Number(income.betrag) || 0), 0);
  const restgeld_vormonat = Number(settings.restgeld_vormonat) || 0;

  // Fixed costs from settings (treated as shared account expenses)
  const comida_betrag = Number(settings.comida_betrag) || 0;
  const ahorros_betrag = Number(settings.ahorros_betrag) || 0;

  // Step 1: Total income
  const gesamteinkommen = p1_einkommen + p2_einkommen;

  // Prevent division by zero
  if (gesamteinkommen === 0) {
    return createEmptyResults();
  }

  // Step 2 & 3: Calculate income ratios (as 0.0 - 1.0)
  const p1_anteil_ratio = p1_einkommen / gesamteinkommen;
  const p2_anteil_ratio = p2_einkommen / gesamteinkommen;

  // Step 4: Total costs
  const sum_dyn_expenses = expenses.reduce(
    (sum, exp) => sum + (Number(exp.betrag) || 0),
    0
  );
  const gesamtkosten = comida_betrag + ahorros_betrag + sum_dyn_expenses;

  // Step 5 & 6: Total cost share per partner
  const p1_gesamtanteil_kosten = gesamtkosten * p1_anteil_ratio;
  const p2_gesamtanteil_kosten = gesamtkosten * p2_anteil_ratio;

  // Step 7 & 8: Direct payments (only from dynamic expense list)
  const p1_direktzahlungen = expenses
    .filter((exp) => exp.bezahlt_von === 'Partner1')
    .reduce((sum, exp) => sum + (Number(exp.betrag) || 0), 0);

  const p2_direktzahlungen = expenses
    .filter((exp) => exp.bezahlt_von === 'Partner2')
    .reduce((sum, exp) => sum + (Number(exp.betrag) || 0), 0);

  // Step 9: Shared account needs (GK)
  const gk_dyn_expenses = expenses
    .filter((exp) => exp.bezahlt_von === 'Gemeinschaftskonto')
    .reduce((sum, exp) => sum + (Number(exp.betrag) || 0), 0);

  const bedarf_gk = comida_betrag + ahorros_betrag + gk_dyn_expenses;

  // Step 10 & 11: Previous month remainder allocation
  const p1_anteil_restgeld = restgeld_vormonat * p1_anteil_ratio;
  const p2_anteil_restgeld = restgeld_vormonat * p2_anteil_ratio;

  // Step 12 & 13: Final transfer amounts
  // (Share of total costs) - (already paid directly) - (share of previous remainder)
  const finale_überweisung_p1 =
    p1_gesamtanteil_kosten - p1_direktzahlungen - p1_anteil_restgeld;
  const finale_überweisung_p2 =
    p2_gesamtanteil_kosten - p2_direktzahlungen - p2_anteil_restgeld;

  // Step 14 & 15: Remaining free amounts
  // What remains after actual payments (direct + transfer)
  const verbleibt_p1 =
    p1_einkommen - p1_direktzahlungen - finale_überweisung_p1;
  const verbleibt_p2 =
    p2_einkommen - p2_direktzahlungen - finale_überweisung_p2;

  // Step 16 & 17: Control calculations
  const kontrolle_einzahlungNötig = bedarf_gk - restgeld_vormonat;
  const kontrolle_summeÜberweisungen =
    finale_überweisung_p1 + finale_überweisung_p2;

  return {
    gesamteinkommen,
    p1_anteil_prozent: p1_anteil_ratio * 100, // Convert to percentage for display
    p2_anteil_prozent: p2_anteil_ratio * 100, // Convert to percentage for display
    gesamtkosten,
    p1_gesamtanteil_kosten,
    p2_gesamtanteil_kosten,
    p1_direktzahlungen,
    p2_direktzahlungen,
    bedarf_gk,
    p1_anteil_restgeld,
    p2_anteil_restgeld,
    finale_überweisung_p1,
    finale_überweisung_p2,
    kontrolle_einzahlungNötig,
    kontrolle_summeÜberweisungen,
    verbleibt_p1,
    verbleibt_p2,
  };
}

/**
 * Creates empty/default calculation results for error cases
 */
function createEmptyResults(): CalculationResults {
  return {
    gesamteinkommen: 0,
    p1_anteil_prozent: 0,
    p2_anteil_prozent: 0,
    gesamtkosten: 0,
    p1_gesamtanteil_kosten: 0,
    p2_gesamtanteil_kosten: 0,
    p1_direktzahlungen: 0,
    p2_direktzahlungen: 0,
    bedarf_gk: 0,
    p1_anteil_restgeld: 0,
    p2_anteil_restgeld: 0,
    finale_überweisung_p1: 0,
    finale_überweisung_p2: 0,
    kontrolle_einzahlungNötig: 0,
    kontrolle_summeÜberweisungen: 0,
    verbleibt_p1: 0,
    verbleibt_p2: 0,
  };
}

/**
 * Validates if control calculations match (within small tolerance for floating point)
 */
export function isControlCalculationValid(
  results: CalculationResults
): boolean {
  return (
    Math.abs(
      results.kontrolle_einzahlungNötig - results.kontrolle_summeÜberweisungen
    ) < 0.01
  );
}

/**
 * Calculate income totals per partner from income positions
 * This function provides the computed totals that replace manual income entry
 */
export function calculateIncomeTotals(incomes: Income[]): {
  pascalTotal: number;
  caroTotal: number;
} {
  const safeIncomes = incomes || [];

  const pascalTotal = safeIncomes
    .filter((income) => income.quelle === 'Partner1')
    .reduce((sum, income) => sum + (Number(income.betrag) || 0), 0);

  const caroTotal = safeIncomes
    .filter((income) => income.quelle === 'Partner2')
    .reduce((sum, income) => sum + (Number(income.betrag) || 0), 0);

  return { pascalTotal, caroTotal };
}
