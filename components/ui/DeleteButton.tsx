'use client';

interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'income';
}

export default function DeleteButton({
  onClick,
  disabled = false,
  size = 'sm',
  variant = 'default',
}: DeleteButtonProps) {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const colorClasses =
    variant === 'income'
      ? 'text-gray-600 hover:text-red-600 cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
      : 'text-gray-500 hover:text-red-600 cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={colorClasses}
      title='Löschen'
    >
      {/* Red X icon - same as modal close button */}
      <svg
        className={iconSizes[size]}
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        viewBox='0 0 24 24'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M18 6L6 18' />
        <path d='M6 6l12 12' />
      </svg>
    </button>
  );
}
