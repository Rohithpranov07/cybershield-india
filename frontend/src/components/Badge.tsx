import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant: 'ai-generated' | 'authentic' | 'pending' | 'verified' | 'warning';
  className?: string;
}

export function Badge({ children, variant, className = '' }: BadgeProps) {
  const variants = {
    'ai-generated': 'bg-red-500 text-white',
    'authentic': 'bg-blue-600 text-white',
    'pending': 'bg-yellow-500 text-gray-900',
    'verified': 'bg-blue-700 text-white',
    'warning': 'bg-orange-500 text-white'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}