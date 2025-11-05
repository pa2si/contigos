'use client';

import { Income } from '@/types';
import { IncomeSource } from '@prisma/client';
import Modal from '@/components/ui/Modal';

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
  const handleSave = async () => {
    if (isIncomeFormValid()) {
      await onSaveIncome();
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && isIncomeFormValid()) {
      handleSave();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <span className='text-xl mr-2'>{editingIncome ? '✏️' : '💼'}</span>
          {editingIncome
            ? 'Einkommen bearbeiten'
            : 'Neues Einkommen hinzufügen'}
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
              value={incomeForm.beschreibung}
              onChange={(e) =>
                onUpdateIncomeForm('beschreibung', e.target.value)
              }
              placeholder='z.B. Gehalt, Freelancing, Bonus, Nebenjob...'
              className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base'
              autoFocus
            />
          </div>

          {/* Amount and Source Grid */}
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
                value={incomeForm.betrag}
                onChange={(e) => onUpdateIncomeForm('betrag', e.target.value)}
                placeholder='0.00'
                className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base'
              />
            </div>

            {/* Source Field */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                👤 Quelle
              </label>
              <select
                value={incomeForm.quelle}
                onChange={(e) =>
                  onUpdateIncomeForm('quelle', e.target.value as IncomeSource)
                }
                className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base'
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
            disabled={!isIncomeFormValid()}
            className='flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base'
          >
            <span>{editingIncome ? '💾' : '💼'}</span>
            {editingIncome ? 'Änderungen speichern' : 'Einkommen hinzufügen'}
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
