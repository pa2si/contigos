'use client';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  inline?: boolean; // For inline loading (buttons, etc.)
}

export function LoadingSpinner({
  message = 'Lade Contigos...',
  size = 'medium',
  inline = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  const containerClasses = {
    small: 'gap-2',
    medium: 'gap-3',
    large: 'gap-4',
  };

  const textClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-xl',
  };

  // Inline spinner for buttons/forms
  if (inline) {
    return (
      <div className={`flex items-center ${containerClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} border-2 border-gray-300 rounded-full animate-spin`}
          style={{
            borderTopColor: '#3b82f6',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        {message && (
          <span className={`${textClasses[size]} text-gray-600 ml-2`}>
            {message}
          </span>
        )}
      </div>
    );
  }

  // Full-screen loading
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className={`flex flex-col items-center ${containerClasses[size]}`}>
        {/* Animated spinner */}
        <div className='relative'>
          {/* Outer ring */}
          <div
            className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full animate-spin`}
            style={{
              borderTopColor: '#3b82f6', // blue-500
              borderRightColor: '#10b981', // emerald-500
              animation: 'spin 1s linear infinite',
            }}
          />

          {/* Inner pulse dot */}
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full animate-pulse' />
        </div>

        {/* Loading message */}
        <div
          className={`${textClasses[size]} font-medium text-gray-700 animate-pulse`}
        >
          {message}
        </div>

        {/* Loading dots animation */}
        <div className='flex space-x-1'>
          <div
            className='w-2 h-2 bg-blue-500 rounded-full animate-bounce'
            style={{ animationDelay: '0ms' }}
          />
          <div
            className='w-2 h-2 bg-green-500 rounded-full animate-bounce'
            style={{ animationDelay: '150ms' }}
          />
          <div
            className='w-2 h-2 bg-blue-500 rounded-full animate-bounce'
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}

// Convenience component for button loading states
export function ButtonSpinner({ message }: { message?: string }) {
  return <LoadingSpinner message={message} size='small' inline={true} />;
}

// Default export for backward compatibility
export default LoadingSpinner;
