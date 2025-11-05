'use client';

import { Income } from '@/types';
import { IncomeSource } from '@prisma/client';
import FormModal from '@/components/FormModal';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingIncome?: Income | null;
  incomeForm: {
    beschreibung: string;
    betrag: string;
    quelle: IncomeSource;
  };
  onUpdateIncomeForm: (
    field: 'beschreibung' | 'betrag' | 'quelle',
    value: string | IncomeSource
  ) => void;
  onSaveIncome: () => Promise<void>;
  isIncomeFormValid: () => boolean;
}

export default function IncomeModal({
  isOpen,
  onClose,
  editingIncome,
  incomeForm,
  onUpdateIncomeForm,
  onSaveIncome,
  isIncomeFormValid,
}: IncomeModalProps) {
  const handleUpdateForm = (field: string, value: string | IncomeSource) => {
    onUpdateIncomeForm(field as 'beschreibung' | 'betrag' | 'quelle', value);
  };

  return (
    <FormModal
      type="income"
      isOpen={isOpen}
      onClose={onClose}
      isEditing={!!editingIncome}
      formData={{
        beschreibung: incomeForm.beschreibung,
        betrag: incomeForm.betrag,
        thirdField: incomeForm.quelle,
      }}
      onUpdateForm={handleUpdateForm}
      onSave={onSaveIncome}
      isFormValid={isIncomeFormValid}
    />
  );
}
