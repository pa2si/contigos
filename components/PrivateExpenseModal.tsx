'use client';

import { PrivateExpense, Partner } from '@/types';
import FormModal from '@/components/FormModal';

interface PrivateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingExpense?: PrivateExpense | null;
  expenseForm: {
    beschreibung: string;
    betrag: number;
    person: Partner;
  };
  onUpdateExpenseForm: (
    field: 'beschreibung' | 'betrag' | 'person',
    value: string | number | Partner
  ) => void;
  onSaveExpense: () => Promise<void>;
  isExpenseFormValid: () => boolean;
}

export default function PrivateExpenseModal({
  isOpen,
  onClose,
  editingExpense,
  expenseForm,
  onUpdateExpenseForm,
  onSaveExpense,
  isExpenseFormValid,
}: PrivateExpenseModalProps) {
  const handleUpdateForm = (field: string, value: string | number | Partner) => {
    onUpdateExpenseForm(field as 'beschreibung' | 'betrag' | 'person', value);
  };

  return (
    <FormModal
      type="private-expense"
      isOpen={isOpen}
      onClose={onClose}
      isEditing={!!editingExpense}
      formData={{
        beschreibung: expenseForm.beschreibung,
        betrag: expenseForm.betrag.toString(),
        thirdField: expenseForm.person,
      }}
      onUpdateForm={handleUpdateForm}
      onSave={onSaveExpense}
      isFormValid={isExpenseFormValid}
    />
  );
}
