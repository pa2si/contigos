'use client';

import { CalculationResults, Settings } from '@/types';
import ControlSection from './ControlSection';
import GirokontoSection from './GirokontoSection';
import SavingsSection from './SavingsSection';

interface SummaryProps {
  results: CalculationResults;
  settings: Settings;
  onNavigateToPrivateExpenses?: () => void;
}

export default function Summary({
  results,
  settings,
  onNavigateToPrivateExpenses,
}: SummaryProps) {
  return (
    <>
      {/* CONTROL SECTION */}
      <ControlSection results={results} settings={settings} />

      {/* GIROKONTO SECTION */}
      <GirokontoSection
        results={results}
        onPascalClick={onNavigateToPrivateExpenses}
        onCaroClick={onNavigateToPrivateExpenses}
      />

      {/* SAVINGS SECTION */}
      <SavingsSection results={results} />
    </>
  );
}
