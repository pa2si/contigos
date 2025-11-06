'use client';

import React, { PropsWithChildren } from 'react';

type Variant = 'blue' | 'green' | 'summary';

interface CardProps extends PropsWithChildren {
  variant?: Variant;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  blue: 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-200/50 rounded-xl p-4 space-y-4 backdrop-blur',
  green:
    'bg-gradient-to-r from-emerald-500/10 to-green-600/10 border border-emerald-200/50 rounded-xl p-4 space-y-4 backdrop-blur',
  summary:
    'p-4 lg:p-6 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg border border-blue-200',
};

export default function Card({
  variant = 'blue',
  className = '',
  children,
}: CardProps) {
  const base = variantClasses[variant] ?? variantClasses.blue;
  return <div className={`${base} ${className}`.trim()}>{children}</div>;
}
