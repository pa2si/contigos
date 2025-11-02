'use client';

import { CalculationResults } from '@/types';
import ActionSection from './ActionSection';
import GirokontoSection from './GirokontoSection';
import SavingsSection from './SavingsSection';

interface SummaryProps {
  results: CalculationResults;
}

export default function Summary({ results }: SummaryProps) {
  return (
    <>
      {/* ACTION SECTION */}
      <ActionSection results={results} />

      {/* GIROKONTO SECTION */}
      <GirokontoSection results={results} />

      {/* SAVINGS SECTION */}
      <SavingsSection results={results} />
    </>
  );
}
