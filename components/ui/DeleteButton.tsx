'use client';

interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'danger' | 'ghost' | 'outline';
}

export default function DeleteButton({
  onClick,
  disabled = false,
  size = 'sm',
  variant = 'danger',
}: DeleteButtonProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const variantClasses = {
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'bg-transparent text-red-600 hover:bg-red-50 border border-red-200',
    outline: 'bg-white text-red-600 hover:bg-red-50 border border-red-300',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded transition-colors duration-200 flex items-center justify-center
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-current
      `}
      title='Löschen'
    >
      {/* Modern X icon */}
      <svg
        className={iconSizes[size]}
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        viewBox='0 0 24 24'
      >
        <path d='M18 6L6 18' />
        <path d='M6 6l12 12' />
      </svg>
    </button>
  );
}
