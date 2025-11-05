'use client';

import { PrivateExpense, Partner } from '@/types';
import Modal from '@/components/ui/Modal';

interface PrivateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingExpense?: PrivateExpense | null;
  expenseForm: {
    beschreibung: string;
    betrag: string;
    person: Partner;
  };
  onUpdateExpenseForm: (
    field: 'beschreibung' | 'betrag' | 'person',
    value: string | Partner
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
  const handleSave = async () => {
    if (isExpenseFormValid()) {
      await onSaveExpense();
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && isExpenseFormValid()) {
      handleSave();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <span className='text-xl mr-2'>{editingExpense ? '✏️' : '🛍️'}</span>
          {editingExpense
            ? 'Private Ausgabe bearbeiten'
            : 'Neue private Ausgabe hinzufügen'}
        </>
      }
      size='lg'
    >
      <div className='p-4 sm:p-6' onKeyDown={handleKeyDown}>
        {/* Form Fields */}
        <div className='space-y-4 sm:space-y-6'>
          {/* Description Field */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              📝 Beschreibung
            </label>
            <input
              type='text'
              value={expenseForm.beschreibung}
              onChange={(e) =>
                onUpdateExpenseForm('beschreibung', e.target.value)
              }
              placeholder='z.B. abos, creditos, bvg ...'
              className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base'
              autoFocus
            />
          </div>

          {/* Amount and Person Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
            {/* Amount Field */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                💰 Betrag (€)
              </label>
              <input
                type='number'
                step='0.01'
                min='0'
                value={expenseForm.betrag}
                onChange={(e) => onUpdateExpenseForm('betrag', e.target.value)}
                placeholder='0.00'
                className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base'
              />
            </div>

            {/* Person Field */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                👤 Person
              </label>
              <select
                value={expenseForm.person}
                onChange={(e) =>
                  onUpdateExpenseForm('person', e.target.value as Partner)
                }
                className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base'
              >
                <option value='Partner1'>👨‍💼 Pascal</option>
                <option value='Partner2'>👩‍💼 Caro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 pt-6 border-t border-gray-200'>
          <button
            onClick={handleSave}
            disabled={!isExpenseFormValid()}
            className='flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base'
          >
            <span>{editingExpense ? '💾' : '🛍️'}</span>
            {editingExpense
              ? 'Änderungen speichern'
              : 'Private Ausgabe hinzufügen'}
          </button>

          <button
            onClick={onClose}
            className='flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl font-medium hover:from-gray-500 hover:to-gray-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base'
          >
            <span>❌</span>
            Abbrechen
          </button>
        </div>
      </div>
    </Modal>
  );
}
