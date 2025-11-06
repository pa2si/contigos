'use client';

import { Expense, Payer } from '@/types';
import FormModal from '@/components/FormModal';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingExpense?: Expense | null;
  expenseForm: {
    beschreibung: string;
    betrag: string;
    bezahlt_von: Payer;
  };
  onUpdateExpenseForm: (
    field: 'beschreibung' | 'betrag' | 'bezahlt_von',
    value: string | Payer
  ) => void;
  onSaveExpense: () => Promise<void>;
  isExpenseFormValid: () => boolean;
}

export default function ExpenseModal({
  isOpen,
  onClose,
  editingExpense,
  expenseForm,
  onUpdateExpenseForm,
  onSaveExpense,
  isExpenseFormValid,
}: ExpenseModalProps) {
  const handleUpdateForm = (field: string, value: string | Payer) => {
    onUpdateExpenseForm(
      field as 'beschreibung' | 'betrag' | 'bezahlt_von',
      value
    );
  };

  return (
    <FormModal
      type='expense'
      isOpen={isOpen}
      onClose={onClose}
      isEditing={!!editingExpense}
      formData={{
        beschreibung: expenseForm.beschreibung,
        betrag: expenseForm.betrag,
        thirdField: expenseForm.bezahlt_von,
      }}
      onUpdateForm={handleUpdateForm}
      onSave={onSaveExpense}
      isFormValid={isExpenseFormValid}
    />
  );
}
