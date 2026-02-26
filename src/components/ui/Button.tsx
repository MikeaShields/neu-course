import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={twMerge(clsx(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500': variant === 'primary',
          'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500': variant === 'secondary',
          'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500': variant === 'ghost',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
      ), className)}
      {...props}
    >
      {children}
    </button>
  );
}
