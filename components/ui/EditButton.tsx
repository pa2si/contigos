'use client';

interface EditButtonProps {
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
}

export default function EditButton({
  onClick,
  disabled = false,
  size = 'sm',
  variant = 'primary',
}: EditButtonProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    ghost:
      'bg-transparent text-blue-600 hover:bg-blue-50 border border-blue-200',
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
      title='Bearbeiten'
    >
      {/* Modern pencil icon */}
      <svg
        className={iconSizes[size]}
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        viewBox='0 0 24 24'
      >
        <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
        <path d='m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z' />
      </svg>
    </button>
  );
}
