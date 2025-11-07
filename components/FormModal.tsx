'use client';

import { Payer, IncomeSource } from '@prisma/client';
import { useState } from 'react';
import { Partner } from '@/types';
import { ButtonSpinner } from '@/components/LoadingSpinner';
import Modal from '@/components/ui/Modal';

type FormType = 'expense' | 'income' | 'private-expense';
type ThirdFieldValue = Payer | IncomeSource | Partner;

interface FormModalConfig {
  title: {
    icon: string;
    add: string;
    edit: string;
  };
  fields: {
    description: {
      placeholder: string;
    };
    thirdField: {
      label: string;
      fieldName: string;
      options: Array<{
        value: string;
        label: string;
      }>;
    };
  };
  button: {
    icon: string;
    add: string;
    edit: string;
  };
}

interface FormModalProps {
  type: FormType;
  isOpen: boolean;
  onClose: () => void;
  isEditing?: boolean;
  formData: {
    beschreibung: string;
    betrag: string;
    thirdField: ThirdFieldValue;
  };
  onUpdateForm: (field: string, value: string | ThirdFieldValue) => void;
  onSave: () => Promise<void>;
  isFormValid: () => boolean;
}

const FORM_CONFIGS: Record<FormType, FormModalConfig> = {
  expense: {
    title: {
      icon: '➕',
      add: 'Neue Ausgabe hinzufügen',
      edit: 'Ausgabe bearbeiten',
    },
    fields: {
      description: {
        placeholder: 'z.B. Einkauf, Miete, Restaurantbesuch...',
      },
      thirdField: {
        label: '👤 Bezahlt von',
        fieldName: 'bezahlt_von',
        options: [
          { value: 'Partner1', label: '👨‍💼 Pascal' },
          { value: 'Partner2', label: '👩‍💼 Caro' },
          { value: 'Gemeinschaftskonto', label: '🏦 Gemeinschaftskonto' },
        ],
      },
    },
    button: {
      icon: '➕',
      add: 'Ausgabe hinzufügen',
      edit: 'Änderungen speichern',
    },
  },
  income: {
    title: {
      icon: '💼',
      add: 'Neues Einkommen hinzufügen',
      edit: 'Einkommen bearbeiten',
    },
    fields: {
      description: {
        placeholder: 'z.B. Gehalt, Freelancing, Bonus, Nebenjob...',
      },
      thirdField: {
        label: '👤 Quelle',
        fieldName: 'quelle',
        options: [
          { value: 'Partner1', label: '👨‍💼 Pascal' },
          { value: 'Partner2', label: '👩‍💼 Caro' },
        ],
      },
    },
    button: {
      icon: '💼',
      add: 'Einkommen hinzufügen',
      edit: 'Änderungen speichern',
    },
  },
  'private-expense': {
    title: {
      icon: '🛍️',
      add: 'Neue Private Ausgabe hinzufügen',
      edit: 'Private Ausgabe bearbeiten',
    },
    fields: {
      description: {
        placeholder: 'z.B. abos, creditos, bvg ...',
      },
      thirdField: {
        label: '👤 Person',
        fieldName: 'person',
        options: [
          { value: 'Partner1', label: '👨‍💼 Pascal' },
          { value: 'Partner2', label: '👩‍💼 Caro' },
        ],
      },
    },
    button: {
      icon: '🛍️',
      add: 'Private Ausgabe hinzufügen',
      edit: 'Änderungen speichern',
    },
  },
};

export default function FormModal({
  type,
  isOpen,
  onClose,
  isEditing = false,
  formData,
  onUpdateForm,
  onSave,
  isFormValid,
}: FormModalProps) {
  const config = FORM_CONFIGS[type];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!isFormValid() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSave();
      onClose();
    } catch (error) {
      console.error('Error saving form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && isFormValid()) {
      handleSave();
    }
  };

  // Color scheme based on selected person/payer/source
  const getColors = () => {
    if (formData.thirdField === 'Partner1') {
      return {
        borderColor: 'border-gray-200 focus:border-blue-500',
        ringColor: 'focus:ring-blue-500',
        buttonFrom: 'from-blue-500',
        buttonTo: 'to-blue-600',
        buttonHoverFrom: 'hover:from-blue-600',
        buttonHoverTo: 'hover:to-blue-700',
        headerFrom: 'from-blue-50',
        headerTo: 'to-blue-100',
      };
    } else if (formData.thirdField === 'Partner2') {
      return {
        borderColor: 'border-gray-200 focus:border-green-500',
        ringColor: 'focus:ring-green-500',
        buttonFrom: 'from-green-500',
        buttonTo: 'to-green-600',
        buttonHoverFrom: 'hover:from-green-600',
        buttonHoverTo: 'hover:to-green-700',
        headerFrom: 'from-emerald-50',
        headerTo: 'to-green-100',
      };
    } else {
      // Gemeinschaftskonto or default
      return {
        borderColor: 'border-gray-200 focus:border-purple-500',
        ringColor: 'focus:ring-purple-500',
        buttonFrom: 'from-purple-500',
        buttonTo: 'to-pink-600',
        buttonHoverFrom: 'hover:from-purple-600',
        buttonHoverTo: 'hover:to-pink-700',
        headerFrom: 'from-purple-50',
        headerTo: 'to-pink-50',
      };
    }
  };

  const colors = getColors();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <span className='text-xl mr-2'>
            {isEditing ? '✏️' : config.title.icon}
          </span>
          {isEditing ? config.title.edit : config.title.add}
        </>
      }
  headerClass={`flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-linear-to-r ${colors.headerFrom} ${colors.headerTo} rounded-t-2xl`}
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
              value={formData.beschreibung}
              onChange={(e) => onUpdateForm('beschreibung', e.target.value)}
              placeholder={config.fields.description.placeholder}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm sm:text-base ${colors.borderColor} ${colors.ringColor}`}
              autoFocus
            />
          </div>

          {/* Amount and Third Field Grid */}
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
                value={formData.betrag}
                onChange={(e) => onUpdateForm('betrag', e.target.value)}
                placeholder='0.00'
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm sm:text-base ${colors.borderColor} ${colors.ringColor}`}
              />
            </div>

            {/* Third Field (Person/Payer/Source) */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {config.fields.thirdField.label}
              </label>
              <select
                value={formData.thirdField as string}
                onChange={(e) =>
                  onUpdateForm(
                    config.fields.thirdField.fieldName,
                    e.target.value as ThirdFieldValue
                  )
                }
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm sm:text-base ${colors.borderColor} ${colors.ringColor}`}
              >
                {config.fields.thirdField.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 pt-6 border-t border-gray-200'>
          <button
            onClick={handleSave}
            disabled={!isFormValid() || isSubmitting}
            className={`flex-1 sm:flex-none px-6 py-3 bg-linear-to-r text-white rounded-xl font-medium disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base ${colors.buttonFrom} ${colors.buttonTo} ${colors.buttonHoverFrom} ${colors.buttonHoverTo}`}
          >
            {isSubmitting ? (
              <ButtonSpinner message={isEditing ? 'Speichern...' : 'Hinzufügen...'} />
            ) : (
              <>
                <span>{isEditing ? '💾' : config.button.icon}</span>
                {isEditing ? config.button.edit : config.button.add}
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className='flex-1 sm:flex-none px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 transform flex items-center justify-center gap-2 text-sm sm:text-base'
          >
            <span>❌</span>
            Abbrechen
          </button>
        </div>
      </div>
    </Modal>
  );
}
