'use client';

interface EditButtonProps {
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'income';
}

export default function EditButton({
  onClick,
  disabled = false,
  size = 'sm',
  variant = 'default',
}: EditButtonProps) {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const colorClasses =
    variant === 'income'
      ? 'text-gray-600 hover:text-gray-800 cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
      : 'text-gray-500 hover:text-blue-600 cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={colorClasses}
      title='Bearbeiten'
    >
      {/* Modern edit icon - simple pencil */}
      <svg
        className={iconSizes[size]}
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        viewBox='0 0 24 24'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M12 20h9' />
        <path d='M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' />
      </svg>
    </button>
  );
}
